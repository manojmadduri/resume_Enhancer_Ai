const Resume = require('../models/Resume');
const { Configuration, OpenAIApi } = require('openai');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mammoth = require('mammoth');
const pdf = require('pdf-parse');

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname.replace(/\s+/g, '_') + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['.pdf', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and DOCX files are allowed.'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('resume');

// Initialize OpenAI
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

// Function to extract text from PDF or DOCX
async function extractTextFromFile(filePath, format) {
    try {
        if (format === 'PDF') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        } else if (format === 'DOCX') {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        }
        throw new Error('Unsupported file format');
    } catch (error) {
        console.error('Error extracting text:', error);
        throw error;
    }
}

exports.uploadResume = async (req, res) => {
    let uploadedFile = null;
    
    try {
        // Handle file upload using Promise
        await new Promise((resolve, reject) => {
            upload(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    reject(new Error(err.message));
                } else if (err) {
                    reject(err);
                } else {
                    uploadedFile = req.file;
                    resolve();
                }
            });
        });

        if (!uploadedFile) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded'
            });
        }

        // Get file format
        const format = path.extname(uploadedFile.originalname).toUpperCase().slice(1); // Remove the dot and convert to uppercase

        // Create relative URL for file
        const fileUrl = `/uploads/${path.basename(uploadedFile.path)}`;

        console.log('Creating resume with:', {
            userId: req.user.id,
            originalFileName: uploadedFile.originalname,
            fileUrl,
            format
        });

        // Save resume to database
        const resume = await Resume.create(
            req.user.id,
            uploadedFile.originalname,
            fileUrl,
            format
        );

        console.log('Resume created:', resume);

        // Send response
        res.status(201).json({
            success: true,
            resume: {
                id: resume.id,
                originalFileName: resume.original_file_name,
                fileUrl: resume.file_url,
                format: resume.format,
                createdAt: resume.created_at,
                updatedAt: resume.updated_at
            }
        });
    } catch (error) {
        console.error('Resume upload error:', error);

        // If file was uploaded but database operation failed, clean up the file
        if (uploadedFile && uploadedFile.path) {
            try {
                fs.unlinkSync(uploadedFile.path);
            } catch (unlinkError) {
                console.error('Error cleaning up file:', unlinkError);
            }
        }

        res.status(500).json({
            success: false,
            error: error.message || 'Failed to upload resume'
        });
    }
};

exports.getResumes = async (req, res) => {
    try {
        const resumes = await Resume.findByUserId(req.user.id);
        
        res.json({
            success: true,
            resumes: resumes.map(resume => ({
                id: resume.id,
                originalFileName: resume.original_file_name,
                fileUrl: resume.file_url,
                format: resume.format,
                createdAt: resume.created_at
            }))
        });
    } catch (error) {
        console.error('Get resumes error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Error fetching resumes'
        });
    }
};

// Analyze resume against job description
exports.analyzeResume = async (req, res) => {
    try {
        const { id } = req.params;
        const { jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                success: false,
                error: 'Job description is required'
            });
        }

        // Get resume from database
        const resume = await Resume.findById(id);
        if (!resume) {
            return res.status(404).json({
                success: false,
                error: 'Resume not found'
            });
        }

        // Extract text from resume file
        const resumeText = await extractTextFromFile(
            path.join(__dirname, '..', resume.file_url),
            resume.format
        );

        // Analyze using OpenAI
        const analysis = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert resume analyzer. Analyze the resume against the job description and provide detailed feedback."
                },
                {
                    role: "user",
                    content: `
                        Please analyze this resume against the job description and provide:
                        1. A match score (0-1)
                        2. Key matching skills and qualifications
                        3. Missing keywords and skills
                        4. Specific suggestions for improvement
                        
                        Job Description:
                        ${jobDescription}
                        
                        Resume:
                        ${resumeText}
                    `
                }
            ]
        });

        // Parse the analysis
        const analysisText = analysis.data.choices[0].message.content;
        const analysisResult = {
            matchScore: 0.7, // This should be extracted from the AI response
            keyMatches: [],
            missingKeywords: [],
            suggestions: []
        };

        // Parse AI response to extract structured data
        try {
            // This is a simple parsing example - you should implement more robust parsing
            const lines = analysisText.split('\n');
            lines.forEach(line => {
                if (line.includes('Match Score:')) {
                    analysisResult.matchScore = parseFloat(line.split(':')[1]) || 0.7;
                } else if (line.includes('Key Matches:')) {
                    analysisResult.keyMatches = line.split(':')[1].split(',').map(s => s.trim());
                } else if (line.includes('Missing Keywords:')) {
                    analysisResult.missingKeywords = line.split(':')[1].split(',').map(s => s.trim());
                } else if (line.includes('Suggestions:')) {
                    analysisResult.suggestions.push(line.split(':')[1].trim());
                }
            });
        } catch (error) {
            console.error('Error parsing AI response:', error);
            // Provide fallback data if parsing fails
            analysisResult.keyMatches = ['Experience parsing error'];
            analysisResult.missingKeywords = ['Data unavailable'];
            analysisResult.suggestions = ['Please try analysis again'];
        }

        res.json({
            success: true,
            analysis: analysisResult
        });

    } catch (error) {
        console.error('Resume analysis error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to analyze resume'
        });
    }
};

// Enhance resume with AI suggestions
exports.enhanceResume = async (req, res) => {
    try {
        const { id } = req.params;
        const { jobDescription, targetAreas } = req.body;

        if (!jobDescription) {
            return res.status(400).json({
                success: false,
                error: 'Job description is required'
            });
        }

        // Get resume from database
        const resume = await Resume.findById(id);
        if (!resume) {
            return res.status(404).json({
                success: false,
                error: 'Resume not found'
            });
        }

        // Extract text from resume file
        const resumeText = await extractTextFromFile(
            path.join(__dirname, '..', resume.file_url),
            resume.format
        );

        // Generate improvements using OpenAI
        const enhancement = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: "You are an expert resume writer. Enhance the resume to better match the job description while maintaining truthfulness."
                },
                {
                    role: "user",
                    content: `
                        Please enhance this resume to better match the job description.
                        Focus on these areas: ${targetAreas ? targetAreas.join(', ') : 'all sections'}
                        
                        Job Description:
                        ${jobDescription}
                        
                        Current Resume:
                        ${resumeText}
                        
                        Provide:
                        1. Enhanced resume content
                        2. List of improvements made
                        3. Explanation of each enhancement
                    `
                }
            ]
        });

        const enhancedContent = enhancement.data.choices[0].message.content;

        // Update resume in database with enhanced content
        await Resume.update(id, { content: enhancedContent });

        res.json({
            success: true,
            message: 'Resume enhanced successfully',
            enhancedContent
        });

    } catch (error) {
        console.error('Resume enhancement error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to enhance resume'
        });
    }
};

exports.updateResume = async (req, res) => {
    try {
        const { resumeId, versionName, customizations } = req.body;

        if (!resumeId) {
            return res.status(400).json({
                success: false,
                error: 'Resume ID is required'
            });
        }

        const resume = await Resume.findById(resumeId);

        if (!resume) {
            return res.status(404).json({
                success: false,
                error: 'Resume not found'
            });
        }

        if (versionName) {
            await Resume.addVersion(resumeId, versionName, customizations);
        }

        if (customizations) {
            await Resume.updateCustomization(resumeId, customizations);
        }

        // Get updated resume
        const updatedResume = await Resume.findById(resumeId);
        
        res.json({
            success: true,
            resume: {
                id: updatedResume.id,
                versions: updatedResume.versions,
                currentCustomization: updatedResume.current_customization
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message || 'Error updating resume'
        });
    }
};

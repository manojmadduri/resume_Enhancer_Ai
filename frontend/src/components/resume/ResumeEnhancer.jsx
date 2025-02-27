import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Typography,
    TextField,
    CircularProgress,
    Snackbar,
    Alert,
    Tabs,
    Tab,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Select,
    FormControl,
    InputLabel
} from '@mui/material';
import {
    Save as SaveIcon,
    Download as DownloadIcon,
    History as HistoryIcon,
    Style as StyleIcon,
    FormatPaint as FormatPaintIcon
} from '@mui/icons-material';
import ResumeUploader from './ResumeUploader';
import ResumePreview from './ResumePreview';
import CustomizationPanel from './CustomizationPanel';
import JobDescriptionUploader from './JobDescriptionUploader';

const ResumeEnhancer = () => {
    const { currentUser } = useAuth();
    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [currentTab, setCurrentTab] = useState(0);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [customizations, setCustomizations] = useState({
        font: 'Arial',
        theme: 'professional',
        sections: {
            summary: true,
            experience: true,
            education: true,
            skills: true,
            projects: true
        },
        format: 'original'
    });
    const [aiSuggestions, setAiSuggestions] = useState({
        summary: [],
        experience: [],
        skills: [],
        keywords: []
    });

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const response = await fetch('/api/resume/list', {
                credentials: 'include'
            });
            if (!response.ok) throw new Error('Failed to fetch resumes');
            const data = await response.json();
            setResumes(data);
        } catch (err) {
            setError('Failed to fetch resumes');
        }
    };

    const handleUploadSuccess = (resume) => {
        setResumes([...resumes, resume]);
        setSelectedResume(resume);
        setSuccess('Resume uploaded successfully');
    };

    const handleEnhance = async () => {
        if (!selectedResume || !jobDescription) {
            setError('Please select a resume and enter a job description');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/resume/enhance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    resumeId: selectedResume._id,
                    jobDescription,
                    customizations,
                    sections: Object.keys(customizations.sections).filter(key => customizations.sections[key])
                })
            });

            if (!response.ok) throw new Error('Failed to enhance resume');

            const data = await response.json();
            setAiSuggestions(data.suggestions);
            setSelectedResume({
                ...selectedResume,
                versions: [...(selectedResume.versions || []), data.enhancedVersion]
            });
            setSelectedVersion(data.enhancedVersion);
            setSuccess('Resume enhanced successfully');
        } catch (err) {
            setError('Failed to enhance resume: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCustomizationChange = (type, value) => {
        setCustomizations(prev => ({
            ...prev,
            [type]: value
        }));
    };

    const handleSectionToggle = (section) => {
        setCustomizations(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                [section]: !prev.sections[section]
            }
        }));
    };

    const handleDownload = async (format) => {
        try {
            const response = await fetch(`/api/resume/download/${selectedResume._id}/${selectedVersion.id}`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error('Failed to download resume');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `resume_${format}.${format}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError('Failed to download resume');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="h4" gutterBottom>
                            Resume Enhancer
                        </Typography>
                        
                        <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)} sx={{ mb: 2 }}>
                            <Tab label="Upload" />
                            <Tab label="Customize" />
                            <Tab label="Enhance" />
                            <Tab label="Preview" />
                        </Tabs>

                        {currentTab === 0 && (
                            <ResumeUploader onUploadSuccess={handleUploadSuccess} />
                        )}

                        {currentTab === 1 && (
                            <CustomizationPanel
                                customizations={customizations}
                                onChange={handleCustomizationChange}
                                onSectionToggle={handleSectionToggle}
                            />
                        )}

                        {currentTab === 2 && (
                            <Box>
                                <JobDescriptionUploader
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                />
                                <Button
                                    variant="contained"
                                    onClick={handleEnhance}
                                    disabled={loading || !selectedResume}
                                    startIcon={loading ? <CircularProgress size={20} /> : null}
                                    sx={{ mt: 2 }}
                                >
                                    {loading ? 'Enhancing...' : 'Enhance Resume'}
                                </Button>
                            </Box>
                        )}

                        {currentTab === 3 && selectedResume && (
                            <Box>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <ResumePreview
                                            resume={selectedResume}
                                            version={selectedVersion}
                                            suggestions={aiSuggestions}
                                        />
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Paper sx={{ p: 2 }}>
                                            <Typography variant="h6" gutterBottom>
                                                Download Options
                                            </Typography>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<DownloadIcon />}
                                                onClick={() => handleDownload('pdf')}
                                                sx={{ mb: 1 }}
                                            >
                                                Download PDF
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                startIcon={<DownloadIcon />}
                                                onClick={() => handleDownload('docx')}
                                            >
                                                Download DOCX
                                            </Button>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            <Snackbar
                open={!!error || !!success}
                autoHideDuration={6000}
                onClose={() => {
                    setError('');
                    setSuccess('');
                }}
            >
                <Alert
                    severity={error ? 'error' : 'success'}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {error || success}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default ResumeEnhancer;

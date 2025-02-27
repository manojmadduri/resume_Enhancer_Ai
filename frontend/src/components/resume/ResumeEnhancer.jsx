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
    Alert
} from '@mui/material';
import ResumeUploader from './ResumeUploader';
import ResumePreview from './ResumePreview';
import CustomizationPanel from './CustomizationPanel';

const ResumeEnhancer = () => {
    const { currentUser } = useAuth();
    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchResumes();
    }, []);

    const fetchResumes = async () => {
        try {
            const response = await fetch('/api/resume/list', {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Failed to fetch resumes');
            }
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
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    resumeId: selectedResume._id,
                    jobDescription
                })
            });

            if (!response.ok) {
                throw new Error('Failed to enhance resume');
            }

            const data = await response.json();
            setSelectedResume({
                ...selectedResume,
                aiSuggestions: data.suggestions,
                keywords: data.keywords
            });
            setSuccess('Resume enhanced successfully');
        } catch (err) {
            setError('Failed to enhance resume');
        } finally {
            setLoading(false);
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
                        
                        <ResumeUploader onUploadSuccess={handleUploadSuccess} />

                        <Box sx={{ mt: 3 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                variant="outlined"
                                label="Job Description"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                            />
                        </Box>

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleEnhance}
                            disabled={loading || !selectedResume}
                            sx={{ mt: 2 }}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Enhance Resume'}
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={6}>
                    <CustomizationPanel
                        resume={selectedResume}
                        onUpdate={(updatedResume) => setSelectedResume(updatedResume)}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <ResumePreview resume={selectedResume} />
                </Grid>
            </Grid>

            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
                <Alert severity="error">{error}</Alert>
            </Snackbar>

            <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess('')}>
                <Alert severity="success">{success}</Alert>
            </Snackbar>
        </Container>
    );
};

export default ResumeEnhancer;

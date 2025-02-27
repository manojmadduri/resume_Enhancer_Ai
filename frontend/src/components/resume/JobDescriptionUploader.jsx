import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  TextField,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material';
import LoadingSpinner from '../common/LoadingSpinner';

const JobDescriptionUploader = ({ onAnalyze, resumeId }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/resumes/${resumeId}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ jobDescription }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      onAnalyze(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Analyzing your resume against the job description..." />;
  }

  return (
    <Card
      sx={{
        backgroundColor: 'background.paper',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Job Description Analysis
        </Typography>
        <TextField
          multiline
          rows={6}
          fullWidth
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mb: 3 }}
        />
        <Button
          variant="contained"
          onClick={handleAnalyze}
          disabled={!jobDescription.trim()}
          sx={{
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          Analyze Resume Match
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobDescriptionUploader;

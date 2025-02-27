import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Button,
  Typography,
  Paper,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import LoadingSpinner from '../common/LoadingSpinner';

const ResumeUploader = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (isValidFile(droppedFile)) {
      setFile(droppedFile);
      setError('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (isValidFile(selectedFile)) {
      setFile(selectedFile);
      setError('');
    }
  };

  const isValidFile = (file) => {
    if (!file) return false;
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a PDF or Word document');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('File size should be less than 5MB');
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!file || !currentUser) {
      setError('Please log in and select a file to upload');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setLoading(true);
    setError('');

    try {
      // Get the current user's ID token
      const token = await currentUser.getIdToken(true); // Force refresh the token
      console.log('Using token for upload:', token.substring(0, 20) + '...');

      const response = await fetch(`${process.env.REACT_APP_API_URL}/resumes/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response body:', responseText);

      if (!response.ok) {
        let errorMessage = 'Upload failed';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error('Error parsing response:', e);
        }
        throw new Error(errorMessage);
      }

      // Parse the response only if it's JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing success response:', e);
        data = { message: 'Upload successful but response was not JSON' };
      }

      console.log('Upload successful:', data);
      navigate('/resume/list');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Uploading your resume..." />;
  }

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 600 }}>
        Upload Your Resume
      </Typography>

      <Card
        sx={{
          backgroundColor: 'background.paper',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 3,
          },
        }}
      >
        <CardContent>
          <Box
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            sx={{
              border: '2px dashed',
              borderColor: 'primary.main',
              borderRadius: 2,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'action.hover',
              },
            }}
            onClick={() => document.getElementById('resume-upload').click()}
          >
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={handleFileInput}
            />
            <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drag and drop your resume here
            </Typography>
            <Typography variant="body2" color="text.secondary">
              or click to select a file
            </Typography>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Supported formats: PDF, DOC, DOCX (max 5MB)
            </Typography>
          </Box>

          {file && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2">
                  Selected file: {file.name}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => setFile(null)}
                  sx={{ color: 'error.main' }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>
          )}

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!file || loading}
            fullWidth
            sx={{ mt: 3 }}
          >
            {loading ? 'Uploading...' : 'Upload Resume'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResumeUploader;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import JobDescriptionUploader from './JobDescriptionUploader';
import LoadingSpinner from '../common/LoadingSpinner';

const ResumeAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchResume();
  }, [id]);

  const fetchResume = async () => {
    try {
      const response = await fetch(`/api/resumes/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch resume');

      const data = await response.json();
      setResume(data);
      setEditedContent(data.content);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysis = (analysisData) => {
    setAnalysis(analysisData);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ content: editedContent }),
      });

      if (!response.ok) throw new Error('Failed to save changes');

      const updatedResume = await response.json();
      setResume(updatedResume);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const getMatchScore = () => {
    if (!analysis) return null;
    return Math.round(analysis.matchScore * 100);
  };

  if (loading) return <LoadingSpinner message="Loading resume analysis..." />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
          Resume Analysis
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/resume/list')}
          sx={{
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.dark',
              backgroundColor: 'primary.light',
              color: 'primary.contrastText',
            },
          }}
        >
          Back to Resumes
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: { md: '1fr 1fr' } }}>
        {/* Resume Content */}
        <Card
          sx={{
            backgroundColor: 'background.paper',
            transition: 'all 0.3s ease',
            height: 'fit-content',
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Resume Content</Typography>
              <Button
                startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                onClick={editMode ? handleSave : () => setEditMode(true)}
                disabled={saving}
              >
                {editMode ? 'Save Changes' : 'Edit'}
              </Button>
            </Box>
            {editMode ? (
              <TextField
                multiline
                rows={20}
                fullWidth
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                sx={{ mb: 2 }}
              />
            ) : (
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  mb: 2,
                  p: 2,
                  backgroundColor: 'background.default',
                  borderRadius: 1,
                  maxHeight: '500px',
                  overflowY: 'auto',
                }}
              >
                {resume.content}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Analysis Section */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <JobDescriptionUploader onAnalyze={handleAnalysis} resumeId={id} />

          {analysis && (
            <Card
              sx={{
                backgroundColor: 'background.paper',
                transition: 'all 0.3s ease',
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3 }}>Analysis Results</Typography>
                
                {/* Match Score */}
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1">Match Score</Typography>
                    <Typography variant="body1" color="primary" fontWeight="bold">
                      {getMatchScore()}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={getMatchScore()}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: 'background.default',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                      },
                    }}
                  />
                </Box>

                {/* Key Matches */}
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Key Matches
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {analysis.keyMatches.map((match, index) => (
                    <Chip
                      key={index}
                      label={match}
                      color="success"
                      size="small"
                      icon={<CheckCircleIcon />}
                    />
                  ))}
                </Box>

                {/* Missing Keywords */}
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Missing Keywords
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                  {analysis.missingKeywords.map((keyword, index) => (
                    <Chip
                      key={index}
                      label={keyword}
                      color="warning"
                      size="small"
                      icon={<WarningIcon />}
                    />
                  ))}
                </Box>

                {/* Improvement Suggestions */}
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Improvement Suggestions
                </Typography>
                <List>
                  {analysis.suggestions.map((suggestion, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <TipsAndUpdatesIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={suggestion} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ResumeAnalysis;

import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
  Chip,
  Alert,
  Snackbar,
  Divider,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  LinkedIn as LinkedInIcon,
  GitHub as GitHubIcon,
  Language as WebsiteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const Profile = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newJobType, setNewJobType] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const theme = useTheme();
  
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    title: '',
    bio: '',
    phone: '',
    location: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    skills: [],
    experienceYears: '',
    preferredJobTypes: [],
    preferredLocations: [],
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          setLoading(false);
          return; // New user, no profile yet
        }
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      if (data.success) {
        setProfile(data.profile);
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const method = profile.id ? 'PUT' : 'POST';
      const response = await fetch('/api/profile', {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess('Profile saved successfully');
        setProfile(data.profile);
      } else {
        throw new Error(data.error || 'Failed to save profile');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const addItem = (field, value, setValue) => {
    if (value.trim()) {
      setProfile(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()],
      }));
      setValue('');
    }
  };

  const removeItem = (field, index) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleAddSkill = () => {
    addItem('skills', newSkill, setNewSkill);
  };

  const handleDeleteSkill = (index) => {
    removeItem('skills', index);
  };

  const handleAddJobType = () => {
    addItem('preferredJobTypes', newJobType, setNewJobType);
  };

  const handleDeleteJobType = (index) => {
    removeItem('preferredJobTypes', index);
  };

  const handleAddLocation = () => {
    addItem('preferredLocations', newLocation, setNewLocation);
  };

  const handleDeleteLocation = (index) => {
    removeItem('preferredLocations', index);
  };

  const handleEditProfile = () => {
    // implement edit profile logic here
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ 
          fontWeight: 600,
          color: theme.palette.primary.main,
          textAlign: 'center',
          mb: 3
        }}>
          My Profile
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column - Basic Info */}
        <Grid item xs={12} md={4}>
          <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '3rem'
                  }}
                >
                  <PersonIcon fontSize="inherit" />
                </Avatar>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {profile.firstName} {profile.lastName}
                </Typography>
                <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                  {profile.title || 'Add your title'}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                  {profile.bio || 'Add your bio'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Contact Information
                </Typography>
                <Typography variant="body2" gutterBottom>
                  📱 {profile.phone || 'Add your phone number'}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  📍 {profile.location || 'Add your location'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Social Links
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {profile.linkedinUrl && (
                    <IconButton
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      size="small"
                    >
                      <LinkedInIcon />
                    </IconButton>
                  )}
                  {profile.githubUrl && (
                    <IconButton
                      href={profile.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      size="small"
                    >
                      <GitHubIcon />
                    </IconButton>
                  )}
                  {profile.portfolioUrl && (
                    <IconButton
                      href={profile.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      size="small"
                    >
                      <WebsiteIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column - Details */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                  Skills
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {profile.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      onDelete={() => handleDeleteSkill(index)}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddSkill}
                    disabled={!newSkill.trim()}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                  Preferred Job Types
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {profile.preferredJobTypes.map((jobType, index) => (
                    <Chip
                      key={index}
                      label={jobType}
                      onDelete={() => handleDeleteJobType(index)}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    value={newJobType}
                    onChange={(e) => setNewJobType(e.target.value)}
                    placeholder="Add job type"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddJobType}
                    disabled={!newJobType.trim()}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Box>
              </Box>

              <Box>
                <Typography variant="h6" gutterBottom sx={{ color: theme.palette.primary.main }}>
                  Preferred Locations
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  {profile.preferredLocations.map((location, index) => (
                    <Chip
                      key={index}
                      label={location}
                      onDelete={() => handleDeleteLocation(index)}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    size="small"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="Add location"
                    sx={{ flexGrow: 1 }}
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddLocation}
                    disabled={!newLocation.trim()}
                    startIcon={<AddIcon />}
                  >
                    Add
                  </Button>
                </Box>
              </Box>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  onClick={handleEditProfile}
                  disabled={saving}
                  startIcon={<EditIcon />}
                >
                  Edit Profile
                </Button>
              </Box>
            </CardContent>
          </Card>
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
          onClose={() => {
            setError('');
            setSuccess('');
          }}
          severity={error ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {error || success}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;

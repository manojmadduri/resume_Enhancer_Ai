import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  UploadFile as UploadIcon,
  Description as ResumeIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      title: 'Upload Resume',
      description: 'Upload your resume in PDF or Word format',
      icon: <UploadIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/resume/upload'),
      buttonText: 'Upload Now',
    },
    {
      title: 'Manage Resumes',
      description: 'View and manage your uploaded resumes',
      icon: <ResumeIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/resume/list'),
      buttonText: 'View Resumes',
    },
    {
      title: 'Resume Analysis',
      description: 'Get AI-powered analysis and suggestions',
      icon: <AnalyticsIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/resume/list'),
      buttonText: 'Analyze Resume',
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            mb: 2,
          }}
        >
          AI Resume Enhancer
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Optimize your resume with AI-powered analysis and suggestions
        </Typography>

        {!currentUser && (
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ mr: 2 }}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register')}
            >
              Register
            </Button>
          </Box>
        )}
      </Box>

      {currentUser && (
        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Button
                    variant="contained"
                    onClick={feature.action}
                    sx={{
                      px: 4,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    }}
                  >
                    {feature.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Paper
        elevation={0}
        sx={{
          mt: 8,
          mb: 4,
          p: 4,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Why Choose Our Resume Enhancer?
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              AI-Powered Analysis
            </Typography>
            <Typography color="text.secondary">
              Get instant feedback and suggestions using advanced AI technology
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Job Description Matching
            </Typography>
            <Typography color="text.secondary">
              Optimize your resume for specific job descriptions
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Professional Format
            </Typography>
            <Typography color="text.secondary">
              Ensure your resume follows industry best practices
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Home;

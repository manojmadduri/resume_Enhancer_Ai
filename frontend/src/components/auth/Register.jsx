import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
} from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      setSuccess(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError('Failed to create an account. ' + error.message);
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Failed to sign up with Google.');
      console.error('Google signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper
          elevation={2}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Create Account
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Join Resume Enhancer to improve your resume
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ width: '100%', mb: 3 }}>
              Account created successfully!
            </Alert>
          )}

          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignup}
            disabled={loading}
            sx={{ mb: 3, py: 1 }}
          >
            Sign up with Google
          </Button>

          <Divider sx={{ width: '100%', mb: 3 }}>
            <Typography color="text.secondary">OR</Typography>
          </Divider>

          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.2 }}
            >
              Create Account
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" align="center">
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: 'inherit',
                textDecoration: 'none',
                fontWeight: 600,
                color: '#2196F3',
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;

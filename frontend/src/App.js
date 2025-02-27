import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import theme from './theme';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/profile/Profile';
import ResumeUploader from './components/resume/ResumeUploader';
import ResumeList from './components/resume/ResumeList';
import ResumeAnalysis from './components/resume/ResumeAnalysis';
import PrivateRoute from './components/auth/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Box sx={{ 
            minHeight: '100vh',
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Navigation />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/resume/list"
                  element={
                    <PrivateRoute>
                      <ResumeList />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/resume/upload"
                  element={
                    <PrivateRoute>
                      <ResumeUploader />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/resume/analysis/:id"
                  element={
                    <PrivateRoute>
                      <ResumeAnalysis />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Box>
          </Box>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;

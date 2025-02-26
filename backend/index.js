const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the Authentication API',
        version: '1.0.0',
        endpoints: {
            auth: {
                base: '/api/auth',
                routes: {
                    register: 'POST /api/auth/register',
                    login: 'POST /api/auth/login',
                    googleLogin: 'POST /api/auth/google-login',
                    forgotPassword: 'POST /api/auth/forgot-password',
                    resetPassword: 'POST /api/auth/reset-password'
                }
            }
        },
        health: 'GET /health'
    });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        requested: {
            path: req.path,
            method: req.method
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Handle specific types of errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            message: 'Validation Error',
            errors: err.errors
        });
    }
    
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            message: 'Unauthorized: Invalid or missing authentication token'
        });
    }
    
    // Default error response
    res.status(err.status || 500).json({
        message: err.message || 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}`);
});

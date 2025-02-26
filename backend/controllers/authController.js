const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const firebase = require('firebase-admin');

// Initialize Firebase Admin
if (!firebase.apps.length) {
    firebase.initializeApp({
        credential: firebase.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        })
    });
}

// Use a simpler JWT secret
const JWT_SECRET = 'auth-system-secret-key-2025';

const generateToken = (userId) => {
    try {
        return jwt.sign({ id: userId }, JWT_SECRET, {
            expiresIn: '24h'
        });
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Failed to generate authentication token');
    }
};

exports.register = async (req, res) => {
    try {
        const { email, password, firebaseUid } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check if user already exists in database
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password for database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user in database
        const user = await User.create({
            email,
            password: hashedPassword,
            authProvider: 'email',
            firebaseUid,
            isEmailVerified: false
        });

        // Send success response without token
        res.status(201).json({
            success: true,
            message: 'Registration successful! Please check your email for verification link.',
            user: {
                id: user.id,
                email: user.email,
                isEmailVerified: false
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        
        // Send more specific error messages
        if (error.code === '23505') { // PostgreSQL unique violation
            return res.status(400).json({ message: 'Email already registered' });
        }
        
        res.status(500).json({ message: 'Failed to create account. Please try again.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Find user in database
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Verify Firebase email verification status
        try {
            const firebaseUser = await firebase.auth().getUser(user.firebaseUid);
            if (!firebaseUser.emailVerified) {
                return res.status(401).json({ message: 'Please verify your email before logging in' });
            }

            // Update email verification status in database if needed
            if (!user.is_email_verified) {
                await User.updateEmailVerification(email);
            }
        } catch (error) {
            console.error('Error checking email verification:', error);
            return res.status(401).json({ message: 'Error verifying email status' });
        }

        // Generate JWT token
        const token = generateToken(user.id);

        res.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                isEmailVerified: true
            },
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Failed to login' });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { idToken } = req.body;
        
        // Verify the ID token
        const decodedToken = await firebase.auth().verifyIdToken(idToken);
        const { email, sub: firebaseUid } = decodedToken;

        // Check if user exists in database
        let user = await User.findByEmail(email);

        if (!user) {
            // Create new user if doesn't exist
            user = await User.create({
                email,
                authProvider: 'google',
                firebaseUid,
                isEmailVerified: true
            });
        }

        // Generate JWT token
        const token = generateToken(user.id);

        res.json({
            message: 'Google login successful',
            user: {
                id: user.id,
                email: user.email,
                isEmailVerified: true
            },
            token
        });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({ message: 'Failed to login with Google' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send password reset email using Firebase
        await firebase.auth().generatePasswordResetLink(email);

        res.json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Failed to send password reset email' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password in database
        await User.updatePassword(email, hashedPassword);

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Failed to reset password' });
    }
};

exports.verifyToken = async (req, res) => {
    try {
        const { idToken } = req.body;

        // Verify Firebase token
        const decodedToken = await firebase.auth().verifyIdToken(idToken);
        const { email } = decodedToken;

        // Get user from database
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate new JWT token
        const token = generateToken(user.id);

        res.json({
            user: {
                id: user.id,
                email: user.email,
                isEmailVerified: user.is_email_verified
            },
            token
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

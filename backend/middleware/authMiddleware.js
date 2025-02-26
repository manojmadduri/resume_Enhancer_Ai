const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Use the same JWT secret as in authController
const JWT_SECRET = 'auth-system-secret-key-2025';

const authMiddleware = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];

        try {
            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Get user from database
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            // Add user to request
            req.user = user;
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = authMiddleware;

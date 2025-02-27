const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');
const { authPool } = require('../config/db');

const createUserIfNotExists = async (decodedToken) => {
    try {
        // Check if user exists
        const findQuery = `
            SELECT id, email, auth_provider, is_email_verified, created_at
            FROM users
            WHERE firebase_uid = $1
        `;
        const findResult = await authPool.query(findQuery, [decodedToken.uid]);
        
        if (findResult.rows[0]) {
            console.log('Found existing user:', findResult.rows[0]);
            return findResult.rows[0];
        }

        // Create new user if not exists
        const createQuery = `
            INSERT INTO users (email, auth_provider, firebase_uid, is_email_verified)
            VALUES ($1, $2, $3, $4)
            RETURNING id, email, auth_provider, is_email_verified, created_at;
        `;
        
        const createResult = await authPool.query(createQuery, [
            decodedToken.email,
            'firebase',
            decodedToken.uid,
            decodedToken.email_verified || false
        ]);

        console.log('Created new user in database:', createResult.rows[0]);
        return createResult.rows[0];
    } catch (error) {
        console.error('Error in createUserIfNotExists:', error);
        throw error;
    }
};

const protect = async (req, res, next) => {
    try {
        console.log('=== Auth Middleware Start ===');
        console.log('Headers:', req.headers);
        
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
            console.log('Found token:', token.substring(0, 20) + '...');
        } else {
            console.log('No Bearer token found in Authorization header');
            return res.status(401).json({
                success: false,
                error: 'Not authorized - no token'
            });
        }

        try {
            console.log('Verifying Firebase token...');
            const decodedToken = await admin.auth().verifyIdToken(token);
            console.log('Token verified. User:', decodedToken.email);

            // Create or get user from database
            const user = await createUserIfNotExists(decodedToken);
            console.log('User from database:', user);

            // Add user info to request
            req.user = {
                id: user.id,
                email: user.email,
                firebaseUid: decodedToken.uid,
                isEmailVerified: user.is_email_verified
            };

            console.log('=== Auth Middleware Success ===');
            next();
        } catch (error) {
            console.error('Token verification failed:', error);
            return res.status(401).json({
                success: false,
                error: 'Not authorized - invalid token'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error in auth middleware'
        });
    }
};

module.exports = { protect };

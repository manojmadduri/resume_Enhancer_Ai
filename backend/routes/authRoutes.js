const express = require('express');
const { 
    register, 
    login,
    googleLogin, 
    forgotPassword, 
    resetPassword,
    verifyToken
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-token', verifyToken);

// Protected route example
router.get('/profile', protect, (req, res) => {
    res.json({ 
        success: true,
        user: {
            id: req.user.id,
            email: req.user.email,
            isEmailVerified: req.user.is_email_verified,
            authProvider: req.user.auth_provider,
            createdAt: req.user.created_at
        }
    });
});

module.exports = router;

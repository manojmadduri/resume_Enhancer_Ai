const express = require('express');
const { 
    register, 
    login,
    googleLogin, 
    forgotPassword, 
    resetPassword,
    verifyToken
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/verify-token', verifyToken);

// Protected route example
router.get('/profile', authMiddleware, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;

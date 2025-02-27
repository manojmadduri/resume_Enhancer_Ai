const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    uploadResume,
    getResumes,
    analyzeResume,
    enhanceResume,
    updateResume
} = require('../controllers/resumeController');

// Protected routes
router.use(protect);

router.post('/upload', uploadResume);
router.get('/', getResumes);
router.post('/:id/analyze', analyzeResume);
router.post('/:id/enhance', enhanceResume);
router.put('/:id', updateResume);

module.exports = router;

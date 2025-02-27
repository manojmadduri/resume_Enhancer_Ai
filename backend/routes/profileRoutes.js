const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getProfile,
    createProfile,
    updateProfile,
    deleteProfile
} = require('../controllers/profileController');

// All routes are protected
router.use(protect);

router.get('/', getProfile);
router.post('/', createProfile);
router.put('/', updateProfile);
router.delete('/', deleteProfile);

module.exports = router;

const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerUser, loginUser, googleCallback, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

// Google OAuth Routes
// Google OAuth Routes
router.get('/google', (req, res, next) => {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
        return res.status(500).json({
            message: "Google OAuth is not configured. Please add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env file."
        });
    }
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});
router.get(
    '/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    googleCallback
);

// Get current user
router.get('/me', protect, getMe);

module.exports = router;

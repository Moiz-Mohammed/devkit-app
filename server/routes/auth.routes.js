const express = require('express');
const router  = express.Router();
const { signup, login, refresh, me, logout } = require('../controllers/auth.controller');
const { protect }     = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');

// Public routes
router.post('/signup',  authLimiter, signup);
router.post('/login',   authLimiter, login);
router.post('/refresh', refresh);

// Protected routes
router.get('/me',      protect, me);
router.post('/logout', protect, logout);

module.exports = router;

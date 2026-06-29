const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: 'Too many attempts, try again later' },
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

module.exports = { authLimiter, apiLimiter };

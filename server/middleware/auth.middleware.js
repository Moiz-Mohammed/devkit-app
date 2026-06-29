const { verifyAccess } = require('../utils/jwt');

/**
 * protect — verifies JWT and attaches user payload to req.user
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated — missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    req.user = verifyAccess(token);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired — please refresh' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

/**
 * adminOnly — must come after protect
 */
const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

module.exports = { protect, adminOnly };

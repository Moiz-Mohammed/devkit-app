const jwt = require('jsonwebtoken');

const ACCESS_SECRET  = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES  = process.env.JWT_EXPIRES_IN  || '1d';
const REFRESH_EXPIRES = '7d';

/**
 * Generate an access token (short-lived)
 */
const signAccess = (payload) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });

/**
 * Generate a refresh token (long-lived)
 */
const signRefresh = (payload) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });

/**
 * Verify an access token — throws on invalid/expired
 */
const verifyAccess = (token) =>
  jwt.verify(token, ACCESS_SECRET);

/**
 * Verify a refresh token — throws on invalid/expired
 */
const verifyRefresh = (token) =>
  jwt.verify(token, REFRESH_SECRET);

/**
 * Create both tokens for a user
 */
const createTokenPair = (user) => {
  const payload = { id: user.id, email: user.email, isAdmin: user.isAdmin };
  return {
    accessToken:  signAccess(payload),
    refreshToken: signRefresh({ id: user.id }),
  };
};

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh, createTokenPair };

/**
 * CodeWithMe9120 - Brute-Force & Rate Limiting Security Middleware
 */

const rateLimit = require('express-rate-limit');

// Strict Rate Limiter for Login Endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 'fail',
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.'
  },
  handler: (req, res, next, options) => {
    res.status(429).render('login', {
      pageTitle: 'Security Rate Limit Exceeded',
      currentRoute: '/login',
      error: 'Security Alert: Too many failed login attempts detected. For your protection, login has been temporarily locked for 15 minutes.',
      successMsg: null,
      identifier: ''
    });
  }
});

// General API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  loginLimiter,
  apiLimiter
};

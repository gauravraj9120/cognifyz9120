/**
 * CodeWithMe9120 - Web Routes with RBAC & High Security Guards
 */

const express = require('express');
const router = express.Router();

const studentController = require('../controllers/studentController');
const contactController = require('../controllers/contactController');
const authController = require('../controllers/authController');

const { validateStudentRegistration, validateUserRegistration, validateContact } = require('../middleware/validator');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');

// Public Pages & Public Form Submissions
router.get('/', studentController.renderHome);
router.post('/submit-student', validateStudentRegistration, studentController.handleStudentSubmission);
router.post('/submit-contact', validateContact, contactController.handleContactSubmission);

// Authentication & Student Sign-Up Routes
router.get('/login', authController.renderLogin);
router.post('/login', loginLimiter, authController.handleLogin);
router.get('/register', authController.renderRegister);
router.post('/register', validateUserRegistration, authController.handleRegister);
router.post('/logout', authController.handleLogout);

// Protected Routes (Requires Login)
router.get('/submissions', requireAuth, studentController.renderSubmissions);
router.get('/submissions/:id', requireAuth, studentController.renderSubmissionDetail);

// Super Admin Only Route (Requires Admin Role)
router.post('/submissions/:id/delete', requireAuth, requireAdmin, studentController.deleteSubmission);

module.exports = router;

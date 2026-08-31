/**
 * CodeWithMe9120 - RESTful API Routes with Security & RBAC Guards
 */

const express = require('express');
const router = express.Router();

const apiController = require('../controllers/apiController');
const { requireAuth, requireAdmin } = require('../middleware/authMiddleware');
const { apiLimiter } = require('../middleware/rateLimiter');

// Apply general API rate limiting
router.use(apiLimiter);

// Public API Endpoints
router.get('/stats', apiController.getStatsJSON);
router.post('/poll', apiController.handlePollVoteJSON);
router.post('/submissions', apiController.createSubmissionJSON);

// Protected API Endpoints (Requires Active Session)
router.get('/submissions', requireAuth, apiController.getAllSubmissionsJSON);
router.get('/submissions/:id', requireAuth, apiController.getSubmissionByIdJSON);

// Super Admin Only API Endpoints
router.delete('/submissions/:id', requireAuth, requireAdmin, apiController.deleteSubmissionJSON);
router.get('/export/csv', requireAuth, apiController.exportSubmissionsCSV);

module.exports = router;

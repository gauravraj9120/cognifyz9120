/**
 * CodeWithMe9120 - RESTful API & Data Controller
 */

const db = require('../config/db');

/**
 * GET /api/submissions - Get all submissions (JSON)
 */
exports.getAllSubmissionsJSON = (req, res) => {
  const { track, search } = req.query;
  const submissions = db.getAllSubmissions({ track, search });

  res.json({
    status: 'success',
    count: submissions.length,
    data: submissions
  });
};

/**
 * GET /api/submissions/:id - Get single submission (JSON)
 */
exports.getSubmissionByIdJSON = (req, res) => {
  const item = db.getSubmissionById(req.params.id);

  if (!item) {
    return res.status(404).json({
      status: 'fail',
      message: `Submission with ID ${req.params.id} not found.`
    });
  }

  res.json({
    status: 'success',
    data: item
  });
};

/**
 * POST /api/submissions - Create submission via JSON API
 */
exports.createSubmissionJSON = (req, res) => {
  const { fullName, email, track } = req.body;

  if (!fullName || !email || !track) {
    return res.status(400).json({
      status: 'fail',
      message: 'fullName, email, and track are required fields.'
    });
  }

  const newRecord = db.createSubmission(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Submission created successfully.',
    data: newRecord
  });
};

/**
 * DELETE /api/submissions/:id - Delete submission via API
 */
exports.deleteSubmissionJSON = (req, res) => {
  const deleted = db.deleteSubmission(req.params.id);

  if (!deleted) {
    return res.status(404).json({
      status: 'fail',
      message: `Submission ${req.params.id} not found.`
    });
  }

  res.json({
    status: 'success',
    message: `Submission ${req.params.id} deleted successfully.`,
    data: deleted
  });
};

/**
 * GET /api/stats - Analytics breakdown
 */
exports.getStatsJSON = (req, res) => {
  const stats = db.getStats();
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    data: stats
  });
};

/**
 * POST /api/poll - Record poll vote
 */
exports.handlePollVoteJSON = (req, res) => {
  const { option } = req.body;

  if (!option) {
    return res.status(400).json({
      status: 'fail',
      message: 'Vote option is required.'
    });
  }

  const updatedVotes = db.recordPollVote(option);

  res.json({
    status: 'success',
    message: 'Vote registered successfully.',
    votes: updatedVotes
  });
};

/**
 * GET /api/export/csv - Download all submissions as CSV file
 */
exports.exportSubmissionsCSV = (req, res) => {
  const submissions = db.getAllSubmissions();

  const headers = ['Ref ID', 'Full Name', 'Email', 'Phone', 'Track', 'Experience', 'Primary Language', 'Skills', 'Project Statement', 'Submitted At'];
  
  const rows = submissions.map((s) => [
    `"${s.id}"`,
    `"${s.fullName.replace(/"/g, '""')}"`,
    `"${s.email}"`,
    `"${s.phone}"`,
    `"${s.track}"`,
    `"${s.experience}"`,
    `"${s.preferredLanguage}"`,
    `"${(s.skills || []).join('; ')}"`,
    `"${(s.projectIdea || '').replace(/"/g, '""')}"`,
    `"${s.submittedAt}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="codewithme9120_submissions.csv"');
  res.status(200).send(csvContent);
};

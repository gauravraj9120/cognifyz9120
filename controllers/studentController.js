/**
 * CodeWithMe9120 - Student Controller (SSR & Web Handlers)
 */

const db = require('../config/db');
const { sendRegistrationEmail, TARGET_EMAIL } = require('../services/mailService');
const { validationResult } = require('../middleware/validator');

/**
 * Render Home Page (SSR)
 */
exports.renderHome = (req, res) => {
  const stats = db.getStats();
  res.render('index', {
    pageTitle: 'CodeWithMe9120 | Task 1 - Full Stack SSR Hub',
    currentRoute: '/',
    totalSubmissions: stats.totalSubmissions,
    totalInquiries: stats.totalInquiries,
    serverTime: new Date().toLocaleTimeString()
  });
};

/**
 * Handle Student Registration Form Submission (SSR + Email Dispatch)
 */
exports.handleStudentSubmission = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map((e) => e.msg).join(' ');
    return res.status(400).render('result', {
      pageTitle: 'Validation Error',
      currentRoute: '/result',
      success: false,
      message: errorMsg,
      data: null
    });
  }

  const {
    fullName,
    email,
    phone,
    track,
    experience,
    preferredLanguage,
    skills,
    projectIdea
  } = req.body;

  // Insert into persistent database
  const newSubmission = db.createSubmission({
    fullName,
    email,
    phone,
    track,
    experience,
    preferredLanguage,
    skills,
    projectIdea
  });

  // Asynchronously dispatch email notification
  sendRegistrationEmail(newSubmission).catch((err) => {
    console.error('Email dispatch error in studentController:', err);
  });

  // Dynamically render SSR result page
  res.render('result', {
    pageTitle: 'Registration Successful - SSR Response',
    currentRoute: '/result',
    success: true,
    message: `Your registration details have been saved to the database and dispatched to ${TARGET_EMAIL}!`,
    data: newSubmission,
    emailNotification: TARGET_EMAIL
  });
};

/**
 * Render Dynamic Submissions Table Page (SSR)
 */
exports.renderSubmissions = (req, res) => {
  const { trackFilter, search } = req.query;

  const submissions = db.getAllSubmissions({
    track: trackFilter,
    search: search
  });

  const stats = db.getStats();

  res.render('submissions', {
    pageTitle: 'Registered Candidates - Server-Side Rendered Directory',
    currentRoute: '/submissions',
    submissions,
    totalCount: stats.totalSubmissions,
    selectedFilter: trackFilter || 'All',
    searchQuery: search || ''
  });
};

/**
 * Render Single Submission Detail (SSR)
 */
exports.renderSubmissionDetail = (req, res) => {
  const item = db.getSubmissionById(req.params.id);

  if (!item) {
    return res.status(404).render('404', {
      pageTitle: 'Record Not Found',
      currentRoute: '/404',
      message: `No registration record found for Reference ID ${req.params.id}`
    });
  }

  res.render('result', {
    pageTitle: `Candidate: ${item.fullName} (${item.id})`,
    currentRoute: '/result',
    success: true,
    message: 'Displaying saved candidate record directly from persistent database.',
    data: item,
    emailNotification: TARGET_EMAIL
  });
};

/**
 * Delete Submission (SSR Web action)
 */
exports.deleteSubmission = (req, res) => {
  const deleted = db.deleteSubmission(req.params.id);
  res.redirect('/submissions');
};

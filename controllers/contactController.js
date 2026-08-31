/**
 * CodeWithMe9120 - Contact Controller
 */

const db = require('../config/db');
const { validationResult } = require('../middleware/validator');

/**
 * Handle Contact/Inquiry Form Submission (SSR)
 */
exports.handleContactSubmission = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map((e) => e.msg).join(' ');
    return res.status(400).render('result', {
      pageTitle: 'Inquiry Error',
      currentRoute: '/result',
      success: false,
      message: errorMsg,
      data: null
    });
  }

  const { contactName, contactEmail, subject, inquiryType, message } = req.body;

  const inquiry = db.createInquiry({
    contactName,
    contactEmail,
    subject,
    inquiryType,
    message
  });

  res.render('result', {
    pageTitle: 'Message Dispatched - SSR Response',
    currentRoute: '/result',
    success: true,
    message: 'Thank you for reaching out! Your message has been saved to the database.',
    data: inquiry
  });
};

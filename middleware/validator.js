/**
 * CodeWithMe9120 - Request Validation & Sanitization Middleware
 */

const { body, validationResult } = require('express-validator');

// Validation rules for New User / Student Account Registration
const validateUserRegistration = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required.')
    .isLength({ min: 2, max: 80 })
    .withMessage('Full name must be between 2 and 80 characters.')
    .escape(),

  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required.')
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3-30 characters.')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores.')
    .escape(),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.'),

  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match.');
      }
      return true;
    }),

  body('track')
    .optional({ checkFalsy: true })
    .isIn(['Full Stack Development', 'Data Science & ML', 'Frontend Engineering', 'Backend Development'])
    .withMessage('Invalid track selection.')
];

// Validation rules for Student Application Form
const validateStudentRegistration = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required.')
    .isLength({ min: 2, max: 80 })
    .withMessage('Full name must be between 2 and 80 characters.')
    .escape(),

  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number is too long.'),

  body('track')
    .notEmpty()
    .withMessage('Please select an internship track.')
    .isIn(['Full Stack Development', 'Data Science & ML', 'Frontend Engineering', 'Backend Development'])
    .withMessage('Invalid track selection.'),

  body('projectIdea')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Project proposal cannot exceed 500 characters.')
    .escape()
];

// Validation rules for Contact Form
const validateContact = [
  body('contactName')
    .trim()
    .notEmpty()
    .withMessage('Name is required.')
    .escape(),

  body('contactEmail')
    .trim()
    .isEmail()
    .withMessage('A valid email is required.')
    .normalizeEmail(),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message content cannot be empty.')
    .isLength({ max: 1000 })
    .withMessage('Message cannot exceed 1000 characters.')
    .escape()
];

module.exports = {
  validateUserRegistration,
  validateStudentRegistration,
  validateContact,
  validationResult
};

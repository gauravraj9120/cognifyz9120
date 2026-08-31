/**
 * CodeWithMe9120 - Authentication & User Registration Controller
 * Handles user sign-up, bcrypt password hashing, login, and session lifecycle
 */

const bcrypt = require('bcryptjs');
const db = require('../config/db');
const { validationResult } = require('../middleware/validator');
const { sendRegistrationEmail, TARGET_EMAIL } = require('../services/mailService');

/**
 * GET /login - Render High-Security Login Page
 */
exports.renderLogin = (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/submissions');
  }

  const error = req.query.error || null;
  const successMsg = req.query.success || null;

  res.render('login', {
    pageTitle: 'Secure Student & Admin Portal | CodeWithMe9120',
    currentRoute: '/login',
    error,
    successMsg,
    identifier: ''
  });
};

/**
 * POST /login - Process Login with Bcrypt Verification
 */
exports.handleLogin = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).render('login', {
      pageTitle: 'Login Failed',
      currentRoute: '/login',
      error: 'Please enter both your username/email and password.',
      successMsg: null,
      identifier: identifier || ''
    });
  }

  try {
    const user = db.findUserByIdentifier(identifier);

    if (!user) {
      return res.status(401).render('login', {
        pageTitle: 'Authentication Failed',
        currentRoute: '/login',
        error: 'Invalid username/email or password. Access denied.',
        successMsg: null,
        identifier: identifier.trim()
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      console.warn(`🔒 [Auth Failure] Failed login attempt for user: ${identifier} from IP: ${req.ip}`);
      return res.status(401).render('login', {
        pageTitle: 'Authentication Failed',
        currentRoute: '/login',
        error: 'Invalid username/email or password. Access denied.',
        successMsg: null,
        identifier: identifier.trim()
      });
    }

    // Regenerate session to prevent Session Fixation
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regeneration error:', err);
        return res.status(500).render('login', {
          pageTitle: 'Session Error',
          currentRoute: '/login',
          error: 'Internal session error occurred.',
          successMsg: null,
          identifier: ''
        });
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        fullName: user.fullName
      };

      console.log(`🔐 [Auth Success] User "${user.username}" (${user.role.toUpperCase()}) logged in.`);

      const returnUrl = req.session.returnTo || '/submissions';
      delete req.session.returnTo;
      res.redirect(returnUrl);
    });
  } catch (err) {
    console.error('Login controller error:', err);
    res.status(500).render('login', {
      pageTitle: 'Server Error',
      currentRoute: '/login',
      error: 'Internal authentication service failure.',
      successMsg: null,
      identifier: ''
    });
  }
};

/**
 * GET /register - Render Student Account Registration Page
 */
exports.renderRegister = (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/submissions');
  }

  res.render('register', {
    pageTitle: 'Create Student Account | CodeWithMe9120',
    currentRoute: '/register',
    error: null,
    formData: {}
  });
};

/**
 * POST /register - Create New Student Account with Security Validation
 */
exports.handleRegister = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map((e) => e.msg).join(' ');
    return res.status(400).render('register', {
      pageTitle: 'Registration Error',
      currentRoute: '/register',
      error: errorMsg,
      formData: req.body
    });
  }

  const { fullName, username, email, password, track, preferredLanguage, projectIdea } = req.body;

  try {
    // 1. Check if user already exists
    const existing = db.findUserByIdentifier(username) || db.findUserByIdentifier(email);
    if (existing) {
      return res.status(400).render('register', {
        pageTitle: 'Account Exists',
        currentRoute: '/register',
        error: 'An account with that username or email address already exists. Please sign in instead.',
        formData: req.body
      });
    }

    // 2. Create User in Database with Bcrypt Hashing
    const newUser = db.createUser({
      fullName,
      username,
      email,
      password,
      role: 'student'
    });

    // 3. Automatically link candidate submission in database
    const newSubmission = db.createSubmission({
      fullName,
      email,
      track: track || 'Full Stack Development',
      experience: 'Beginner',
      preferredLanguage: preferredLanguage || 'JavaScript',
      skills: ['HTML5', 'CSS3', 'JavaScript'],
      projectIdea: projectIdea || 'Enrolled via Student Portal Registration.'
    });

    // 4. Send Email Alert to gauravrajput9120@gmail.com
    sendRegistrationEmail(newSubmission).catch((err) => {
      console.error('Registration email dispatch error:', err);
    });

    console.log(`🎉 [New Student Registered] User "${newUser.username}" (${newUser.email}) registered.`);

    // 5. Establish secure session and redirect
    req.session.regenerate((err) => {
      if (err) {
        return res.redirect('/login?success=' + encodeURIComponent('Registration successful! Please log in.'));
      }

      req.session.user = {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        fullName: newUser.fullName
      };

      res.redirect('/submissions');
    });
  } catch (err) {
    console.error('User registration controller error:', err);
    res.status(500).render('register', {
      pageTitle: 'Server Error',
      currentRoute: '/register',
      error: 'An unexpected error occurred while creating your account.',
      formData: req.body
    });
  }
};

/**
 * POST /logout - Destroy Session & Invalidate Cookies
 */
exports.handleLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.clearCookie('codewithme9120.sid');
    res.redirect('/login?success=' + encodeURIComponent('You have been securely logged out.'));
  });
};

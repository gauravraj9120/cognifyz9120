/**
 * CodeWithMe9120 - High Security Authentication & RBAC Middleware
 */

/**
 * Attaches currentUser session data to res.locals for EJS views
 */
exports.attachUserLocals = (req, res, next) => {
  res.locals.currentUser = req.session && req.session.user ? req.session.user : null;
  next();
};

/**
 * Route Guard: Requires user to be logged in
 */
exports.requireAuth = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }

  // Store return URL
  if (req.session) {
    req.session.returnTo = req.originalUrl;
  }

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(401).json({
      status: 'fail',
      message: 'Authentication required. Please log in to access this resource.'
    });
  }

  res.redirect('/login?error=' + encodeURIComponent('Please log in with authorized credentials to view this page.'));
};

/**
 * Route Guard: Requires ADMIN role
 */
exports.requireAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(403).json({
      status: 'fail',
      message: 'Access denied: Super Admin permissions required.'
    });
  }

  res.status(403).render('404', {
    pageTitle: '403 Forbidden - Access Denied',
    currentRoute: '/403',
    message: 'Access Denied: You do not possess the required Super Admin security clearance for this operation.'
  });
};

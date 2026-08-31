/**
 * CodeWithMe9120 - Centralized Error Handling Middleware
 */

/**
 * 404 Not Found Middleware
 */
exports.notFoundHandler = (req, res, next) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found - 404',
    currentRoute: '/404',
    message: `The requested endpoint "${req.originalUrl}" was not found on this server.`
  });
};

/**
 * Global 500 Server Error Middleware
 */
exports.globalErrorHandler = (err, req, res, next) => {
  console.error('🔥 [Server Error]:', err.stack || err.message);

  if (req.originalUrl.startsWith('/api/')) {
    return res.status(500).json({
      status: 'error',
      message: 'An unexpected internal server error occurred.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  res.status(500).render('404', {
    pageTitle: 'Internal Server Error - 500',
    currentRoute: '/500',
    message: 'An unexpected error occurred while processing your request on the server.'
  });
};

/**
 * CodeWithMe9120 - Full Stack Backend Server Entrypoint
 * Architecture: High Security MVC (RBAC Authentication, Rate Limiting, Bcrypt, EJS SSR)
 */

const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

// Route Modules
const webRoutes = require('./routes/webRoutes');
const apiRoutes = require('./routes/apiRoutes');

// Auth & Security Middleware
const { attachUserLocals } = require('./middleware/authMiddleware');
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust first proxy for rate limiting / secure cookies behind proxies
app.set('trust proxy', 1);

// ==========================================
// 1. Core Security & Parsing Middleware
// ==========================================
app.use(cors());
// Parse URL-encoded bodies (HTML Form submissions)
app.use(express.urlencoded({ extended: true }));
// Parse JSON request bodies
app.use(express.json());
// HTTP request logger
app.use(morgan('dev'));

// Static assets (CSS, client JS, images, logos)
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 2. High-Security Session Management
// ==========================================
app.use(
  session({
    name: 'codewithme9120.sid',
    secret: process.env.SESSION_SECRET || 'cwm9120_hyper_secure_super_secret_key_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Mitigate XSS cookie theft
      secure: process.env.NODE_ENV === 'production', // Use secure HTTPS in production
      sameSite: 'lax', // CSRF protection
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Attach authenticated session user to EJS templates (res.locals.currentUser)
app.use(attachUserLocals);

// ==========================================
// 3. View Engine Configuration (EJS SSR)
// ==========================================
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ==========================================
// 4. Application Route Mounts
// ==========================================
// SSR Web Routes (Forms, Candidate Directory, Login/Logout)
app.use('/', webRoutes);

// RESTful JSON API Routes (CRUD, Stats, CSV Export)
app.use('/api', apiRoutes);

// ==========================================
// 5. Centralized Error Handling Middleware
// ==========================================
app.use(notFoundHandler);
app.use(globalErrorHandler);

// ==========================================
// 6. Server Initialization
// ==========================================
app.listen(PORT, () => {
  console.log(`\n==========================================================`);
  console.log(`🚀 [CodeWithMe9120 Secure Server] Running at: http://localhost:${PORT}`);
  console.log(`🌐 Public Form Hub: http://localhost:${PORT}/`);
  console.log(`🔐 Secure Login Portal: http://localhost:${PORT}/login`);
  console.log(`📊 Admin Submissions: http://localhost:${PORT}/submissions`);
  console.log(`🔌 Protected REST API: http://localhost:${PORT}/api/submissions`);
  console.log(`📥 CSV Data Export: http://localhost:${PORT}/api/export/csv`);
  console.log(`==========================================================\n`);
});

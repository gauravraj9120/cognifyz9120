/**
 * CodeWithMe9120 - Persistent File Database Engine
 * Persists submissions, users (with hashed passwords), contact inquiries, and poll data
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Default Admin Credentials Hash generated on startup
const DEFAULT_ADMIN_HASH = bcrypt.hashSync('AdminSecure@2026', 10);

const INITIAL_SEED = {
  users: [
    {
      id: 'USR-101',
      username: 'admin',
      email: 'gauravrajput9120@gmail.com',
      passwordHash: DEFAULT_ADMIN_HASH,
      role: 'admin',
      fullName: 'Gaurav Rajput (Super Admin)',
      createdAt: 'Sep 1, 2026, 1:00 AM'
    },
    {
      id: 'USR-102',
      username: 'student_demo',
      email: 'demo.student@codewithme9120.com',
      passwordHash: bcrypt.hashSync('Student@2026', 10),
      role: 'student',
      fullName: 'Demo Student',
      createdAt: 'Sep 1, 2026, 1:00 AM'
    }
  ],
  submissions: [
    {
      id: 'SUB-101',
      fullName: 'Aarav Sharma',
      email: 'aarav.sharma@example.com',
      phone: '+91 98765 43210',
      track: 'Full Stack Development',
      experience: 'Intermediate',
      preferredLanguage: 'JavaScript',
      skills: ['HTML5', 'CSS3', 'Node.js', 'Express'],
      projectIdea: 'An AI-powered task management dashboard with real-time SSR notifications.',
      submittedAt: 'Sep 1, 2026, 12:30 AM',
      type: 'Registration'
    },
    {
      id: 'SUB-102',
      fullName: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 91234 56789',
      track: 'Full Stack Development',
      experience: 'Beginner',
      preferredLanguage: 'Python',
      skills: ['HTML5', 'JavaScript', 'EJS'],
      projectIdea: 'E-commerce platform with dynamic inventory rendering and payment gateway.',
      submittedAt: 'Sep 1, 2026, 1:00 AM',
      type: 'Registration'
    }
  ],
  inquiries: [],
  pollVotes: {
    'Fast initial page loads & SEO benefits': 14,
    'Dynamic HTML generation on the server': 22,
    'Secure backend data processing': 9
  }
};

let dbCache = null;

/**
 * Initializes database directory and file
 */
function initDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_SEED, null, 2), 'utf-8');
    dbCache = JSON.parse(JSON.stringify(INITIAL_SEED));
  } else {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(raw);
      // Ensure users collection exists
      if (!dbCache.users || dbCache.users.length === 0) {
        dbCache.users = INITIAL_SEED.users;
        saveDB();
      }
    } catch (err) {
      console.error('Error reading database file, restoring defaults:', err.message);
      dbCache = JSON.parse(JSON.stringify(INITIAL_SEED));
      saveDB();
    }
  }
}

/**
 * Saves in-memory cache to disk
 */
function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf-8');
  } catch (err) {
    console.error('Database write error:', err.message);
  }
}

// Ensure DB is initialized on module load
initDB();

const db = {
  // ==========================================
  // User Authentication & RBAC Operations
  // ==========================================

  /**
   * Find user by username or email
   */
  findUserByIdentifier: (identifier) => {
    if (!identifier) return null;
    const clean = identifier.trim().toLowerCase();
    return (dbCache.users || []).find(
      (u) =>
        u.username.toLowerCase() === clean ||
        u.email.toLowerCase() === clean
    );
  },

  /**
   * Find user by ID
   */
  getUserById: (id) => {
    return (dbCache.users || []).find((u) => u.id === id);
  },

  /**
   * Create new user with hashed password
   */
  createUser: (userData) => {
    const nextId = `USR-${100 + (dbCache.users || []).length + 1}`;
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(userData.password, salt);

    const newUser = {
      id: nextId,
      username: userData.username.trim().toLowerCase(),
      email: userData.email.trim().toLowerCase(),
      passwordHash,
      role: userData.role || 'student',
      fullName: userData.fullName ? userData.fullName.trim() : userData.username.trim(),
      createdAt: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    };

    if (!dbCache.users) dbCache.users = [];
    dbCache.users.push(newUser);
    saveDB();
    return newUser;
  },

  /**
   * List all users (excluding hashes)
   */
  getAllUsers: () => {
    return (dbCache.users || []).map(({ passwordHash, ...user }) => user);
  },

  // ==========================================
  // Submissions Operations
  // ==========================================

  /**
   * Get all submissions with optional filter and search
   */
  getAllSubmissions: (filter = {}) => {
    let list = [...(dbCache.submissions || [])];

    if (filter.track && filter.track !== 'All') {
      list = list.filter(
        (s) => s.track && s.track.toLowerCase() === filter.track.toLowerCase()
      );
    }

    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
      );
    }

    return list;
  },

  /**
   * Get single submission by ID
   */
  getSubmissionById: (id) => {
    return (dbCache.submissions || []).find((s) => s.id === id);
  },

  /**
   * Insert new submission
   */
  createSubmission: (data) => {
    const nextNum = (dbCache.submissions || []).length + 101;
    const newRecord = {
      id: `SUB-${nextNum}`,
      fullName: data.fullName.trim(),
      email: data.email.trim(),
      phone: data.phone ? data.phone.trim() : 'N/A',
      track: data.track,
      experience: data.experience || 'Beginner',
      preferredLanguage: data.preferredLanguage || 'JavaScript',
      skills: Array.isArray(data.skills) ? data.skills : (data.skills ? [data.skills] : ['None specified']),
      projectIdea: data.projectIdea ? data.projectIdea.trim() : 'No proposal provided.',
      submittedAt: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      type: 'Registration'
    };

    dbCache.submissions.unshift(newRecord);
    saveDB();
    return newRecord;
  },

  /**
   * Delete submission by ID
   */
  deleteSubmission: (id) => {
    const index = dbCache.submissions.findIndex((s) => s.id === id);
    if (index !== -1) {
      const deleted = dbCache.submissions.splice(index, 1);
      saveDB();
      return deleted[0];
    }
    return null;
  },

  /**
   * Insert new contact message
   */
  createInquiry: (data) => {
    const inquiry = {
      id: `MSG-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: data.contactName.trim(),
      email: data.contactEmail.trim(),
      subject: data.subject || 'General Inquiry',
      inquiryType: data.inquiryType || 'Support',
      message: data.message.trim(),
      submittedAt: new Date().toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      type: 'Inquiry'
    };

    dbCache.inquiries.unshift(inquiry);
    saveDB();
    return inquiry;
  },

  /**
   * Record quick poll vote
   */
  recordPollVote: (option) => {
    if (!dbCache.pollVotes) dbCache.pollVotes = {};
    dbCache.pollVotes[option] = (dbCache.pollVotes[option] || 0) + 1;
    saveDB();
    return dbCache.pollVotes;
  },

  /**
   * Get database analytics and statistics
   */
  getStats: () => {
    const totalSubmissions = (dbCache.submissions || []).length;
    const tracksCount = {};
    const languagesCount = {};

    (dbCache.submissions || []).forEach((s) => {
      tracksCount[s.track] = (tracksCount[s.track] || 0) + 1;
      languagesCount[s.preferredLanguage] = (languagesCount[s.preferredLanguage] || 0) + 1;
    });

    return {
      totalSubmissions,
      totalUsers: (dbCache.users || []).length,
      totalInquiries: (dbCache.inquiries || []).length,
      tracksBreakdown: tracksCount,
      languagesBreakdown: languagesCount,
      pollVotes: dbCache.pollVotes
    };
  }
};

module.exports = db;

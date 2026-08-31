# CodeWithMe9120 - Full Stack Development

## 📌 Task 1: HTML Structure, Express Server & High-Security Authentication (Level 1: Beginner)

### 🎯 Objective
Introduce and demonstrate the core concepts of **HTML semantic structures**, **Express.js backend server setup**, **HTTP form handling (GET & POST)**, dynamic **Server-Side Rendering (SSR)** using the **EJS** templating engine, and **High-Security Authentication** with Bcrypt, Rate Limiting, and Role-Based Access Control (RBAC).

---

## 🛠️ Technology Stack
- **Runtime Environment:** Node.js (v24.x LTS)
- **Web Framework:** Express.js (v4.x)
- **Authentication & Cryptography:** Bcryptjs (10 Salt Rounds), Express-Session (HttpOnly + Lax)
- **Security & Protection:** Express-Rate-Limit (Brute-Force Shield), CORS, Input Sanitization (Express-Validator)
- **Database:** Persistent File-Based JSON Database (`data/database.json`)
- **Email Notifications:** Nodemailer (Gmail SMTP integration)
- **Templating Engine:** EJS (Embedded JavaScript with modular partials)
- **Styling:** Custom Vanilla CSS (Modern Glassmorphism, Google Fonts: *Plus Jakarta Sans* & *Outfit*, CodeWithMe9120 watermark)

---

## 📂 Project Architecture

```
Task 1/
├── server.js                      # Express application entrypoint & middleware configuration
├── .env                           # Environment variables & Gmail credentials
├── config/
│   └── db.js                      # Persistent Database Engine (data/database.json)
├── controllers/
│   ├── authController.js          # User registration, bcrypt verification & session management
│   ├── studentController.js       # Student registration, SSR rendering, validation & email
│   ├── contactController.js       # General inquiries & contact submission handler
│   └── apiController.js           # RESTful JSON APIs, analytics & CSV export
├── middleware/
│   ├── authMiddleware.js          # requireAuth & requireAdmin RBAC route guards
│   ├── rateLimiter.js             # Brute-force protection for login portal
│   ├── validator.js               # express-validator input sanitization & rules
│   └── errorHandler.js            # Centralized 404 & 500 error handlers
├── routes/
│   ├── webRoutes.js               # SSR Web page routes (/, /login, /register, /submissions)
│   └── apiRoutes.js               # RESTful JSON API routes (/api/submissions, /api/stats, /api/export/csv)
├── services/
│   └── mailService.js             # Nodemailer Gmail dispatch service (target: gauravrajput9120@gmail.com)
├── data/
│   └── database.json              # Auto-persisted database holding user accounts & candidate records
├── public/
│   ├── css/style.css              # Vanilla CSS design system with CodeWithMe9120 branding & watermark
│   ├── js/client.js               # Micro-interactions, poll handler & UI preview
│   └── images/logo.png            # Official CodeWithMe9120 emblem & background watermark
├── views/
│   ├── partials/ (header.ejs, navbar.ejs, footer.ejs)
│   ├── index.ejs                  # Dynamic SSR Form Hub & explainer
│   ├── login.ejs                  # High-Security Login Portal with rate limiting & credential autofill
│   ├── register.ejs               # Student Account Sign-Up & Registration Form
│   ├── submissions.ejs            # Dynamic SSR Candidate directory with search, filter & CSV export
│   ├── result.ejs                 # SSR Confirmation Card
│   └── 404.ejs                    # Custom 404 error page
└── README.md                      # Complete project documentation
```

---

## 🚀 How to Run the Project Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Express Server
```bash
npm start
```
*(Or `npm run dev` for auto-reloading)*

### 3. Open in Browser
Navigate to:
```
http://localhost:3000
```

---

## 🔑 Default Credentials for Evaluation

- 👑 **Super Admin**: Username: `admin` | Password: `AdminSecure@2026`
- 🎓 **Student Demo**: Username: `student_demo` | Password: `Student@2026`

---

## 🌐 Server Endpoints & Routes

| HTTP Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | **Public** | Main homepage with application forms and database stats (`index.ejs`) |
| `GET` | `/register` | **Public** | Student Account Registration & Sign-Up Portal (`register.ejs`) |
| `POST` | `/register` | **Public** | Creates student account with Bcrypt password hashing & triggers email alert |
| `GET` | `/login` | **Public** | High-Security Login Portal with brute-force rate limiting (`login.ejs`) |
| `POST` | `/login` | **Public** | Authenticates user credentials with Bcrypt verification & session regeneration |
| `POST` | `/logout` | **Protected** | Securely invalidates cookies and destroys session |
| `GET` | `/submissions` | **Protected (Auth)** | Dynamic candidate directory with search & track filtering (`submissions.ejs`) |
| `POST` | `/submissions/:id/delete` | **Super Admin** | Deletes submission from database |
| `GET` | `/api/export/csv` | **Super Admin** | Downloads Excel-ready CSV export of all candidate records |
| `GET` | `/api/submissions` | **Protected (Auth)** | RESTful JSON API of candidate records |
| `GET` | `/api/stats` | **Public** | Live platform analytics and survey statistics |

---

## 📧 Email Notification Setup (Gmail Integration)

Registration form submissions are automatically formatted and dispatched to:
**`gauravrajput9120@gmail.com`**

To enable live delivery directly to your Gmail inbox:
1. Open [`.env`](file:///c:/Users/Gaurav%20Rajput/OneDrive/Documents/Desktop/Cognifyz/Task%201/.env) in the project root.
2. Set your `GMAIL_USER` and `GMAIL_APP_PASS` (16-character Google App Password from your Google Account settings under *Security -> 2-Step Verification -> App Passwords*):
```env
NOTIFICATION_EMAIL=gauravrajput9120@gmail.com
GMAIL_USER=yourgmail@gmail.com
GMAIL_APP_PASS=your-16-char-app-password
```

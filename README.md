# DarshanBarter – Finance & Loan Services Web App

A full-stack finance web application built with **React.js** (frontend), **Node.js/Express** (backend) and **MySQL** (database).

---

## 🆕 Features Added

### ✅ Authentication Enhancements
- **Password Reset** – Forgot password → Email with reset link → Set new password
- **Welcome Email** – Auto email sent after successful registration
- **Password Strength Indicator** – Visual strength meter during registration
- **Change Password** – Authenticated users can change password from settings
- **JWT Token Validation** – Auto-logout on token expiry

### ✅ Loan Service Popup
- After applying for any loan, a popup shows:
  - **Phone number** to call the loan team
  - **Email address** to contact support
  - Confirmation message with next steps
- Contact info is pulled from the database (configurable via admin)
- Email confirmation also sent to applicant after loan application

---

## 📂 Project Structure

```
DarshanBarter/
├── backend/
│   ├── config/
│   │   ├── db.js          # MySQL connection pool
│   │   ├── mailer.js      # Nodemailer + email templates
│   │   └── schema.sql     # Database schema + seed data
│   ├── middleware/
│   │   └── auth.js        # JWT auth + admin middleware
│   ├── routes/
│   │   ├── auth.js        # Register, Login, Forgot/Reset Password
│   │   ├── loans.js       # Loan products + applications + contact info
│   │   ├── candidates.js  # Candidate profile management
│   │   ├── dashboard.js   # Dashboard stats
│   │   └── misc.js        # Contact form
│   ├── .env               # Environment variables
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js          # Axios with JWT interceptors
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Layouts.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── CandidateSidebar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── common/
│   │   │   │   ├── Home.jsx
│   │   │   │   ├── Services.jsx      # ← Loan apply popup with phone & email
│   │   │   │   ├── About.jsx
│   │   │   │   ├── Contact.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx      # ← Registration success with email notification
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   └── ResetPassword.jsx
│   │   │   ├── candidate/
│   │   │   │   ├── CandidateDashboard.jsx
│   │   │   │   └── CandidatePages.jsx (MyApplications + Profile)
│   │   │   └── admin/
│   │   │       ├── AdminDashboard.jsx
│   │   │       ├── AdminCandidates.jsx
│   │   │       ├── AdminApplications.jsx
│   │   │       ├── AdminProducts.jsx
│   │   │       └── AdminReportsSettings.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

---

## 🚀 Setup Instructions

### 1. Database Setup

```bash
# Login to MySQL and run the schema
mysql -u root -p < backend/config/schema.sql
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env .env.local
# Edit .env with your DB credentials and email settings

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Environment Configuration

#### Backend `.env`
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=darshan_barter
JWT_SECRET=your_super_secret_key

# Gmail SMTP (use App Password, not account password)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=DarshanBarter <your_email@gmail.com>

FRONTEND_URL=http://localhost:5173
SUPPORT_PHONE=++91 91122 23630
SUPPORT_EMAIL=loans@darshanbarter.com
```

---

## 📧 Setting Up Gmail for Emails

1. Go to your Google Account → Security → 2-Step Verification (enable)
2. Go to Security → App Passwords
3. Generate an App Password for "Mail"
4. Use that App Password in `EMAIL_PASS` (not your Gmail password)

---

## 🔐 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@darshanbarter.com | password |

---

## 🌐 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | - | Register new user |
| POST | /api/auth/login | - | Login |
| POST | /api/auth/forgot-password | - | Send reset email |
| POST | /api/auth/reset-password/:token | - | Reset password |
| GET | /api/auth/me | User | Get current user |
| POST | /api/auth/change-password | User | Change password |
| GET | /api/loans/products | - | Get loan products |
| GET | /api/loans/contact-info | - | Get support contact info |
| POST | /api/loans/apply | User | Apply for loan |
| GET | /api/loans/my-applications | User | My applications |
| GET | /api/loans/all-applications | Admin | All applications |
| PATCH | /api/loans/applications/:id/status | Admin | Update status |
| GET | /api/candidates | Admin | All candidates |
| GET | /api/candidates/profile | User | Own profile |
| PUT | /api/candidates/profile | User | Update profile |
| GET | /api/dashboard/admin | Admin | Admin stats |
| GET | /api/dashboard/candidate | User | User stats |
| POST | /api/misc/contact | - | Contact form |

---

## 🏗️ Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the `dist` folder
```

### Backend (Railway/Render/VPS)
```bash
cd backend
npm start
```
Make sure to set all environment variables in your deployment platform.

---

© 2025 DarshanBarter Finance. All rights reserved.

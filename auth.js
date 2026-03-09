const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const { sendMail, registrationSuccessEmail, passwordResetEmail } = require('../config/mailer');
const { auth } = require('../middleware/auth');
require('dotenv').config();


// Helper to get first validation error
const firstError = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return errors.array()[0].msg;
  return null;
};



// ============================
// REGISTER
// ============================

router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Full name is required')
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters'),

    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email address'),

    body('phone')
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage('Phone number too long'),

    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],

  async (req, res) => {
    const errMsg = firstError(req);
    if (errMsg) return res.status(400).json({ success: false, message: errMsg });

    const name = req.body.name.trim();
    const email = req.body.email.trim().toLowerCase();
    const phone = req.body.phone ? req.body.phone.trim() : null;
    const password = req.body.password;
    const role = req.body.role === 'admin' ? 'admin' : 'candidate';

    try {

      // Check if email exists
      const [existing] = await pool.query(
        'SELECT id FROM users WHERE LOWER(email) = ?',
        [email]
      );

      if (existing.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'This email is already registered. Please login instead.'
        });
      }

      // Hash password
      const hashed = await bcrypt.hash(password, 10);

      // Insert user
      const [result] = await pool.query(
        `INSERT INTO users (name, email, phone, password, role, is_verified)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, email, phone, hashed, role, true]
      );

      // Send welcome email
      try {
        await sendMail({
          to: email,
          subject: '🎉 Welcome to DarshanBarter – Registration Successful!',
          html: registrationSuccessEmail(name),
        });
      } catch (emailErr) {
        console.warn('Welcome email failed:', emailErr.message);
      }

      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        userId: result.insertId,
      });

    } catch (err) {

      console.error('Register error:', err);

      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({
          success: false,
          message: 'This email is already registered.'
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Registration failed. Please try again.'
      });
    }
  }
);



// ============================
// LOGIN
// ============================

router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email address'),

    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ],

  async (req, res) => {

    const errMsg = firstError(req);
    if (errMsg) return res.status(400).json({ success: false, message: errMsg });

    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;

    try {

      const [rows] = await pool.query(
        'SELECT * FROM users WHERE LOWER(email) = ?',
        [email]
      );

      if (rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      const user = rows[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
      }

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({
          success: false,
          message: 'Server configuration error.'
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      return res.json({
        success: true,
        message: 'Login successful.',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        }
      });

    } catch (err) {

      console.error('Login error:', err);

      return res.status(500).json({
        success: false,
        message: 'Login failed. Please try again.'
      });
    }
  }
);



// ============================
// FORGOT PASSWORD
// ============================

router.post(
  '/forgot-password',
  [body('email').trim().isEmail().withMessage('Valid email is required')],

  async (req, res) => {

    const errMsg = firstError(req);
    if (errMsg) return res.status(400).json({ success: false, message: errMsg });

    const email = req.body.email.trim().toLowerCase();

    try {

      const [rows] = await pool.query(
        'SELECT * FROM users WHERE LOWER(email) = ?',
        [email]
      );

      if (rows.length === 0) {
        return res.json({
          success: true,
          message: 'If this email exists, a reset link has been sent.'
        });
      }

      const user = rows[0];

      const resetToken = uuidv4();
      const expires = new Date(Date.now() + 3600000);

      await pool.query(
        'UPDATE users SET reset_token=?, reset_token_expires=? WHERE id=?',
        [resetToken, expires, user.id]
      );

      const resetLink =
        `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

      try {
        await sendMail({
          to: email,
          subject: '🔐 DarshanBarter – Password Reset Request',
          html: passwordResetEmail(user.name, resetLink)
        });
      } catch (err) {
        console.warn('Reset email failed:', err.message);
      }

      return res.json({
        success: true,
        message: 'If this email exists, a reset link has been sent.'
      });

    } catch (err) {

      console.error('Forgot password error:', err);

      return res.status(500).json({
        success: false,
        message: 'Server error.'
      });
    }
  }
);



// ============================
// RESET PASSWORD
// ============================

router.post(
  '/reset-password/:token',
  [body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')],

  async (req, res) => {

    const errMsg = firstError(req);
    if (errMsg) return res.status(400).json({ success: false, message: errMsg });

    try {

      const [rows] = await pool.query(
        'SELECT * FROM users WHERE reset_token=? AND reset_token_expires > NOW()',
        [req.params.token]
      );

      if (rows.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Reset link is invalid or expired.'
        });
      }

      const hashed = await bcrypt.hash(req.body.password, 10);

      await pool.query(
        'UPDATE users SET password=?, reset_token=NULL, reset_token_expires=NULL WHERE id=?',
        [hashed, rows[0].id]
      );

      return res.json({
        success: true,
        message: 'Password reset successfully.'
      });

    } catch (err) {

      console.error('Reset password error:', err);

      return res.status(500).json({
        success: false,
        message: 'Server error.'
      });
    }
  }
);



// ============================
// GET CURRENT USER
// ============================

router.get('/me', auth, async (req, res) => {

  try {

    const [rows] = await pool.query(
      'SELECT id,name,email,phone,role,created_at FROM users WHERE id=?',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found.'
      });
    }

    return res.json({
      success: true,
      user: rows[0]
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: 'Server error.'
    });
  }
});



// ============================
// CHANGE PASSWORD
// ============================

router.post(
  '/change-password',
  auth,
  [
    body('currentPassword').notEmpty().withMessage('Current password required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],

  async (req, res) => {

    const errMsg = firstError(req);
    if (errMsg) return res.status(400).json({ success: false, message: errMsg });

    try {

      const [rows] = await pool.query(
        'SELECT * FROM users WHERE id=?',
        [req.user.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'User not found.'
        });
      }

      const match = await bcrypt.compare(
        req.body.currentPassword,
        rows[0].password
      );

      if (!match) {
        return res.status(400).json({
          success: false,
          message: 'Current password incorrect.'
        });
      }

      const hashed = await bcrypt.hash(req.body.newPassword, 10);

      await pool.query(
        'UPDATE users SET password=? WHERE id=?',
        [hashed, req.user.id]
      );

      return res.json({
        success: true,
        message: 'Password changed successfully.'
      });

    } catch (err) {

      return res.status(500).json({
        success: false,
        message: 'Server error.'
      });
    }
  }
);


module.exports = router;
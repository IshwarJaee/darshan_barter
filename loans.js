const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { auth, adminOnly } = require('../middleware/auth');
const { sendMail, loanApplicationEmail } = require('../config/mailer');
require('dotenv').config();

// ─── Get all active loan products (public) ────────────────────────────
router.get('/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM loan_products WHERE is_active = 1 ORDER BY id');
    return res.json({ success: true, products: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── Get loan service contact info (for popup) ───────────────────────
router.get('/contact-info', async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM contact_info WHERE service_type = 'loans' LIMIT 1");
    const info = rows[0] || {
      phone: process.env.SUPPORT_PHONE || '+91 91122 23630',
      email: process.env.SUPPORT_EMAIL || 'loans@darshanbarter.com',
      whatsapp: process.env.SUPPORT_WHATSAPP || '+91 91122 23630',
      description: 'Call or email us for all loan enquiries',
    };
    return res.json({ success: true, contact: info });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── Apply for a loan ────────────────────────────────────────────────
router.post('/apply', auth, async (req, res) => {
  const { product_id, amount, tenure_months, purpose } = req.body;

  if (!product_id || !amount || !tenure_months) {
    return res.status(400).json({ success: false, message: 'Product, amount and tenure are required.' });
  }

  try {
    const [product] = await pool.query('SELECT * FROM loan_products WHERE id = ? AND is_active = 1', [product_id]);
    if (product.length === 0) {
      return res.status(404).json({ success: false, message: 'Loan product not found.' });
    }

    const [result] = await pool.query(
      'INSERT INTO loan_applications (user_id, product_id, amount, tenure_months, purpose) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, product_id, amount, tenure_months, purpose || null]
    );

    // Send loan application confirmation email
    const [userRows] = await pool.query('SELECT name, email FROM users WHERE id = ?', [req.user.id]);
    if (userRows.length > 0) {
      sendMail({
        to: userRows[0].email,
        subject: `✅ DarshanBarter – ${product[0].name} Application Received`,
        html: loanApplicationEmail(userRows[0].name, product[0].name, amount),
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully!',
      applicationId: result.insertId,
      contact: {
        phone: process.env.SUPPORT_PHONE || '+91 91122 23630',
        email: process.env.SUPPORT_EMAIL || 'loans@darshanbarter.com',
      },
    });
  } catch (err) {
    console.error('Loan apply error:', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── Get user's own applications ─────────────────────────────────────
router.get('/my-applications', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT la.*, lp.name as product_name, lp.interest_rate
       FROM loan_applications la
       JOIN loan_products lp ON la.product_id = lp.id
       WHERE la.user_id = ?
       ORDER BY la.applied_at DESC`,
      [req.user.id]
    );
    return res.json({ success: true, applications: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── Admin: get all applications ─────────────────────────────────────
router.get('/all-applications', auth, adminOnly, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT la.*, u.name as user_name, u.email as user_email, u.phone as user_phone,
              lp.name as product_name, lp.interest_rate
       FROM loan_applications la
       JOIN users u ON la.user_id = u.id
       JOIN loan_products lp ON la.product_id = lp.id
       ORDER BY la.applied_at DESC`
    );
    return res.json({ success: true, applications: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── Admin: update application status ────────────────────────────────
router.patch('/applications/:id/status', auth, adminOnly, async (req, res) => {
  const { status, remarks } = req.body;
  const validStatuses = ['pending', 'under_review', 'approved', 'rejected', 'disbursed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status.' });
  }
  try {
    await pool.query(
      'UPDATE loan_applications SET status = ?, remarks = ? WHERE id = ?',
      [status, remarks || null, req.params.id]
    );
    return res.json({ success: true, message: 'Application status updated.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─── Admin: CRUD loan products ────────────────────────────────────────
router.post('/products', auth, adminOnly, async (req, res) => {
  const { name, description, min_amount, max_amount, interest_rate, tenure_months } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO loan_products (name, description, min_amount, max_amount, interest_rate, tenure_months) VALUES (?,?,?,?,?,?)',
      [name, description, min_amount, max_amount, interest_rate, tenure_months]
    );
    return res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.put('/products/:id', auth, adminOnly, async (req, res) => {
  const { name, description, min_amount, max_amount, interest_rate, tenure_months, is_active } = req.body;
  try {
    await pool.query(
      'UPDATE loan_products SET name=?,description=?,min_amount=?,max_amount=?,interest_rate=?,tenure_months=?,is_active=? WHERE id=?',
      [name, description, min_amount, max_amount, interest_rate, tenure_months, is_active, req.params.id]
    );
    return res.json({ success: true, message: 'Product updated.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

router.delete('/products/:id', auth, adminOnly, async (req, res) => {
  try {
    await pool.query('UPDATE loan_products SET is_active = 0 WHERE id = ?', [req.params.id]);
    return res.json({ success: true, message: 'Product deactivated.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;

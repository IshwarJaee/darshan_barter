const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { auth, adminOnly } = require('../middleware/auth');

// Admin dashboard stats
router.get('/admin', auth, adminOnly, async (req, res) => {
  try {
    const [[{ total_users }]] = await pool.query("SELECT COUNT(*) as total_users FROM users WHERE role='candidate'");
    const [[{ total_applications }]] = await pool.query('SELECT COUNT(*) as total_applications FROM loan_applications');
    const [[{ pending }]] = await pool.query("SELECT COUNT(*) as pending FROM loan_applications WHERE status='pending'");
    const [[{ approved }]] = await pool.query("SELECT COUNT(*) as approved FROM loan_applications WHERE status='approved'");
    const [[{ total_amount }]] = await pool.query("SELECT COALESCE(SUM(amount),0) as total_amount FROM loan_applications WHERE status='approved'");

    const [recentApps] = await pool.query(
      `SELECT la.id, la.amount, la.status, la.applied_at, u.name as user_name, lp.name as product_name
       FROM loan_applications la
       JOIN users u ON la.user_id = u.id
       JOIN loan_products lp ON la.product_id = lp.id
       ORDER BY la.applied_at DESC LIMIT 5`
    );

    return res.json({
      success: true,
      stats: { total_users, total_applications, pending, approved, total_amount },
      recentApplications: recentApps,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Candidate dashboard stats
router.get('/candidate', auth, async (req, res) => {
  try {
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM loan_applications WHERE user_id=?', [req.user.id]);
    const [[{ pending }]] = await pool.query("SELECT COUNT(*) as pending FROM loan_applications WHERE user_id=? AND status='pending'", [req.user.id]);
    const [[{ approved }]] = await pool.query("SELECT COUNT(*) as approved FROM loan_applications WHERE user_id=? AND status='approved'", [req.user.id]);

    const [recent] = await pool.query(
      `SELECT la.id, la.amount, la.status, la.applied_at, lp.name as product_name
       FROM loan_applications la JOIN loan_products lp ON la.product_id = lp.id
       WHERE la.user_id = ? ORDER BY la.applied_at DESC LIMIT 5`,
      [req.user.id]
    );

    return res.json({ success: true, stats: { total, pending, approved }, recentApplications: recent });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;

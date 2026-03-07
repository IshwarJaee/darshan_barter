const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const { auth, adminOnly } = require('../middleware/auth');

// Get candidate profile
router.get('/profile', auth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.phone, u.role, u.created_at,
              c.address, c.city, c.state, c.pincode, c.dob, c.gender,
              c.employment_type, c.monthly_income, c.pan_number, c.aadhar_number, c.credit_score
       FROM users u
       LEFT JOIN candidates c ON c.user_id = u.id
       WHERE u.id = ?`,
      [req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Profile not found.' });
    return res.json({ success: true, profile: rows[0] });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Update candidate profile
router.put('/profile', auth, async (req, res) => {
  const { name, phone, address, city, state, pincode, dob, gender, employment_type, monthly_income, pan_number, aadhar_number } = req.body;
  try {
    await pool.query('UPDATE users SET name=?, phone=? WHERE id=?', [name, phone, req.user.id]);

    const [existing] = await pool.query('SELECT id FROM candidates WHERE user_id = ?', [req.user.id]);
    if (existing.length > 0) {
      await pool.query(
        'UPDATE candidates SET address=?,city=?,state=?,pincode=?,dob=?,gender=?,employment_type=?,monthly_income=?,pan_number=?,aadhar_number=? WHERE user_id=?',
        [address, city, state, pincode, dob, gender, employment_type, monthly_income, pan_number, aadhar_number, req.user.id]
      );
    } else {
      await pool.query(
        'INSERT INTO candidates (user_id,address,city,state,pincode,dob,gender,employment_type,monthly_income,pan_number,aadhar_number) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [req.user.id, address, city, state, pincode, dob, gender, employment_type, monthly_income, pan_number, aadhar_number]
      );
    }
    return res.json({ success: true, message: 'Profile updated successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// Admin: get all candidates
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.phone, u.created_at,
              c.city, c.state, c.employment_type, c.monthly_income, c.credit_score,
              (SELECT COUNT(*) FROM loan_applications WHERE user_id = u.id) as total_applications
       FROM users u
       LEFT JOIN candidates c ON c.user_id = u.id
       WHERE u.role = 'candidate'
       ORDER BY u.created_at DESC`
    );
    return res.json({ success: true, candidates: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;

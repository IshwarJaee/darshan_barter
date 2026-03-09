const express = require('express');
const router = express.Router();
const { sendMail } = require('../config/mailer');

// Contact form submission
router.post('/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
  }

  try {
    sendMail({
      to: process.env.EMAIL_USER,
      subject: `📩 Contact Form: Message from ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px">
          <h2 style="color:#1a3c6e">New Contact Form Submission</h2>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:8px;font-weight:bold;color:#374151">Name:</td><td style="padding:8px">${name}</td></tr>
            <tr style="background:#f9fafb"><td style="padding:8px;font-weight:bold;color:#374151">Email:</td><td style="padding:8px"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px;font-weight:bold;color:#374151">Phone:</td><td style="padding:8px">${phone || 'Not provided'}</td></tr>
            <tr style="background:#f9fafb"><td style="padding:8px;font-weight:bold;color:#374151">Message:</td><td style="padding:8px">${message}</td></tr>
          </table>
        </div>`,
    });
    return res.json({ success: true, message: 'Message sent successfully! We will get back to you soon.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;

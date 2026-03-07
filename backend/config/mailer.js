const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection on startup
transporter.verify((err) => {
  if (err) {
    console.warn('⚠️  Email service not configured:', err.message);
  } else {
    console.log('✅  Email service ready');
  }
});

const sendMail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'DarshanBarter <noreply@darshanbarter.com>',
      to,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error('Email send error:', err.message);
    return { success: false, error: err.message };
  }
};

// ─── Email Templates ────────────────────────────────────────────────
const registrationSuccessEmail = (name) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="font-family:Arial,sans-serif;background:#f4f6fa;margin:0;padding:20px;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1)">
    <div style="background:linear-gradient(135deg,#1a3c6e,#2563eb);padding:30px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:28px">DarshanBarter</h1>
      <p style="color:#bfdbfe;margin:6px 0 0">Finance & Loan Services</p>
    </div>
    <div style="padding:35px 30px">
      <h2 style="color:#1a3c6e">Welcome, ${name}! 🎉</h2>
      <p style="color:#4b5563;line-height:1.7">
        Thank you for registering with <strong>DarshanBarter</strong>. Your account has been successfully created.
      </p>
      <p style="color:#4b5563;line-height:1.7">
        You can now log in and explore our wide range of financial products and loan services tailored just for you.
      </p>
      <div style="text-align:center;margin:30px 0">
        <a href="${process.env.FRONTEND_URL}/login"
           style="background:linear-gradient(135deg,#1a3c6e,#2563eb);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
          Login to Your Account
        </a>
      </div>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:25px 0" />
      <p style="color:#6b7280;font-size:13px">
        If you did not create this account, please ignore this email or contact us at
        <a href="mailto:support@darshanbarter.com" style="color:#2563eb">support@darshanbarter.com</a>.
      </p>
    </div>
    <div style="background:#f9fafb;padding:15px;text-align:center;color:#9ca3af;font-size:12px">
      © ${new Date().getFullYear()} DarshanBarter. All rights reserved.
    </div>
  </div>
</body>
</html>`;

const passwordResetEmail = (name, resetLink) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="font-family:Arial,sans-serif;background:#f4f6fa;margin:0;padding:20px;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1)">
    <div style="background:linear-gradient(135deg,#1a3c6e,#2563eb);padding:30px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:28px">DarshanBarter</h1>
      <p style="color:#bfdbfe;margin:6px 0 0">Password Reset Request</p>
    </div>
    <div style="padding:35px 30px">
      <h2 style="color:#1a3c6e">Hi ${name},</h2>
      <p style="color:#4b5563;line-height:1.7">
        We received a request to reset your password. Click the button below to set a new password.
        This link will expire in <strong>1 hour</strong>.
      </p>
      <div style="text-align:center;margin:30px 0">
        <a href="${resetLink}"
           style="background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
          Reset My Password
        </a>
      </div>
      <p style="color:#4b5563;font-size:14px">Or paste this link into your browser:</p>
      <p style="background:#f3f4f6;padding:10px;border-radius:6px;word-break:break-all;font-size:13px;color:#374151">${resetLink}</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:25px 0" />
      <p style="color:#6b7280;font-size:13px">
        If you did not request a password reset, please ignore this email. Your password will remain unchanged.
      </p>
    </div>
    <div style="background:#f9fafb;padding:15px;text-align:center;color:#9ca3af;font-size:12px">
      © ${new Date().getFullYear()} DarshanBarter. All rights reserved.
    </div>
  </div>
</body>
</html>`;

const loanApplicationEmail = (name, loanType, amount) => `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /></head>
<body style="font-family:Arial,sans-serif;background:#f4f6fa;margin:0;padding:20px;">
  <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.1)">
    <div style="background:linear-gradient(135deg,#1a3c6e,#2563eb);padding:30px;text-align:center">
      <h1 style="color:#fff;margin:0;font-size:28px">DarshanBarter</h1>
      <p style="color:#bfdbfe;margin:6px 0 0">Loan Application Received</p>
    </div>
    <div style="padding:35px 30px">
      <h2 style="color:#1a3c6e">Hello ${name},</h2>
      <p style="color:#4b5563;line-height:1.7">
        Your <strong>${loanType}</strong> application for <strong>₹${Number(amount).toLocaleString('en-IN')}</strong>
        has been received successfully.
      </p>
      <div style="background:#eff6ff;border-left:4px solid #2563eb;padding:15px;border-radius:0 8px 8px 0;margin:20px 0">
        <p style="color:#1e40af;margin:0;font-weight:bold">Next Steps:</p>
        <ul style="color:#374151;margin:10px 0 0 0;padding-left:20px;line-height:1.8">
          <li>Our team will review your application within 24–48 hours.</li>
          <li>You may be contacted for additional documents.</li>
          <li>Track status in your dashboard.</li>
        </ul>
      </div>
      <p style="color:#4b5563;line-height:1.7">
        For queries, reach us at <a href="mailto:${process.env.SUPPORT_EMAIL || 'loans@darshanbarter.com'}" style="color:#2563eb">${process.env.SUPPORT_EMAIL || 'loans@darshanbarter.com'}</a>
        or call <strong>${process.env.SUPPORT_PHONE || '+91 98765 43210'}</strong>.
      </p>
    </div>
    <div style="background:#f9fafb;padding:15px;text-align:center;color:#9ca3af;font-size:12px">
      © ${new Date().getFullYear()} DarshanBarter. All rights reserved.
    </div>
  </div>
</body>
</html>`;

module.exports = {
  sendMail,
  registrationSuccessEmail,
  passwordResetEmail,
  loanApplicationEmail,
};

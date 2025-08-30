const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const nodemailer = require('nodemailer');

const router = express.Router();

function createTransporterFromEnv() {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const smtpSecure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : undefined;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (smtpHost && user && pass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort || 587,
      secure: smtpSecure ?? false,
      auth: { user, pass }
    });
  }

  if (user && pass) {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    });
  }

  return null;
}

const transporter = createTransporterFromEnv();

router.post('/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const saved = await ContactMessage.create({ name, email, subject, message });

    if (!transporter) {
      return res.status(500).json({ message: 'Email is not configured. Set EMAIL_USER and EMAIL_PASS (and optional SMTP_*).' });
    }

    const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
    if (!adminEmail) {
      return res.status(500).json({ message: 'ADMIN_EMAIL or EMAIL_USER must be set to receive messages.' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: adminEmail,
      replyTo: email,
      subject: `New Contact Form: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br/>')}</p>
        <hr/>
        <p><em>Submitted at: ${new Date().toLocaleString()}</em></p>
      `
    };

    await transporter.sendMail(mailOptions);

    return res.status(201).json({ success: true, id: saved._id, message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ message: 'Failed to send message. Please try again.' });
  }
});

module.exports = router;



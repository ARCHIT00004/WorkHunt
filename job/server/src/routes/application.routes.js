const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { requireAuth, requireRole } = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Ensure uploads directory exists
const uploadsRoot = path.join(__dirname, '..', '..', 'uploads', 'resumes');
fs.mkdirSync(uploadsRoot, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsRoot);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '';
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9-_]/g, '_');
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, base + '-' + unique + ext);
  }
});

const upload = multer({ storage });

// Candidate applies to a job
router.post('/jobs/:jobId/apply', requireAuth, requireRole('candidate'), upload.single('resume'), async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    const file = req.file;
    const resumeUrl = file ? `/uploads/resumes/${file.filename}` : undefined;
    const app = await Application.create({ job: jobId, candidate: req.user.id, resumeUrl, ...req.body });
    return res.status(201).json(app);
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(409).json({ message: 'You already applied for this job' });
    }
    return res.status(400).json({ message: err.message });
  }
});

// Employer views applications for their job
router.get('/jobs/:jobId/applications', requireAuth, requireRole('employer'), async (req, res) => {
  const { jobId } = req.params;
  const job = await Job.findOne({ _id: jobId, employer: req.user.id });
  if (!job) return res.status(404).json({ message: 'Job not found or forbidden' });
  const apps = await Application.find({ job: jobId }).populate('candidate', 'name email');
  res.json(apps);
});

// Candidate sees their applications
router.get('/me/applications', requireAuth, requireRole('candidate'), async (req, res) => {
  const apps = await Application.find({ candidate: req.user.id }).populate('job');
  res.json(apps);
});

module.exports = router;



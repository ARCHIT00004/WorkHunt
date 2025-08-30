const express = require('express');
const Job = require('../models/Job');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Public list + query
router.get('/', async (req, res) => {
  const { q, location, type, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (q) filter.$or = [
    { title: { $regex: q, $options: 'i' } },
    { description: { $regex: q, $options: 'i' } },
    { company: { $regex: q, $options: 'i' } }
  ];
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (type) filter.jobType = type;

  const skip = (Number(page) - 1) * Number(limit);

  const [items, total] = await Promise.all([
    Job.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate('employer', 'name'),
    Job.countDocuments(filter)
  ]);

  res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// Public read
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    return res.json(job);
  } catch (err) {
    return res.status(400).json({ message: 'Invalid ID' });
  }
});

// Employer-only create
router.post('/', requireAuth, requireRole('employer'), async (req, res) => {
  try {
    const payload = { ...req.body, employer: req.user.id };
    const job = await Job.create(payload);
    return res.status(201).json(job);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Employer-only update
router.put('/:id', requireAuth, requireRole('employer'), async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, employer: req.user.id },
      req.body,
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found or forbidden' });
    return res.json(job);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Employer-only delete
router.delete('/:id', requireAuth, requireRole('employer'), async (req, res) => {
  try {
    const deleted = await Job.findOneAndDelete({ _id: req.params.id, employer: req.user.id });
    if (!deleted) return res.status(404).json({ message: 'Job not found or forbidden' });
    return res.json({ success: true });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Employer dashboard: my jobs
router.get('/me/listings', requireAuth, requireRole('employer'), async (req, res) => {
  const jobs = await Job.find({ employer: req.user.id }).sort({ createdAt: -1 });
  res.json(jobs);
});

module.exports = router;



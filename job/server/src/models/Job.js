const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    salaryRange: { type: String },
    jobType: { type: String, enum: ['full-time', 'part-time', 'contract', 'internship', 'temporary'], default: 'full-time' },
    skills: [{ type: String }],
    employer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);



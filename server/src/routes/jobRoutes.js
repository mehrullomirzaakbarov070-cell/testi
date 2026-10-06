import express from 'express';
import Job from '../models/Job.js';
import { protect, recruiterOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, category, location, experience, recruiter } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      const categories = Array.isArray(category) ? category : [category];
      filter.category = { $in: categories };
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (experience) {
      filter.experience = { $regex: experience, $options: 'i' };
    }

    const jobs = await Job.find(filter)
      .populate('recruiter', 'name email role')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name email role');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    return res.json(job);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, recruiterOnly, async (req, res) => {
  try {
    const { title, company, category, location, salary, experience, description } = req.body;

    if (!title || !category || !location || !description) {
      return res.status(400).json({ message: 'Please provide title, category, location, and description.' });
    }

    const job = await Job.create({
      recruiter: req.user._id,
      title,
      company: company || 'Company',
      category,
      location,
      salary: salary || 'Compensation disclosed',
      experience: experience || 'Entry level',
      description,
    });

    return res.status(201).json(job);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, recruiterOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own jobs' });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(updatedJob);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, recruiterOnly, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.recruiter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own jobs' });
    }

    await job.deleteOne();
    return res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/:id/apply', protect, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.applicants.some((applicant) => applicant.toString() === req.user._id.toString())) {
      return res.status(400).json({ message: 'You have already applied to this job.' });
    }

    job.applicants.push(req.user._id);
    await job.save();

    return res.json({ message: 'Application submitted successfully.', job });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;

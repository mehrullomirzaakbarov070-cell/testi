import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import User from './models/User.js';
import Job from './models/Job.js';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Insiderjobs API is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);

const seedJobs = async () => {
  const recruiterCount = await User.countDocuments({ role: 'recruiter' });
  let recruiter = null;

  if (recruiterCount === 0) {
    recruiter = await User.create({
      name: 'Alicia Morgan',
      email: 'recruiter@insiderjobs.com',
      password: 'Password123',
      role: 'recruiter',
    });
  } else {
    recruiter = await User.findOne({ role: 'recruiter' });
  }

  const jobCount = await Job.countDocuments();

  if (jobCount === 0) {
    await Job.insertMany([
      {
        recruiter: recruiter._id,
        title: 'Senior Frontend Engineer',
        company: 'Microsoft',
        category: 'Programming',
        location: 'Seattle, WA',
        salary: '$180k - $220k',
        experience: 'Senior',
        description: 'Build scalable user interfaces for enterprise collaboration products and partner closely with design and platform teams to drive product quality.'
      },
      {
        recruiter: recruiter._id,
        title: 'Data Scientist - ML Platform',
        company: 'Walmart',
        category: 'Data Science',
        location: 'Bentonville, AR',
        salary: '$160k - $195k',
        experience: 'Mid-Senior',
        description: 'Develop recommendation and forecasting models for retail analytics, working with large-scale data pipelines and production ML systems.'
      },
      {
        recruiter: recruiter._id,
        title: 'Product Designer',
        company: 'Adobe',
        category: 'Design',
        location: 'San Jose, CA',
        salary: '$150k - $180k',
        experience: 'Mid',
        description: 'Design premium digital experiences for creative productivity tools and help shape the next generation of workflows for users around the world.'
      },
      {
        recruiter: recruiter._id,
        title: 'Network Security Engineer',
        company: 'Samsung',
        category: 'Networking',
        location: 'Austin, TX',
        salary: '$140k - $170k',
        experience: 'Mid',
        description: 'Monitor network health, secure enterprise environments, and collaborate with cloud and infrastructure teams on resilience planning.'
      },
      {
        recruiter: recruiter._id,
        title: 'Backend Engineer',
        company: 'Amazon',
        category: 'Programming',
        location: 'New York, NY',
        salary: '$170k - $205k',
        experience: 'Senior',
        description: 'Design and maintain APIs and distributed systems for high-scale commerce experiences with a focus on reliability and performance.'
      }
    ]);
  }
};

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

const startServer = async () => {
  await connectDB();
  await seedJobs();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();

export default app;

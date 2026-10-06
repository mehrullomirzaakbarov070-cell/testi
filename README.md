# Insiderjobs Job Portal

A full-stack job portal inspired by Insiderjobs, built with React + Vite + Tailwind CSS on the frontend and Node.js + Express + MongoDB on the backend.

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, React Router
- Backend: Node.js, Express, MongoDB, Mongoose, JWT
- Database: MongoDB (uses an in-memory MongoDB fallback for local development if no local MongoDB server is available)

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   npm --prefix client install
   npm --prefix server install
   ```
2. Start the development servers:
   ```bash
   npm run dev
   ```
3. Open the frontend at http://localhost:5173

## Default User Roles

- Job seeker: register with `role: "job-seeker"`
- Recruiter: register with `role: "recruiter"`

## Environment Variables

Create a `.env` file in the `server` folder with:

```env
PORT=5000
JWT_SECRET=your_super_secret_key
MONGODB_URI=mongodb://127.0.0.1:27017/insiderjobs
```

If `MONGODB_URI` is not provided, the backend will automatically start a temporary MongoDB instance for local development.

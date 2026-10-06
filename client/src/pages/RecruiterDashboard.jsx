import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Header from '../components/Header';

const initialForm = {
  title: '',
  company: '',
  category: 'Programming',
  location: '',
  salary: '',
  experience: 'Entry level',
  description: '',
};

function RecruiterDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('insiderjobs_user') || 'null');
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== 'recruiter') {
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-16">
        <div className="mx-auto max-w-xl rounded-[30px] bg-white p-10 text-center shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Recruiter access</p>
          <h1 className="mt-4 text-3xl font-black text-slate-900">Login as a recruiter</h1>
          <p className="mt-3 text-slate-600">Create job postings and manage openings from your dedicated dashboard.</p>
          <Link
            to="/auth?mode=login&role=recruiter"
            className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
          >
            Recruiter login
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data } = await api.post('/jobs', form);
      setSuccess(`Job posted successfully: ${data.title}`);
      setForm(initialForm);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to post this job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Post a new job</h1>
          </div>
          <button
            onClick={() => navigate('/auth')}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Switch account
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={handleSubmit} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Job title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500"
                  placeholder="Senior Product Manager"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Company</label>
                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500"
                  placeholder="Acme"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500"
                >
                  <option value="Programming">Programming</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Design">Design</option>
                  <option value="Networking">Networking</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500"
                  placeholder="Remote / New York"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Salary</label>
                <input
                  type="text"
                  name="salary"
                  value={form.salary}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500"
                  placeholder="$120k - $150k"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Experience</label>
                <select
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500"
                >
                  <option value="Entry level">Entry level</option>
                  <option value="Mid">Mid</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead">Lead</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500"
                  placeholder="Role overview, responsibilities, and expectations..."
                />
              </div>
            </div>

            {error && <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
            {success && <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{success}</div>}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Posting job...' : 'Post job'}
            </button>
          </form>

          <aside className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-violet-900 to-primary p-6 text-white shadow-soft">
            <p className="text-sm uppercase tracking-[0.18em] text-violet-200">Hiring overview</p>
            <h2 className="mt-3 text-2xl font-black">Reach qualified talent faster</h2>
            <ul className="mt-6 space-y-4 text-sm text-violet-100">
              <li>• Custom job listings for your team</li>
              <li>• Filtered search options for relevant applicants</li>
              <li>• Built-in access to a broad, active candidate pool</li>
            </ul>
            <div className="mt-8 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-violet-100">Active listings</p>
              <p className="mt-2 text-3xl font-black">24</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default RecruiterDashboard;

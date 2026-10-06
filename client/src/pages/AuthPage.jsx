import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

const initialState = {
  name: '',
  email: '',
  password: '',
  role: 'job-seeker',
};

function AuthPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const nextMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
    const nextRole = searchParams.get('role') === 'recruiter' ? 'recruiter' : 'job-seeker';

    setMode(nextMode);
    setForm((current) => ({ ...current, role: nextRole }));
  }, [searchParams]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'register' ? '/auth/register' : '/auth/login';
      const { data } = await api.post(endpoint, form);
      localStorage.setItem('insiderjobs_token', data.token);
      localStorage.setItem('insiderjobs_user', JSON.stringify(data.user));

      if (data.user.role === 'recruiter') {
        navigate('/recruiter-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-soft">
        <div className="grid min-h-[700px] lg:grid-cols-2">
          <div className="bg-gradient-to-br from-primary via-violet-800 to-slate-900 p-8 text-white">
            <Link to="/" className="text-3xl font-black tracking-tight">
              Insiderjobs
            </Link>
            <div className="mt-14">
              <p className="text-sm uppercase tracking-[0.18em] text-violet-200">Welcome back</p>
              <h1 className="mt-3 text-4xl font-black leading-tight">
                {mode === 'login' ? 'Log in to continue' : 'Create your account'}
              </h1>
              <p className="mt-4 max-w-md text-violet-100">
                Access curated companies, apply to relevant roles, and reach hiring teams faster.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center p-8">
            <div className="w-full max-w-md">
              <div className="mb-6 flex gap-3 rounded-full bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    mode === 'login' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    mode === 'register' ? 'bg-white text-primary shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'register' && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500"
                      placeholder="Jane Doe"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">I am a</label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500"
                  >
                    <option value="job-seeker">Job seeker</option>
                    <option value="recruiter">Recruiter</option>
                  </select>
                </div>

                {error && <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;

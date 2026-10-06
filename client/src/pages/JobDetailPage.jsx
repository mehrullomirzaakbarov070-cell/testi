import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import Header from '../components/Header';

function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    const token = localStorage.getItem('insiderjobs_token');

    if (!token) {
      window.location.href = '/auth';
      return;
    }

    try {
      await api.post(`/jobs/${id}/apply`);
      alert('Application submitted successfully.');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to apply right now.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <Link to="/" className="mb-6 inline-flex text-sm font-semibold text-primary hover:underline">
          ← Back to jobs
        </Link>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            Loading job details...
          </div>
        ) : !job ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
            Job not found.
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">{job.company}</p>
                  <h1 className="mt-2 text-3xl font-black text-slate-900">{job.title}</h1>
                </div>
                <span className="badge bg-amber-100 text-amber-700">{job.experience || 'Entry level'}</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
                <span>📍 {job.location}</span>
                <span>💼 {job.category}</span>
                <span>💰 {job.salary || 'Compensation disclosed'}</span>
              </div>

              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <h2 className="text-lg font-bold text-slate-900">Job description</h2>
                <p className="mt-3 whitespace-pre-line text-slate-700">{job.description}</p>
              </div>
            </article>

            <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Quick apply</h2>
              <p className="mt-3 text-sm text-slate-600">
                This role is currently accepting applications from qualified candidates.
              </p>

              <button
                onClick={handleApply}
                className="mt-6 w-full rounded-full bg-primary px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-800"
              >
                Apply now
              </button>

              <div className="mt-6 border-t border-slate-200 pt-5 text-sm text-slate-600">
                <p className="font-semibold text-slate-800">Recruiter contact</p>
                <p className="mt-2">{job.recruiter?.name || 'Hiring Team'}</p>
                <p>{job.recruiter?.email || 'hello@insiderjobs.com'}</p>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default JobDetailPage;

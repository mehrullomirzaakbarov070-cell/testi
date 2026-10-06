import { useEffect, useMemo, useState } from 'react';
import Header from '../components/Header';
import JobCard from '../components/JobCard';
import api from '../api/axios';

const categories = ['Programming', 'Data Science', 'Design', 'Networking'];
const companyLogos = ['Microsoft', 'Walmart', 'Accenture', 'Samsung', 'Amazon', 'Adobe'];

function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationTerm, setLocationTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const fetchJobs = async (keyword = searchTerm, location = locationTerm, categoriesSelected = selectedCategories) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      if (keyword) params.append('search', keyword);
      if (location) params.append('location', location);
      categoriesSelected.forEach((category) => params.append('category', category));

      const { data } = await api.get(`/jobs?${params.toString()}`);
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const toggleCategory = (category) => {
    setSelectedCategories((current) => {
      const updated = current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category];

      fetchJobs(searchTerm, locationTerm, updated);
      return updated;
    });
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchJobs(searchTerm, locationTerm, selectedCategories);
  };

  const handleApply = async (jobId) => {
    const token = localStorage.getItem('insiderjobs_token');

    if (!token) {
      window.location.href = '/auth';
      return;
    }

    try {
      await api.post(`/jobs/${jobId}/apply`);
      alert('Application submitted successfully.');
    } catch (error) {
      alert(error.response?.data?.message || 'Unable to submit application.');
    }
  };

  const featuredCount = useMemo(() => jobs.length, [jobs]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <section className="bg-gradient-to-r from-primary via-violet-900 to-violet-800 px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
            <div>
              <p className="mb-4 inline-flex rounded-full border border-violet-400/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-100">
                Find your next opportunity
              </p>
              <h1 className="max-w-xl text-4xl font-black leading-tight sm:text-5xl">
                Over 10,000+ jobs to apply
              </h1>
              <p className="mt-4 max-w-xl text-base text-violet-100 sm:text-lg">
                Search and discover roles across tech, design, marketing, and data from leading companies.
              </p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/5 p-4 shadow-soft backdrop-blur-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-violet-100">Jobs opened</p>
                  <p className="mt-2 text-3xl font-bold">{featuredCount}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-violet-100">Top companies</p>
                  <p className="mt-2 text-3xl font-bold">120+</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSearch} className="mt-8 grid gap-3 rounded-3xl bg-slate-950/20 p-3 backdrop-blur-sm sm:grid-cols-[1.2fr_1fr_auto]">
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Job title or keyword"
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-violet-200 outline-none transition focus:border-violet-300"
            />
            <input
              type="text"
              value={locationTerm}
              onChange={(event) => setLocationTerm(event.target.value)}
              placeholder="Location"
              className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white placeholder:text-violet-200 outline-none transition focus:border-violet-300"
            />
            <button
              type="submit"
              className="rounded-2xl bg-accent px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-orange-400"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          {companyLogos.map((company) => (
            <div key={company} className="text-lg font-bold tracking-tight text-slate-400">
              {company}
            </div>
          ))}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Category</h2>
            <div className="mt-5 space-y-3">
              {categories.map((category) => (
                <label key={category} className="flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  {category}
                </label>
              ))}
            </div>
          </aside>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-500">Latest jobs</p>
                <h2 className="mt-1 text-3xl font-bold text-slate-900">Open opportunities</h2>
              </div>
            </div>

            {loading ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
                Loading jobs...
              </div>
            ) : jobs.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600 shadow-sm">
                No jobs match your current filters.
              </div>
            ) : (
              <div className="grid gap-5 xl:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} onApply={handleApply} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

export default HomePage;

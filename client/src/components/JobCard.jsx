import { Link } from 'react-router-dom';

function JobCard({ job, onApply }) {
  const applyJob = () => {
    onApply(job._id);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-violet-500">{job.company}</p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">{job.title}</h3>
        </div>
        <span className="badge bg-amber-100 text-amber-700">{job.experience || 'Entry level'}</span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p>📍 {job.location}</p>
        <p>💼 {job.category}</p>
        <p>💰 {job.salary || 'Compensation disclosed'}</p>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Link
          to={`/jobs/${job._id}`}
          className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          View details
        </Link>

        <button
          onClick={applyJob}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-800"
        >
          Apply
        </button>
      </div>
    </div>
  );
}

export default JobCard;

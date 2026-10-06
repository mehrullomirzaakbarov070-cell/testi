import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('insiderjobs_user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('insiderjobs_token');
    localStorage.removeItem('insiderjobs_user');
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-2xl font-bold tracking-tight text-primary">
          Insiderjobs
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <Link to="/recruiter-dashboard" className="transition hover:text-primary">
            Recruiter Login
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={user.role === 'recruiter' ? '/recruiter-dashboard' : '/'}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary hover:text-primary"
              >
                {user.role === 'recruiter' ? 'Dashboard' : 'Profile'}
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/recruiter-dashboard"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary hover:text-primary"
              >
                Recruiter Login
              </Link>
              <Link
                to="/auth"
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-800"
              >
                Login / Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;

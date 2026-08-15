import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-black tracking-tight text-slate-900">
          Queue<span className="text-blue-600">Less</span>
        </Link>

        <nav className="flex items-center gap-2">
          {user ? (
            <>
              <NavLink to="/businesses" className={navClass}>Queues</NavLink>
              {(user.role === 'owner' || user.role === 'staff') && (
                <NavLink to="/staff" className={navClass}>Staff</NavLink>
              )}
              <button
                onClick={handleLogout}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navClass}>Login</NavLink>
              <Link to="/register" className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800">
                Get started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

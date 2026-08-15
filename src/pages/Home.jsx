import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <section className="grid min-h-[70vh] items-center gap-12 py-10 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700 ring-1 ring-blue-100">
          Real-time queue management
        </span>
        <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight tracking-tight text-slate-950 sm:text-6xl">
          Stop waiting in line. <span className="text-blue-600">Know your turn.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          QueueLess helps clinics, salons, service counters, and small businesses manage live queues while customers track their token from anywhere.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={user ? '/businesses' : '/register'} className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white shadow-soft hover:bg-slate-800">
            {user ? 'Browse queues' : 'Create an account'}
          </Link>
          {user && (user.role === 'owner' || user.role === 'staff') && (
            <Link to="/staff" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-bold text-slate-800 hover:bg-slate-50">
              Open staff dashboard
            </Link>
          )}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <div className="rounded-2xl bg-slate-950 p-6 text-white">
          <p className="text-sm font-semibold text-slate-400">CITY CARE CLINIC</p>
          <p className="mt-4 text-5xl font-black">#25</p>
          <p className="mt-2 text-slate-300">Your token</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-xs text-slate-400">Now serving</p>
              <p className="mt-1 text-2xl font-extrabold">#20</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-xs text-slate-400">People ahead</p>
              <p className="mt-1 text-2xl font-extrabold">4</p>
            </div>
          </div>
          <div className="mt-5 rounded-xl bg-blue-600 p-4 font-bold">
            🔔 Your turn is approaching
          </div>
        </div>
      </div>
    </section>
  );
}

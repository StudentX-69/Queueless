import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form);
      navigate(location.state?.from || '/businesses', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to log in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-soft">
        <h1 className="text-3xl font-black">Welcome back</h1>
        <p className="mt-2 text-slate-500">Log in to join or manage queues.</p>
        {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold">
            Email
            <input className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <input className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          <button disabled={submitting} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white disabled:opacity-60">
            {submitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="mt-5 text-sm text-slate-500">New to QueueLess? <Link className="font-bold text-blue-600" to="/register">Create an account</Link></p>
      </div>
    </section>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register(form);
      navigate(form.role === 'customer' ? '/businesses' : '/staff', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-md py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-soft">
        <h1 className="text-3xl font-black">Create your account</h1>
        <p className="mt-2 text-slate-500">Choose customer to join queues or owner to create a business.</p>
        {error && <p className="mt-4 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block text-sm font-semibold">
            Full name
            <input className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block text-sm font-semibold">
            Email
            <input className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </label>
          <label className="block text-sm font-semibold">
            Password
            <input className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </label>
          <label className="block text-sm font-semibold">
            Account type
            <select className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-4 py-3" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="customer">Customer</option>
              <option value="owner">Business owner</option>
            </select>
          </label>
          <button disabled={submitting} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-bold text-white disabled:opacity-60">
            {submitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="mt-5 text-sm text-slate-500">Already have an account? <Link className="font-bold text-blue-600" to="/login">Log in</Link></p>
      </div>
    </section>
  );
}

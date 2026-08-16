import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isOwner = user?.role === 'owner';
  const canSubmit = password.length > 0 && confirmText.trim().toUpperCase() === 'DELETE';

  const handleDelete = async (event) => {
    event.preventDefault();
    if (!canSubmit) return;

    setError('');
    setSubmitting(true);
    try {
      await deleteAccount(password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete account.');
      setSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-2xl space-y-6 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-soft">
        <h1 className="text-3xl font-black">Account settings</h1>
        <dl className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Name</dt>
            <dd className="mt-1 font-medium">{user?.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</dt>
            <dd className="mt-1 font-medium">{user?.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Role</dt>
            <dd className="mt-1 font-medium capitalize">{user?.role}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-7 shadow-soft">
        <h2 className="text-xl font-black text-rose-900">Delete account</h2>
        <p className="mt-2 text-sm text-rose-800">
          This permanently deletes your account and cannot be undone. It will also remove:
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-rose-800">
          <li>Your login and profile information</li>
          <li>Any queue tickets you've joined as a customer</li>
          {isOwner && (
            <li>
              <strong>Every business you own</strong>, including all of their queues and every
              customer's tickets in those queues
            </li>
          )}
          {!isOwner && <li>Your staff access to any business you help run</li>}
        </ul>

        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="mt-5 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-sm font-bold text-rose-700 hover:bg-rose-50"
          >
            Delete my account
          </button>
        ) : (
          <form onSubmit={handleDelete} className="mt-5 space-y-4 border-t border-rose-200 pt-5">
            {error && <p className="rounded-lg bg-rose-100 p-3 text-sm font-medium text-rose-700">{error}</p>}
            <label className="block text-sm font-semibold text-rose-900">
              Confirm your password
              <input
                type="password"
                required
                autoFocus
                className="mt-1 w-full rounded-xl border border-rose-300 bg-white px-4 py-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <label className="block text-sm font-semibold text-rose-900">
              Type DELETE to confirm
              <input
                type="text"
                required
                className="mt-1 w-full rounded-xl border border-rose-300 bg-white px-4 py-3"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE"
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={!canSubmit || submitting}
                className="rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {submitting ? 'Deleting...' : 'Permanently delete account'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirming(false);
                  setPassword('');
                  setConfirmText('');
                  setError('');
                }}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
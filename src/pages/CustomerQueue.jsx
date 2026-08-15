import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import { getSocket } from '../services/socket';
import { requestBrowserNotificationPermission, showBrowserNotification, playQueueBeep } from '../utils/notifications';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

export default function CustomerQueue() {
  const { queueId } = useParams();
  const { user } = useAuth();
  const [queue, setQueue] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [peopleAhead, setPeopleAhead] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const loadQueue = async () => {
    const { data } = await api.get(`/queues/${queueId}`);
    setQueue(data.queue);
    setTicket(data.myTicket || null);
    setPeopleAhead(data.peopleAhead || 0);
  };

  useEffect(() => {
    loadQueue()
      .catch((err) => setError(err.response?.data?.message || 'Unable to load queue.'))
      .finally(() => setLoading(false));
  }, [queueId]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('queue:join', queueId);

    const onUpdate = (payload) => {
      if (payload.queueId === queueId) {
        setQueue(payload.queue);
        loadQueue().catch(() => {});
      }
    };

    const onCalled = (payload) => {
      if (payload.queueId !== queueId || payload.customerId !== user?._id) return;
      setNotice(`Your token #${payload.tokenNumber} is now being called. Please proceed to ${payload.counterName || 'the counter'}.`);
      playQueueBeep();
      showBrowserNotification('QueueLess: Your turn', `Token #${payload.tokenNumber} is now being called.`);
    };

    socket.on('queue:updated', onUpdate);
    socket.on('token:called', onCalled);

    return () => {
      socket.emit('queue:leave', queueId);
      socket.off('queue:updated', onUpdate);
      socket.off('token:called', onCalled);
    };
  }, [queueId, user?._id]);

  const joinQueue = async () => {
    setBusy(true);
    setError('');
    try {
      await requestBrowserNotificationPermission();
      const { data } = await api.post(`/queues/${queueId}/join`);
      setTicket(data.ticket);
      await loadQueue();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to join queue.');
    } finally {
      setBusy(false);
    }
  };

  const leaveQueue = async () => {
    setBusy(true);
    try {
      await api.post(`/queues/${queueId}/leave`);
      setTicket(null);
      await loadQueue();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to leave queue.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="py-16 text-center text-slate-500">Loading queue...</div>;
  if (!queue) return <div className="py-16 text-center">Queue not found.</div>;

  return (
    <section className="mx-auto max-w-3xl">
      <Link to="/businesses" className="text-sm font-bold text-blue-600">← Back to queues</Link>
      <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">{queue.business?.name}</p>
            <h1 className="mt-2 text-3xl font-black">{queue.name}</h1>
          </div>
          <StatusBadge status={queue.status === 'OPEN' ? 'WAITING' : 'CANCELLED'} />
        </div>

        {notice && (
          <div className="mt-6 animate-pulse rounded-2xl border border-blue-200 bg-blue-50 p-5 text-blue-900">
            <p className="text-lg font-black">🔔 Your turn has arrived!</p>
            <p className="mt-1">{notice}</p>
          </div>
        )}

        {error && <p className="mt-6 rounded-lg bg-rose-50 p-3 text-sm font-medium text-rose-700">{error}</p>}

        {!ticket ? (
          <div className="mt-8 rounded-2xl bg-slate-950 p-7 text-white">
            <p className="text-slate-400">Now serving</p>
            <p className="mt-2 text-6xl font-black">#{queue.currentToken || '—'}</p>
            <button onClick={joinQueue} disabled={busy || queue.status !== 'OPEN'} className="mt-7 w-full rounded-xl bg-blue-600 px-5 py-3 font-black hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50">
              {busy ? 'Joining...' : queue.status === 'OPEN' ? 'Join queue' : 'Queue closed'}
            </button>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-slate-950 p-7 text-white sm:col-span-2">
              <p className="text-slate-400">Your token</p>
              <p className="mt-2 text-7xl font-black">#{ticket.tokenNumber}</p>
              <div className="mt-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Current token</p>
                  <p className="text-2xl font-extrabold">#{queue.currentToken || '—'}</p>
                </div>
                <StatusBadge status={ticket.status} />
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">People ahead</p>
              <p className="mt-1 text-3xl font-black">{peopleAhead}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold text-slate-500">Queue status</p>
              <p className="mt-1 text-3xl font-black">{queue.status}</p>
            </div>
            {['WAITING', 'CALLED'].includes(ticket.status) && (
              <button onClick={leaveQueue} disabled={busy} className="rounded-xl border border-rose-200 bg-white px-5 py-3 font-bold text-rose-700 hover:bg-rose-50 sm:col-span-2">
                {busy ? 'Leaving...' : 'Leave queue'}
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

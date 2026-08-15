import { useEffect, useState } from 'react';
import api from '../services/api';
import StatusBadge from '../components/StatusBadge';

export default function StaffDashboard() {
  const [businesses, setBusinesses] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [selectedQueue, setSelectedQueue] = useState(null);
  const [name, setName] = useState('');
  const [queueName, setQueueName] = useState('General Queue');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadBusinesses = async () => {
    const { data } = await api.get('/businesses/mine');
    setBusinesses(data.businesses);
    setSelectedBusiness((current) => current || data.businesses[0] || null);
    setSelectedQueue((current) => current || data.businesses[0]?.queues?.[0] || null);
  };

  const refreshQueue = async (queueId) => {
    if (!queueId) return;
    const { data } = await api.get(`/queues/${queueId}`);
    setSelectedQueue(data.queue);
  };

  useEffect(() => {
    loadBusinesses()
      .catch((err) => setError(err.response?.data?.message || 'Unable to load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  const createBusiness = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;
    try {
      const { data } = await api.post('/businesses', { name: name.trim() });
      setName('');
      await loadBusinesses();
      setSelectedBusiness(data.business);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create business.');
    }
  };

  const createQueue = async (event) => {
    event.preventDefault();
    if (!selectedBusiness || !queueName.trim()) return;
    try {
      const { data } = await api.post('/queues', { businessId: selectedBusiness._id, name: queueName.trim() });
      await loadBusinesses();
      setSelectedQueue(data.queue);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create queue.');
    }
  };

  const runQueueAction = async (action) => {
    if (!selectedQueue) return;
    try {
      const { data } = await api.post(`/queues/${selectedQueue._id}/${action}`);
      setSelectedQueue(data.queue);
    } catch (err) {
      setError(err.response?.data?.message || `Unable to ${action} token.`);
    }
  };

  if (loading) return <div className="py-16 text-center text-slate-500">Loading dashboard...</div>;

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Operations</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Staff dashboard</h1>
        <p className="mt-2 text-slate-500">Create a queue and move customers through it in real time.</p>
      </div>

      {error && <p className="rounded-lg bg-rose-50 p-3 text-rose-700">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-black">Create business</h2>
            <form onSubmit={createBusiness} className="mt-4 flex gap-2">
              <input className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3" placeholder="City Care Clinic" value={name} onChange={(e) => setName(e.target.value)} />
              <button className="rounded-xl bg-slate-900 px-4 py-3 font-bold text-white">Add</button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
            <h2 className="text-lg font-black">Your businesses</h2>
            <div className="mt-4 space-y-2">
              {businesses.map((business) => (
                <button key={business._id} onClick={() => { setSelectedBusiness(business); setSelectedQueue(business.queues?.[0] || null); }} className={`w-full rounded-xl border p-4 text-left ${selectedBusiness?._id === business._id ? 'border-blue-400 bg-blue-50' : 'border-slate-200 hover:bg-slate-50'}`}>
                  <p className="font-bold">{business.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{business.queues?.length || 0} queue(s)</p>
                </button>
              ))}
              {!businesses.length && <p className="text-sm text-slate-500">Create your first business above.</p>}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">Selected business</p>
              <h2 className="text-2xl font-black">{selectedBusiness?.name || '—'}</h2>
            </div>
            <form onSubmit={createQueue} className="flex gap-2">
              <input className="w-40 rounded-xl border border-slate-300 px-3 py-2" value={queueName} onChange={(e) => setQueueName(e.target.value)} />
              <button disabled={!selectedBusiness} className="rounded-xl bg-blue-600 px-4 py-2 font-bold text-white disabled:opacity-50">Create queue</button>
            </form>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {selectedBusiness?.queues?.map((queue) => (
              <button key={queue._id} onClick={() => { setSelectedQueue(queue); refreshQueue(queue._id); }} className={`rounded-full px-4 py-2 text-sm font-bold ${selectedQueue?._id === queue._id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}>
                {queue.name}
              </button>
            ))}
          </div>

          {selectedQueue ? (
            <div className="mt-8 rounded-2xl bg-slate-950 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400">{selectedQueue.name}</p>
                  <p className="mt-2 text-sm text-slate-400">Currently serving</p>
                  <p className="text-6xl font-black">#{selectedQueue.currentToken || '—'}</p>
                </div>
                <StatusBadge status={selectedQueue.status === 'OPEN' ? 'WAITING' : 'CANCELLED'} />
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <button onClick={() => runQueueAction('next')} className="rounded-xl bg-blue-600 px-4 py-3 font-black hover:bg-blue-500">Call next</button>
                <button onClick={() => runQueueAction('complete')} className="rounded-xl bg-emerald-600 px-4 py-3 font-black hover:bg-emerald-500">Complete current</button>
                <button onClick={() => runQueueAction('skip')} className="rounded-xl bg-amber-500 px-4 py-3 font-black hover:bg-amber-400">Skip current</button>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">Select a business and create a queue.</div>
          )}
        </div>
      </div>
    </section>
  );
}

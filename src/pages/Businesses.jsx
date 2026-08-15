import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Businesses() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/businesses')
      .then(({ data }) => setBusinesses(data.businesses))
      .catch((err) => setError(err.response?.data?.message || 'Unable to load businesses.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-16 text-center text-slate-500">Loading businesses...</div>;

  return (
    <section>
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-blue-600">Customer view</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">Choose a queue</h1>
        <p className="mt-2 text-slate-500">Join an active queue and track your token in real time.</p>
      </div>
      {error && <p className="mt-6 rounded-lg bg-rose-50 p-3 text-rose-700">{error}</p>}
      {!businesses.length ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No businesses are available yet. Create an owner account and add one from the staff dashboard.
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <article key={business._id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">🏥</div>
              <h2 className="mt-5 text-xl font-extrabold">{business.name}</h2>
              <p className="mt-2 text-sm text-slate-500">{business.description || 'Join an active QueueLess line.'}</p>
              <div className="mt-6 space-y-2">
                {business.queues?.map((queue) => (
                  <Link key={queue._id} to={`/queue/${queue._id}`} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 hover:border-blue-300 hover:bg-blue-50/50">
                    <span className="font-bold">{queue.name}</span>
                    <span className="text-sm font-semibold text-blue-600">Join →</span>
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

const styles = {
  WAITING: 'bg-amber-50 text-amber-700 ring-amber-200',
  CALLED: 'bg-blue-50 text-blue-700 ring-blue-200',
  SERVING: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  COMPLETED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  SKIPPED: 'bg-slate-100 text-slate-600 ring-slate-200',
  CANCELLED: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${styles[status] || styles.WAITING}`}>
      {status}
    </span>
  );
}

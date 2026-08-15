import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center text-center">
      <div>
        <p className="text-6xl font-black">404</p>
        <h1 className="mt-3 text-2xl font-black">Page not found</h1>
        <Link to="/" className="mt-6 inline-block rounded-xl bg-slate-900 px-5 py-3 font-bold text-white">Go home</Link>
      </div>
    </div>
  );
}

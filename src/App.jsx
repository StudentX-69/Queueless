import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Businesses from './pages/Businesses';
import CustomerQueue from './pages/CustomerQueue';
import StaffDashboard from './pages/StaffDashboard';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/businesses"
            element={
              <ProtectedRoute>
                <Businesses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/queue/:queueId"
            element={
              <ProtectedRoute>
                <CustomerQueue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff"
            element={
              <ProtectedRoute roles={['owner', 'staff']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </main>
    </div>
  );
}

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Context/useAuth';
import AdminDashboard from '../../Pages/Admin/AdminDashboard';

export default function AdminHome() {
  const { user } = useAuth();
  if (['owner', 'admin'].includes(user?.role)) return <AdminDashboard />;
  if (user?.role === 'finance') return <Navigate to="/admin/invoices" replace />;
  if (user?.role === 'inventory') return <Navigate to="/admin/inventory" replace />;
  return <Navigate to="/admin/orders" replace />;
}

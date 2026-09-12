import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Context/useAuth';

export default function AdminRoleRoute({ roles, children }) {
  const { user } = useAuth();
  if (!roles.includes(user?.role)) return <Navigate to="/admin" replace />;
  return children;
}

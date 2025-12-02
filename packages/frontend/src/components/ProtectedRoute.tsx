import React from 'react';
import { useAuth } from '../hooks/AuthContext';
import { Navigate } from 'react-router-dom';
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/no-access" replace />;
  return <>{children}</>;
};
export default ProtectedRoute;
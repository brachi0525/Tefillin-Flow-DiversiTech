
import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import routePermissions from './routePermissions';


export  function getUserRole(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role;
  } catch {
    return null;
  }
}

type ProtectedRouteProps = {
  allowedRoles?: string[];
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const location = useLocation();
  const role = getUserRole();

  if (!role) {
    return <Navigate to="/unauthorized" replace />;
  }


  const path = location.pathname;
  const rolesForPath = routePermissions[path];
  if (rolesForPath && !rolesForPath.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
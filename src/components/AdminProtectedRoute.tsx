import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function AdminProtectedRoute() {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('quantumBetsAdmin') === 'true';

  useEffect(() => {
    // Additional authentication logic can be added here
    // For example, token validation with the backend
  }, []);

  // If not authenticated, redirect to login page with the current location
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the outlet (child route components)
  return <Outlet />;
} 
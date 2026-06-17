import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sage"></div>
      </div>
    );
  }

  // If no user/token object exists, intercept access and route them back to login page
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
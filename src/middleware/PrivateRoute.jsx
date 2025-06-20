import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ children, requiredRole }) => {
  // Safe authentication data parser
  const getAuthData = () => {
    try {
      const authStr = localStorage.getItem("auth");
      
      // Handle cases where authStr is null, undefined, or "undefined"
      if (!authStr || authStr === "undefined") {
        return null;
      }
      
      return JSON.parse(authStr);
    } catch (error) {
      console.error("Error parsing auth data:", error);
      localStorage.removeItem("auth"); // Clean corrupted data
      return null;
    }
  };

  const authData = getAuthData();
  const token = authData?.accessToken;
  const userRole = authData?.role; // Assuming role is stored in auth data

  // Debugging (remove in production)
  console.log('ProtectedRoute check:', { 
    hasToken: !!token, 
    userRole, 
    requiredRole 
  });

  // No token - redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Role requirement check
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Support both direct children and nested routes
  return children ? children : <Outlet />;
};

export default PrivateRoute;
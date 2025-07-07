import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Komponen untuk melindungi route yang hanya bisa diakses setelah login
const ProtectedRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    // Jika belum login, redirect ke halaman login
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
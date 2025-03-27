import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Layout from './layout/Layout';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, currentUser } = useAuth();
  const location = useLocation();
  
  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated());
  console.log("ProtectedRoute - currentUser:", currentUser);
  
  if (!isAuthenticated()) {
    // Redirecionar para o login com informação sobre a rota de destino
    return <Navigate to="/login" state={{ redirect: location.pathname }} />;
  }
  
  return <Layout>{children}</Layout>;
};

export default ProtectedRoute;
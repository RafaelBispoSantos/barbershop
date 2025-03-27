import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminProtectedRoute = ({ children }) => {
    // Em vez de depender do contexto, obtenha diretamente do localStorage
    const userStr = localStorage.getItem('user');
    const userData = userStr ? JSON.parse(userStr) : null;
    const isAdmin = userData?.isAdmin === true;
    
    // Verificar se há token
    const token = localStorage.getItem('token');
    
    if (!token || !isAdmin) {
      return <Navigate to="/" />;
    }
    
    return children;
  };

export default AdminProtectedRoute;
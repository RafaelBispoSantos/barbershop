import React from 'react';
import { Link } from 'react-router-dom';
import { CogIcon } from '@heroicons/react/24/solid';

const AdminFloatingButton = () => {
  // Verificar se o usuário é admin
  const isAdmin = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    
    try {
      const userData = JSON.parse(userStr);
      return userData.isAdmin === true;
    } catch (e) {
      return false;
    }
  };

  if (!isAdmin()) return null;
  
  return (
    <Link
      to="/admin"
      className="fixed bottom-6 right-6 bg-barber text-white p-3 rounded-full shadow-lg hover:bg-barber-dark z-50 transition-transform hover:scale-110"
      title="Painel Administrativo"
    >
      <CogIcon className="h-6 w-6" />
    </Link>
  );
};

export default AdminFloatingButton;
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  ScissorsIcon,
  ChartBarIcon,
  CogIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';

const AdminLayout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Agendamentos', href: '/admin/appointments', icon: CalendarIcon },
    { name: 'Barbeiros', href: '/admin/barbers', icon: UserGroupIcon },
    { name: 'Serviços', href: '/admin/services', icon: ScissorsIcon },
    { name: 'Relatórios', href: '/admin/reports', icon: ChartBarIcon },
    { name: 'Configurações', href: '/admin/settings', icon: CogIcon },
  ];
  
  const isActiveRoute = (path) => {
    if (path === '/admin' && location.pathname === '/admin') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/admin';
  };
  
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar para mobile */}
      <div className={`md:hidden ${sidebarOpen ? 'fixed inset-0 z-40 flex' : ''}`}>
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setSidebarOpen(false)}
        />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-barber transition ease-in-out duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Fechar menu</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Link to="/admin" className="text-white font-bold text-xl">BarberApp Admin</Link>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                    isActiveRoute(item.href)
                      ? 'bg-barber-dark text-white'
                      : 'text-white hover:bg-barber-dark'
                  }`}
                >
                  <item.icon
                    className="mr-4 flex-shrink-0 h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-barber-dark p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-barber-dark flex items-center justify-center text-white">
                  {currentUser?.nome?.charAt(0) || 'A'}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-white">
                  {currentUser?.nome || 'Administrador'}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-barber-light hover:text-white flex items-center"
                >
                  <ArrowLeftOnRectangleIcon className="mr-1 h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 w-14">
          {/* Espaço em branco para forçar a barra lateral a encolher para preservar o layout móvel do sidebar */}
        </div>
      </div>
      
      {/* Sidebar para desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-barber">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Link to="/admin" className="text-white font-bold text-xl">BarberApp Admin</Link>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActiveRoute(item.href)
                        ? 'bg-barber-dark text-white'
                        : 'text-white hover:bg-barber-dark'
                    }`}
                  >
                    <item.icon
                      className="mr-3 flex-shrink-0 h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-barber-dark p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-9 w-9 rounded-full bg-barber-dark flex items-center justify-center text-white">
                    {currentUser?.nome?.charAt(0) || 'A'}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">
                    {currentUser?.nome || 'Administrador'}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-barber-light hover:text-white flex items-center"
                  >
                    <ArrowLeftOnRectangleIcon className="mr-1 h-3 w-3" />
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
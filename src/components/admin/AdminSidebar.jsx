import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  UsersIcon, 
  ScissorsIcon, 
  CalendarIcon, 
  UserIcon, 
  ChartBarIcon,
  CogIcon,
  LogOutIcon
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';


const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };
  
  const menuItems = [
    {
      label: 'Dashboard',
      path: '/admin/dashboard',
      icon: <HomeIcon size={20} />
    },
    {
      label: 'Barbeiros',
      path: '/admin/barbers',
      icon: <UsersIcon size={20} />
    },
    {
      label: 'Serviços',
      path: '/admin/services',
      icon: <ScissorsIcon size={20} />
    },
    {
      label: 'Agendamentos',
      path: '/admin/appointments',
      icon: <CalendarIcon size={20} />
    },
    {
      label: 'Clientes',
      path: '/admin/clients',
      icon: <UserIcon size={20} />
    },
    {
      label: 'Relatórios',
      path: '/admin/reports',
      icon: <ChartBarIcon size={20} />
    },
    {
      label: 'Configurações',
      path: '/admin/settings',
      icon: <CogIcon size={20} />
    }
  ];
  
  return (
    <div className="h-full bg-gray-800 text-white w-64 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">Painel Admin</h2>
      </div>
      
      <div className="py-4 flex-1 overflow-y-auto">
        <ul className="space-y-2 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${
                  isActive(item.path)
                    ? 'bg-barber text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700"
        >
          <LogOutIcon size={20} />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
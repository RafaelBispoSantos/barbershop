import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  CalendarIcon,
  ScissorsIcon,
  ArrowRightOnRectangleIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const desktopMenuRef = useRef(null);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };
  
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

  // Fecha os menus quando clicar fora deles
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Fecha o menu mobile quando clicar fora dele
      if (menuRef.current && !menuRef.current.contains(event.target) && isMenuOpen) {
        setIsMenuOpen(false);
      }
      
      // Fecha o menu desktop quando clicar fora dele
      if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target) && desktopMenuOpen) {
        setDesktopMenuOpen(false);
      }
    };

    // Adiciona o event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen, desktopMenuOpen]);

  // Impede o fechamento do menu ao clicar dentro dele
  const handleMenuClick = (e) => {
    e.stopPropagation();
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 relative shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <img src="/logo512.png" alt="BarberApp" className="h-10" />
          <span className="ml-2 text-xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-300 to-gray-500">BarberApp</span>
        </Link>
        
        {/* Menu para telas maiores */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">
            Início
          </Link>
          <Link to="/barbers" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">
            Barbeiros
          </Link>
          <Link to="/services" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">
            Serviços
          </Link>
          <Link to="/appointment" className="text-gray-300 hover:text-white transition-colors duration-300 font-medium">
            Agendar
          </Link>
          
          {currentUser ? (
            <div className="relative" ref={desktopMenuRef}>
              <button 
                className="flex items-center text-gray-300 hover:text-white transition-colors duration-300 font-medium"
                onClick={() => setDesktopMenuOpen(!desktopMenuOpen)}
              >
                <UserCircleIcon className="h-6 w-6 mr-1" />
                <span>{currentUser.nome?.split(' ')[0]}</span>
              </button>
              {desktopMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-xl py-1 z-50 border border-gray-700">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-300"
                  >
                    Meu Perfil
                  </Link>
                  <Link
                    to="/profile/appointments"
                    className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-300"
                  >
                    Meus Agendamentos
                  </Link>
                  
                  {/* Link para painel admin - só aparece para admin */}
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-300 font-medium hover:bg-gray-700 hover:text-white transition-colors duration-300"
                    >
                      Painel Administrativo
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-300"
                  >
                    Sair
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-lg text-white bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 transition-all duration-300"
            >
              Entrar
            </Link>
          )}
        </nav>
        
        {/* Botão de menu para telas menores */}
        <button
          className="md:hidden text-gray-300 hover:text-white transition-colors duration-300"
          onClick={toggleMenu}
        >
          <Bars3Icon className="h-6 w-6" />
        </button>
      </div>
      
      {/* Menu mobile */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm md:hidden"
        >
          <div 
            ref={menuRef}
            className="fixed inset-y-0 right-0 max-w-xs w-full bg-gray-900 shadow-2xl z-50 border-l border-gray-800"
            onClick={handleMenuClick}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h2 className="text-lg font-medium text-white">Menu</h2>
              <button
                className="text-gray-300 hover:text-white transition-colors duration-300"
                onClick={toggleMenu}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="py-2">
              <Link
                to="/"
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Início</span>
              </Link>
              <Link
                to="/barbers"
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <ScissorsIcon className="h-5 w-5 mr-3" />
                <span>Barbeiros</span>
              </Link>
              <Link
                to="/services"
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Serviços</span>
              </Link>
              <Link
                to="/appointment"
                className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <CalendarIcon className="h-5 w-5 mr-3" />
                <span>Agendar</span>
              </Link>
              
              {currentUser ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserCircleIcon className="h-5 w-5 mr-3" />
                    <span>Meu Perfil</span>
                  </Link>
                  <Link
                    to="/profile/appointments"
                    className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <CalendarIcon className="h-5 w-5 mr-3" />
                    <span>Meus Agendamentos</span>
                  </Link>
                  
                  {/* Link para painel admin no menu mobile - só aparece para admin */}
                  {isAdmin() && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-3 text-gray-300 font-medium hover:bg-gray-800 hover:text-white transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <CogIcon className="h-5 w-5 mr-3" />
                      <span>Painel Administrativo</span>
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-300 w-full"
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                    <span>Sair</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                  <span>Entrar</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
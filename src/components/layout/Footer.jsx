import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">BarberApp</h3>
            <p className="text-gray-400 mb-4">
              A melhor experiência em serviços de barbearia, com agendamento fácil e rápido.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/barbers" className="text-gray-400 hover:text-white">
                  Barbeiros
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white">
                  Serviços
                </Link>
              </li>
              <li>
                <Link to="/appointment" className="text-gray-400 hover:text-white">
                  Agendar
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contato</h3>
            <p className="text-gray-400 mb-2">Rua Exemplo, 123</p>
            <p className="text-gray-400 mb-2">São Paulo, SP</p>
            <p className="text-gray-400 mb-2">contato@barberapp.com</p>
            <p className="text-gray-400">(11) 99999-9999</p>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {currentYear} BarberApp. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
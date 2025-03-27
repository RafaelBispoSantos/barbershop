import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardBody } from '../ui/Card';
import Button from '../ui/Button';

const BarberCard = ({ barber }) => {
  const navigate = useNavigate();
  
  const handleViewProfile = () => {
    navigate(`/barbers/${barber._id}`);
  };
  
  const handleSchedule = () => {
    navigate('/appointment', { state: { barberId: barber._id } });
  };
  
  return (
    <Card className="h-full flex flex-col bg-gray-800 border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:transform hover:scale-[1.02]">
      <div className="h-72 bg-gray-900 overflow-hidden rounded-t-lg">
        {barber.fotoPerfil ? (
           <div className="w-full overflow-hidden rounded-t-lg relative group">
           <img
             src={barber.fotoPerfil}
             alt={barber.nome}
             className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-70"></div>
         </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-t-lg">
            <svg
              className="h-24 w-24 text-gray-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
              />
            </svg>
          </div>
        )}
      </div>
      <CardBody className="flex-grow bg-gray-800 text-gray-300">
        <h3 className="text-xl font-medium text-white mb-2">{barber.nome}</h3>
        
        {barber.especialidades && barber.especialidades.length > 0 && (
          <div className="mt-2">
            <p className="text-sm text-gray-400">Especialidades:</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {barber.especialidades.map((especialidade, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600"
                >
                  {especialidade}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-6 space-y-2">
          <Button 
            onClick={handleViewProfile} 
            variant="outline" 
            className="bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 transition-all duration-300" 
            fullWidth
          >
            Ver perfil
          </Button>
          <Button 
            onClick={handleSchedule} 
            className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 transition-all duration-300 shadow-lg" 
            fullWidth
          >
            Agendar horário
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default BarberCard;
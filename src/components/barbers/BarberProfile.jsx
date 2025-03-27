import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { barberService } from '../../services/barberService';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { formatPhone } from '../../utils/formatUtils';

const BarberProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [barber, setBarber] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBarber = async () => {
      try {
        setLoading(true);
        const data = await barberService.getBarberById(id);
        setBarber(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar informações do barbeiro. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBarber();
  }, [id]);
  
  const handleSchedule = () => {
    navigate('/appointment', { state: { barberId: id } });
  };
  
  if (loading) {
    return (
      <div className="flex justify-center my-12">
        <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }
  
  if (error) {
    return <Alert type="error" message={error} />;
  }
  
  if (!barber) {
    return <Alert type="error" message="Barbeiro não encontrado." />;
  }
  
  return (
    <div className="bg-gray-800 shadow-2xl rounded-lg overflow-hidden border border-gray-700">
      <div className="md:flex">
        <div className="md:w-1/3 h-80 md:h-auto bg-gray-900 relative">
          {barber.fotoPerfil ? (
            <div className="relative w-full h-full">
              <img
                src={barber.fotoPerfil}
                alt={barber.nome}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60"></div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <svg
                className="h-32 w-32 text-gray-600"
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
        
        <div className="p-8 md:w-2/3">
          <h1 className="text-3xl font-bold text-white mb-6">{barber.nome}</h1>
          
          <div className="mb-6">
            <p className="text-gray-300 mb-2">
              <span className="font-medium text-gray-200">Email:</span> {barber.email}
            </p>
            {barber.telefone && (
              <p className="text-gray-300">
                <span className="font-medium text-gray-200">Telefone:</span> {formatPhone(barber.telefone)}
              </p>
            )}
          </div>
          
          {barber.especialidades && barber.especialidades.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-medium text-white mb-3">Especialidades</h2>
              <div className="flex flex-wrap gap-2">
                {barber.especialidades.map((especialidade, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium bg-gray-700 text-gray-300 border border-gray-600"
                  >
                    {especialidade}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {barber.horarioTrabalho && (
            <div className="mb-8 bg-gray-900 p-4 rounded-lg border border-gray-700">
              <h2 className="text-xl font-medium text-white mb-3">Horário de Trabalho</h2>
              <p className="text-gray-300 mb-2">
                <span className="font-medium text-gray-200">Horário:</span> {barber.horarioTrabalho.inicio} às{" "}
                {barber.horarioTrabalho.fim}
              </p>
              <p className="text-gray-300">
                <span className="font-medium text-gray-200">Dias disponíveis:</span>{" "}
                {formatDiasSemana(barber.horarioTrabalho.diasDisponiveis)}
              </p>
            </div>
          )}
          
          <Button 
            onClick={handleSchedule} 
            className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 transition-all duration-300 shadow-lg py-3 text-lg" 
            fullWidth
          >
            Agendar horário com {barber.nome.split(' ')[0]}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Função auxiliar para formatar os dias da semana
const formatDiasSemana = (dias) => {
  if (!dias || !Array.isArray(dias)) return 'Não informado';
  
  const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  
  return dias
    .map((dia) => nomesDias[dia])
    .join(', ');
};

export default BarberProfile;
import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../hooks/useAuth';
import AppointmentCard from './AppointmentCard';
import Alert from '../ui/Alert';

const AppointmentList = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentUser?._id) return;
      
      try {
        setLoading(true);
        const data = await appointmentService.getAppointmentsByClient(currentUser._id);
        setAppointments(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar agendamentos. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [currentUser]);
  
  const handleStatusChange = (appointmentId, newStatus, justReviewed = false) => {
    setAppointments(prev => 
      prev.map(appointment => {
        if (appointment._id === appointmentId) {
          if (justReviewed) {
            // Apenas marcamos que foi avaliado, sem alterar o status
            return {
              ...appointment,
              avaliacao: { nota: 5, comentario: 'Avaliação enviada' } // Placeholder até recarregar
            };
          }
          return { ...appointment, status: newStatus };
        }
        return appointment;
      })
    );
  };
  
  const filteredAppointments = appointments.filter(appointment => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'upcoming') {
      return ['agendado', 'confirmado'].includes(appointment.status);
    }
    if (activeFilter === 'completed') {
      return appointment.status === 'concluido';
    }
    if (activeFilter === 'cancelled') {
      return appointment.status === 'cancelado';
    }
    return true;
  });
  
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
  
  if (appointments.length === 0) {
    return (
      <div className="text-center my-12 py-8 bg-gray-800 rounded-lg border border-gray-700 shadow-lg">
        <p className="text-gray-400 text-lg">Você ainda não tem agendamentos.</p>
      </div>
    );
  }
  
  return (
    <div >
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
            activeFilter === 'all'
              ? 'bg-gray-700 text-white shadow-lg'
              : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => setActiveFilter('all')}
        >
          Todos
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
            activeFilter === 'upcoming'
              ? 'bg-gray-700 text-white shadow-lg'
              : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => setActiveFilter('upcoming')}
        >
          Agendados
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
            activeFilter === 'completed'
              ? 'bg-gray-700 text-white shadow-lg'
              : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => setActiveFilter('completed')}
        >
          Concluídos
        </button>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
            activeFilter === 'cancelled'
              ? 'bg-gray-700 text-white shadow-lg'
              : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
          }`}
          onClick={() => setActiveFilter('cancelled')}
        >
          Cancelados
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAppointments.map((appointment) => (
          <AppointmentCard
            key={appointment._id}
            appointment={appointment}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
};

export default AppointmentList;

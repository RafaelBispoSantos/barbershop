import React, { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import { barberService } from '../../services/barberService';
import Alert from '../ui/Alert';

const TimeSlotPicker = ({ barberId, date, onSelectTime, selectedTime }) => {
  const [loading, setLoading] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!barberId || !date) return;
      
      try {
        setLoading(true);
        const formattedDate = format(date, 'yyyy-MM-dd');
        const slots = await barberService.getAvailableTimeSlots(barberId, formattedDate);
        setTimeSlots(slots);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar horários disponíveis. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimeSlots();
  }, [barberId, date]);
  
  if (loading) {
    return (
      <div className="flex justify-center my-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }
  
  if (error) {
    return <Alert type="error" message={error} />;
  }
  
  if (!barberId || !date) {
    return <p className="text-gray-400">Selecione um barbeiro e uma data para ver os horários disponíveis.</p>;
  }
  
  if (timeSlots.length === 0) {
    return (
      <div className="text-center my-6 py-4 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-gray-400">Não há horários disponíveis para esta data.</p>
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-lg font-medium text-white mb-4">
        Horários disponíveis para {format(date, "dd 'de' MMMM", { locale: pt })}
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {timeSlots.map((time) => (
          <button
            key={time}
            className={`py-2 px-4 rounded-md border text-sm font-medium transition-all duration-300 ${
              selectedTime === time
                ? 'bg-gray-700 text-white border-gray-600 shadow-lg'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
            }`}
            onClick={() => onSelectTime(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotPicker;
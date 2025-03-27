import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import { barberService } from '../../../services/barberService';
import { appointmentService } from '../../../services/appointmentService';
import { format, addDays, startOfWeek } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

const AdminBarberSchedule = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [barber, setBarber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [schedule, setSchedule] = useState({});
  const [editMode, setEditMode] = useState(false);
  
  // Horários de trabalho com intervalos de 30 minutos
  const timeSlots = [];
  for (let hour = 8; hour < 20; hour++) {
    for (let minute of [0, 30]) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
    }
  }

  const formatDiasSemana = (dias) => {
    if (!dias || !Array.isArray(dias)) return 'Não definido';
    
    const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return dias.map(dia => nomesDias[dia]).join(', ');
  };
  
  // Dias da semana para exibir
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
  
  useEffect(() => {
    const fetchBarberAndSchedule = async () => {
      try {
        setLoading(true);
        
        // Buscar informações do barbeiro
        const barberData = await barberService.getBarberById(id);
        setBarber(barberData);
        
        // Buscar agendamentos para cada dia da semana
        const weekSchedule = {};
        
        for (const day of weekDays) {
          const formattedDate = format(day, 'yyyy-MM-dd');
          const appointments = await appointmentService.getAppointmentsByDate(formattedDate, id);
          
          weekSchedule[formattedDate] = appointments;
        }
        
        setSchedule(weekSchedule);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar informações do barbeiro e agendamentos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBarberAndSchedule();
  }, [id, currentWeek,weekDays]);
  
  const handlePreviousWeek = () => {
    setCurrentWeek(prevWeek => addDays(prevWeek, -7));
  };
  
  const handleNextWeek = () => {
    setCurrentWeek(prevWeek => addDays(prevWeek, 7));
  };
  
  const isTimeSlotAvailable = (date, time) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dayAppointments = schedule[formattedDate] || [];
    
    return !dayAppointments.some(appointment => appointment.horario === time);
  };
  
  const isDayAvailable = (date) => {
    if (!barber || !barber.horarioTrabalho) return false;
    
    const dayOfWeek = date.getDay();
    return barber.horarioTrabalho.diasDisponiveis.includes(dayOfWeek);
  };
  
  const isTimeInWorkingHours = (time) => {
    if (!barber || !barber.horarioTrabalho) return false;
    
    const [hour, minute] = time.split(':').map(Number);
    const timeValue = hour * 60 + minute;
    
    const [startHour, startMinute] = barber.horarioTrabalho.inicio.split(':').map(Number);
    const startValue = startHour * 60 + startMinute;
    
    const [endHour, endMinute] = barber.horarioTrabalho.fim.split(':').map(Number);
    const endValue = endHour * 60 + endMinute;
    
    return timeValue >= startValue && timeValue < endValue;
  };
  
  const handleUpdateSchedule = async () => {
    try {
      // Aqui você pode adicionar a lógica para atualizar o horário de trabalho
      // Por exemplo, para adicionar ou remover dias disponíveis
      
      setEditMode(false);
    } catch (err) {
      setError('Erro ao atualizar horário de trabalho.');
      console.error(err);
    }
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-barber"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  if (!barber) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Alert type="error" message="Barbeiro não encontrado." />
          <div className="mt-4">
            <Button onClick={() => navigate('/admin/barbers')}>Voltar para a lista</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Horários de {barber.nome}</h1>
          <div className="flex space-x-3">
            {editMode ? (
              <>
                <Button onClick={handleUpdateSchedule}>Salvar Alterações</Button>
                <Button variant="secondary" onClick={() => setEditMode(false)}>
                  Cancelar
                </Button>
              </>
            ) : (
              <Button onClick={() => setEditMode(true)}>Editar Horário de Trabalho</Button>
            )}
          </div>
        </div>
        
        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-6"
            onClose={() => setError(null)}
          />
        )}
        
        {/* Informações do horário de trabalho */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Horário de Trabalho</h2>
          
          {barber.horarioTrabalho ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Horário:</p>
                <p className="font-medium">
                  {barber.horarioTrabalho.inicio} às {barber.horarioTrabalho.fim}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dias disponíveis:</p>
                <p className="font-medium">
                  {formatDiasSemana(barber.horarioTrabalho.diasDisponiveis)}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Horário de trabalho não configurado.</p>
          )}
        </div>
        
        {/* Navegação da semana */}
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" onClick={handlePreviousWeek}>
            &larr; Semana anterior
          </Button>
          <h2 className="text-lg font-medium text-gray-900">
            {format(weekDays[0], "dd 'de' MMMM", { locale: pt })} - {format(weekDays[6], "dd 'de' MMMM", { locale: pt })}
          </h2>
          <Button variant="outline" onClick={handleNextWeek}>
            Próxima semana &rarr;
          </Button>
        </div>
        
        {/* Grade de horários */}
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50">
                  Horário
                </th>
                {weekDays.map(day => (
                  <th
                    key={format(day, 'yyyy-MM-dd')}
                    className={`px-6 py-3 text-center text-xs font-medium uppercase tracking-wider ${
                      isDayAvailable(day) ? 'text-gray-500' : 'text-gray-400'
                    }`}
                  >
                    <div>{format(day, 'EEE', { locale: pt })}</div>
                    <div>{format(day, 'dd/MM')}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeSlots.map(time => (
                <tr key={time} className="hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white">
                    {time}
                  </td>
                  {weekDays.map(day => {
                    const formattedDate = format(day, 'yyyy-MM-dd');
                    const dayAppointments = schedule[formattedDate] || [];
                    const appointment = dayAppointments.find(a => a.horario === time);
                    
                    const isAvailable = isDayAvailable(day) && isTimeInWorkingHours(time) && isTimeSlotAvailable(day, time);
                    
                    return (
                      <td
                        key={`${formattedDate}-${time}`}
                        className={`px-6 py-3 text-center text-sm ${
                          !isDayAvailable(day) ? 'bg-gray-100' :
                          !isTimeInWorkingHours(time) ? 'bg-gray-100' :
                          appointment ? 'bg-blue-50' : isAvailable ? 'bg-green-50' : 'bg-red-50'
                        }`}
                      >
                        {appointment ? (
                          <div>
                            <div className="font-medium">{appointment.cliente.nome}</div>
                            <div className="text-xs text-gray-500">
                              {appointment.servicos.map(s => s.nome).join(', ')}
                            </div>
                          </div>
                        ) : (
                          <span className={`text-xs ${
                            !isDayAvailable(day) || !isTimeInWorkingHours(time) ? 'text-gray-400' :
                            isAvailable ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {!isDayAvailable(day) ? 'Indisponível' :
                             !isTimeInWorkingHours(time) ? 'Fora do horário' :
                             isAvailable ? 'Disponível' : 'Ocupado'}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminBarberSchedule;
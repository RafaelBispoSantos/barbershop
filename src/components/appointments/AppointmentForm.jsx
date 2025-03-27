// src/components/appointments/AppointmentForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import { barberService } from '../../services/barberService';
import { serviceService } from '../../services/serviceService';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../hooks/useAuth';
import { formatCurrency, formatDuration } from '../../utils/formatUtils';
import { getNextDays } from '../../utils/dateUtils';
import TimeSlotPicker from './TimeSlotPicker';

import Alert from '../ui/Alert';
import Button from '../ui/Button';
import ServiceList from '../services/ServiceList';

const AppointmentForm = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [barbers, setBarbers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedServicesData, setSelectedServicesData] = useState([]);
  
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  
  // Buscar barbeiros e serviços
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar barbeiros
        const barbersData = await barberService.getAllBarbers();
        setBarbers(barbersData);
        
        // Buscar serviços
        const servicesData = await serviceService.getAllServices();
        setServices(servicesData);
        
        // Verificar se há um barbeiro selecionado na navegação
        const barberId = location.state?.barberId;
        if (barberId) {
          setSelectedBarber(barberId);
        } else if (barbersData.length > 0) {
          setSelectedBarber(barbersData[0]._id);
        }
        
        setError(null);
      } catch (err) {
        setError('Erro ao carregar dados. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [location.state]);
  
  // Calcular preço total e duração
  useEffect(() => {
    if (selectedServices.length === 0) {
      setTotalPrice(0);
      setTotalDuration(0);
      setSelectedServicesData([]);
      return;
    }
    
    const selectedServicesInfo = services.filter(service => 
      selectedServices.includes(service._id)
    );
    
    setSelectedServicesData(selectedServicesInfo);
    
    const price = selectedServicesInfo.reduce(
      (total, service) => total + service.preco,
      0
    );
    
    const duration = selectedServicesInfo.reduce(
      (total, service) => total + service.duracao,
      0
    );
    
    setTotalPrice(price);
    setTotalDuration(duration);
  }, [selectedServices, services]);
  
  const handleSelectService = (service) => {
    setSelectedServices(prev => {
      const serviceIndex = prev.indexOf(service._id);
      if (serviceIndex === -1) {
        return [...prev, service._id];
      } else {
        const newServices = [...prev];
        newServices.splice(serviceIndex, 1);
        return newServices;
      }
    });
  };
  
  const nextDays = getNextDays(7);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      navigate('/login', { 
        state: { 
          redirect: '/appointment',
          message: 'Faça login para concluir o agendamento'
        } 
      });
      return;
    }
    
    if (!selectedBarber) {
      setError('Selecione um barbeiro.');
      return;
    }
    
    if (!selectedDate) {
      setError('Selecione uma data.');
      return;
    }
    
    if (!selectedTime) {
      setError('Selecione um horário.');
      return;
    }
    
    if (selectedServices.length === 0) {
      setError('Selecione pelo menos um serviço.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      const appointmentData = {
        cliente: currentUser._id,
        barbeiro: selectedBarber,
        servicos: selectedServices,
        data: format(selectedDate, 'yyyy-MM-dd'),
        horario: selectedTime,
      };
      
      await appointmentService.createAppointment(appointmentData);
      
      setSuccess('Agendamento realizado com sucesso!');
      
      // Limpar o formulário
      setSelectedServices([]);
      setSelectedTime('');
      
      // Redirecionar para os agendamentos do usuário
      setTimeout(() => {
        navigate('/profile/appointments');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao realizar agendamento. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center my-12">
        <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-gray-300"></div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700 max-w-4xl mx-auto">
      <div className="p-8">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">Agendar Horário</h2>
        
        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-6"
            onClose={() => setError(null)}
          />
        )}
        
        {success && (
          <Alert
            type="success"
            message={success}
            className="mb-6"
            onClose={() => setSuccess(null)}
          />
        )}
        
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="mb-8 w-full max-w-md">
            <label htmlFor="barber" className="block text-lg font-medium text-white mb-2 text-center">
              Selecione o Barbeiro
            </label>
            <select
              id="barber"
              value={selectedBarber}
              onChange={(e) => setSelectedBarber(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              required
            >
              <option value="">Selecione um barbeiro</option>
              {barbers.map((barber) => (
                <option key={barber._id} value={barber._id}>
                  {barber.nome}
                </option>
              ))}
            </select>
          </div>
          
          {selectedBarber && (
            <>
              <div className="mb-8 w-full">
                <label className="block text-lg font-medium text-white mb-3 text-center">
                  Selecione a Data
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 justify-center">
                  {nextDays.map((day) => (
                    <button
                      key={format(day, 'yyyy-MM-dd')}
                      type="button"
                      className={`flex flex-col items-center p-3 rounded-md border transition-all duration-300 ${
                        format(selectedDate, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
                          ? 'bg-gray-700 text-white border-gray-600 shadow-lg'
                          : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                      }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <span className="text-xs font-medium">
                        {format(day, 'EEE', { locale: pt })}
                      </span>
                      <span className="text-lg font-bold">
                        {format(day, 'dd')}
                      </span>
                      <span className="text-xs">
                        {format(day, 'MMM', { locale: pt })}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-8 w-full flex justify-center">
                <div className="w-full max-w-2xl">
                  <TimeSlotPicker
                    barberId={selectedBarber}
                    date={selectedDate}
                    onSelectTime={setSelectedTime}
                    selectedTime={selectedTime}
                  />
                </div>
              </div>
            </>
          )}
          
          <div className="mb-8 w-full">
            <h3 className="text-xl font-medium text-white mb-6 text-center">
              Selecione os Serviços
            </h3>
            <ServiceList
              onSelectService={handleSelectService}
              selectedServices={selectedServices}
            />
          </div>
          
          {selectedServices.length > 0 && (
            <div className="bg-gray-700 p-6 rounded-lg mb-8 border border-gray-600 shadow-lg w-full max-w-md mx-auto">
              <h3 className="text-xl font-medium text-white mb-4 text-center">
                Resumo do Agendamento
              </h3>
              
              <div className="space-y-3">
                {selectedServicesData.map((service) => (
                  <div key={service._id} className="flex justify-between py-2 border-b border-gray-600">
                    <span className="text-gray-300">{service.nome}</span>
                    <span className="font-medium text-white">{formatCurrency(service.preco)}</span>
                  </div>
                ))}
                
                <div className="pt-3 flex justify-between font-bold text-lg">
                  <span className="text-gray-300">Total:</span>
                  <span className="text-white">{formatCurrency(totalPrice)}</span>
                </div>
                
                <div className="text-sm text-gray-400 text-center mt-2">
                  Duração total: {formatDuration(totalDuration)}
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-center w-full">
            <Button
              type="submit"
              className="bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 transition-all duration-300 shadow-lg text-white px-8 py-3 text-lg"
              disabled={
                submitting ||
                !selectedBarber ||
                !selectedDate ||
                !selectedTime ||
                selectedServices.length === 0
              }
            >
              {submitting ? 'Agendando...' : 'Confirmar Agendamento'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
import React, { createContext, useState } from 'react';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

export const AppointmentContext = createContext();

export const AppointmentProvider = ({ children }) => {
  const [appointment, setAppointment] = useState({
    barbeiro: null,
    servicos: [],
    data: null,
    horario: null,
  });

  const selectBarber = (barber) => {
    setAppointment(prev => ({
      ...prev,
      barbeiro: barber._id,
      barbeiroInfo: barber
    }));
  };

  const selectDate = (date) => {
    setAppointment(prev => ({
      ...prev,
      data: format(date, 'yyyy-MM-dd')
    }));
  };

  const selectTime = (time) => {
    setAppointment(prev => ({
      ...prev,
      horario: time
    }));
  };

  const toggleService = (service) => {
    setAppointment(prev => {
      const serviceIds = [...prev.servicos];
      const serviceIndex = serviceIds.indexOf(service._id);
      
      if (serviceIndex === -1) {
        serviceIds.push(service._id);
      } else {
        serviceIds.splice(serviceIndex, 1);
      }
      
      return {
        ...prev,
        servicos: serviceIds
      };
    });
  };

  const isServiceSelected = (serviceId) => {
    return appointment.servicos.includes(serviceId);
  };

  const resetAppointment = () => {
    setAppointment({
      barbeiro: null,
      servicos: [],
      data: null,
      horario: null,
    });
  };

  const value = {
    appointment,
    selectBarber,
    selectDate,
    selectTime,
    toggleService,
    isServiceSelected,
    resetAppointment
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
};
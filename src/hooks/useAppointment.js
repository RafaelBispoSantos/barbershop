import { useContext } from 'react';
import { AppointmentContext } from '../contexts/AppointmentContext';

export const useAppointment = () => {
  return useContext(AppointmentContext);
};
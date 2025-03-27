import { format, addDays, parseISO, isValid } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

export const formatDate = (date) => {
  if (!date) return '';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return '';
  
  return format(parsedDate, 'dd/MM/yyyy', { locale: pt });
};

export const formatDateTime = (date, time) => {
  if (!date || !time) return '';
  
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (!isValid(parsedDate)) return '';
  
  const [hours, minutes] = time.split(':');
  const dateTime = new Date(parsedDate);
  dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));
  
  return format(dateTime, "dd 'de' MMMM 'às' HH:mm", { locale: pt });
};

export const formatTime = (time) => {
  if (!time) return '';
  
  return time;
};

export const getNextDays = (days = 7) => {
  const today = new Date();
  const nextDays = [];
  
  for (let i = 0; i < days; i++) {
    nextDays.push(addDays(today, i));
  }
  
  return nextDays;
};
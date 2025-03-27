import api from './api';

export const appointmentService = {
  createAppointment: async (appointmentData) => {
    const response = await api.post('/agendamentos', appointmentData);
    return response.data.data;
  },
  
  getAppointmentsByClient: async (clientId) => {
    const response = await api.get('/agendamentos', {
      params: { cliente: clientId }
    });
    return response.data.data;
  },
  
  getAppointmentById: async (id) => {
    const response = await api.get(`/agendamentos/${id}`);
    return response.data.data;
  },
  
  updateAppointmentStatus: async (id, status) => {
    const response = await api.patch(`/agendamentos/${id}/status`, { status });
    return response.data.data;
  },
  
  addAppointmentReview: async (id, reviewData) => {
    const response = await api.patch(`/agendamentos/${id}/avaliacao`, reviewData);
    return response.data.data;
  },
  getAppointmentsByDate: async (date, barbeiroId = null) => {
    try {
      const params = { data: date };
      if (barbeiroId) params.barbeiro = barbeiroId;
      
      const response = await api.get('/agendamentos', { params });
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar agendamentos por data:", error);
      return [];
    }
  },
  getAppointments: async (params = {}) => {
    try {
      const response = await api.get('/agendamentos', { params });
      return response.data.data;
    } catch (error) {
      console.error("Erro ao buscar agendamentos:", error);
      return [];
    }
  },
};

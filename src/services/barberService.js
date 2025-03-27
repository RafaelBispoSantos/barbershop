import api from './api';

export const barberService = {
  getAllBarbers: async () => {
    const response = await api.get('/barbeiros');
    return response.data.data;
  },
  
  getBarberById: async (id) => {
    const response = await api.get(`/barbeiros/${id}`);
    return response.data.data;
  },
  
  getAvailableTimeSlots: async (barberId, date) => {
    const response = await api.get('/barbeiros/horarios-disponiveis', {
      params: { barbeiroId: barberId, data: date }
    });
    return response.data.data;
  }, 
  updateBarber: async (id, barberData) => {
    try {
      const response = await api.patch(`/barbeiros/${id}`, barberData);
      return response.data;
    } catch (error) {
      console.error(`Erro ao atualizar barbeiro com ID ${id}:`, error);
      throw error;
    }
  },
  
  // Adicione esta função
  createBarber: async (barberData) => {
    try {
      const response = await api.post('/barbeiros', barberData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar barbeiro:', error);
      throw error;
    }
  },
  deleteBarber: async (id) => {
    try {
      const response = await api.delete(`/barbeiros/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir barbeiro com ID ${id}:`, error);
      throw error;
    }
  },
};
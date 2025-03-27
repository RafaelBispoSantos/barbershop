import api from './api';

export const serviceService = {
  getAllServices: async () => {
    const response = await api.get('/servicos');
    return response.data.data;
  },
  
  getServiceById: async (id) => {
    const response = await api.get(`/servicos/${id}`);
    return response.data.data;
  },
  
  getServicesByCategory: async () => {
    const response = await api.get('/servicos');
    const services = response.data.data;
    
    // Agrupando serviços por categoria
    return services.reduce((acc, service) => {
      const category = service.categoria || 'Outros';
      if (!acc[category]) acc[category] = [];
      acc[category].push(service);
      return acc;
    }, {});
  },
  createService: async (serviceData) => {
    try {
      const response = await api.post('/servicos', serviceData);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar serviço:', error);
      throw error;
    }
  },
  deleteService: async (id) => {
    try {
      const response = await api.delete(`/servicos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao excluir serviço com ID ${id}:`, error);
      throw error;
    }
  },
};
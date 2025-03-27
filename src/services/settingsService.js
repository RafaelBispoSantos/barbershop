import axios from 'axios';
import { getAuthHeader } from '../utils/auth';


const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const settingsService = {
  // Obter configurações atuais
  async getSettings() {
    const headers = getAuthHeader();
    const response = await axios.get(`${API_URL}/admin/settings`, { headers });
    return response.data;
  },
  
  // Atualizar configurações
  async updateSettings(settingsData) {
    const headers = getAuthHeader();
    const response = await axios.put(
      `${API_URL}/admin/settings`, 
      settingsData, 
      { headers }
    );
    return response.data;
  }
};
import React, { useState, useEffect } from 'react';
import { settingsService } from '../../../services/settingsService';
import AdminLayout from '../../../components/admin/AdminLayout';
import Alert from '../../../components/ui/Alert';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [generalSettings, setGeneralSettings] = useState({
    nomeBarbearia: '',
    endereco: '',
    telefone: '',
    email: '',
    website: '',
    logo: '',
    descricao: ''
  });
  
  const [businessHours, setBusinessHours] = useState({
    inicio: '09:00',
    fim: '19:00',
    diasFuncionamento: [1, 2, 3, 4, 5, 6]
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailConfirmacao: true,
    emailLembrete: true,
    smsLembrete: false,
    tempoLembreteHoras: 24
  });
  
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const data = await settingsService.getSettings();
        
        if (data.geral) {
          setGeneralSettings(data.geral);
        }
        
        if (data.horarioFuncionamento) {
          setBusinessHours(data.horarioFuncionamento);
        }
        
        if (data.notificacoes) {
          setNotificationSettings(data.notificacoes);
        }
        
        setError(null);
      } catch (err) {
        setError('Erro ao carregar configurações.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleBusinessHoursChange = (e) => {
    const { name, value } = e.target;
    setBusinessHours(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDayToggle = (dia) => {
    setBusinessHours(prev => {
      const diasAtuais = [...prev.diasFuncionamento];
      
      if (diasAtuais.includes(dia)) {
        return {
          ...prev,
          diasFuncionamento: diasAtuais.filter(d => d !== dia)
        };
      } else {
        return {
          ...prev,
          diasFuncionamento: [...diasAtuais, dia].sort()
        };
      }
    });
  };
  
  const handleNotificationChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setNotificationSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      const settingsData = {
        geral: generalSettings,
        horarioFuncionamento: businessHours,
        notificacoes: notificationSettings
      };
      
      await settingsService.updateSettings(settingsData);
      setSuccess('Configurações atualizadas com sucesso!');
      
      // Limpar mensagem de sucesso após alguns segundos
      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar configurações.');
      console.error(err);
    } finally {
      setSubmitting(false);
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
  
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Configurações</h1>
        
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
        
        <form onSubmit={handleSubmit}>
          {/* Seção: Informações Gerais */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações Gerais</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="nomeBarbearia"
                name="nomeBarbearia"
                label="Nome da Barbearia"
                value={generalSettings.nomeBarbearia}
                onChange={handleGeneralChange}
                required
              />
              
              <Input
                id="telefone"
                name="telefone"
                label="Telefone de Contato"
                value={generalSettings.telefone}
                onChange={handleGeneralChange}
                required
              />
              
              <Input
                id="email"
                name="email"
                label="Email de Contato"
                type="email"
                value={generalSettings.email}
                onChange={handleGeneralChange}
                required
              />
              
              <Input
                id="website"
                name="website"
                label="Website"
                value={generalSettings.website}
                onChange={handleGeneralChange}
              />
              
              <div className="md:col-span-2">
                <Input
                  id="endereco"
                  name="endereco"
                  label="Endereço Completo"
                  value={generalSettings.endereco}
                  onChange={handleGeneralChange}
                  required
                />
              </div>
              
              <Input
                id="logo"
                name="logo"
                label="URL do Logo"
                value={generalSettings.logo}
                onChange={handleGeneralChange}
              />
              
              <div className="md:col-span-2">
                <div className="flex flex-col space-y-1">
                  <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                    Descrição da Barbearia
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    value={generalSettings.descricao}
                    onChange={handleGeneralChange}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-barber focus:border-barber"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Seção: Horário de Funcionamento */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Horário de Funcionamento</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="inicio"
                name="inicio"
                label="Horário de Abertura"
                type="time"
                value={businessHours.inicio}
                onChange={handleBusinessHoursChange}
                required
              />
              
              <Input
                id="fim"
                name="fim"
                label="Horário de Fechamento"
                type="time"
                value={businessHours.fim}
                onChange={handleBusinessHoursChange}
                required
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dias de Funcionamento
              </label>
              
              <div className="flex flex-wrap gap-3">
                {[
                  { value: 0, label: 'Dom' },
                  { value: 1, label: 'Seg' },
                  { value: 2, label: 'Ter' },
                  { value: 3, label: 'Qua' },
                  { value: 4, label: 'Qui' },
                  { value: 5, label: 'Sex' },
                  { value: 6, label: 'Sáb' }
                ].map((dia) => (
                  <button
                    key={dia.value}
                    type="button"
                    className={`py-2 px-4 rounded-md border ${
                      businessHours.diasFuncionamento.includes(dia.value)
                        ? 'bg-barber text-white border-barber'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleDayToggle(dia.value)}
                  >
                    {dia.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Seção: Notificações */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Configurações de Notificações</h2>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="emailConfirmacao"
                  name="emailConfirmacao"
                  type="checkbox"
                  checked={notificationSettings.emailConfirmacao}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-barber border-gray-300 rounded focus:ring-barber"
                />
                <label htmlFor="emailConfirmacao" className="ml-2 block text-sm text-gray-900">
                  Enviar email de confirmação após agendamento
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="emailLembrete"
                  name="emailLembrete"
                  type="checkbox"
                  checked={notificationSettings.emailLembrete}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-barber border-gray-300 rounded focus:ring-barber"
                />
                <label htmlFor="emailLembrete" className="ml-2 block text-sm text-gray-900">
                  Enviar email de lembrete antes do agendamento
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  id="smsLembrete"
                  name="smsLembrete"
                  type="checkbox"
                  checked={notificationSettings.smsLembrete}
                  onChange={handleNotificationChange}
                  className="h-4 w-4 text-barber border-gray-300 rounded focus:ring-barber"
                />
                <label htmlFor="smsLembrete" className="ml-2 block text-sm text-gray-900">
                  Enviar SMS de lembrete antes do agendamento
                </label>
              </div>
              
              <div className="mt-4 max-w-xs">
                <Input
                  id="tempoLembreteHoras"
                  name="tempoLembreteHoras"
                  label="Tempo de lembrete (horas antes)"
                  type="number"
                  min="1"
                  max="72"
                  value={notificationSettings.tempoLembreteHoras}
                  onChange={handleNotificationChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : 'Salvar Configurações'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Settings;
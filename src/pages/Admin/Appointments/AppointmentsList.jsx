import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import { appointmentService } from '../../../services/appointmentService';
import { barberService } from '../../../services/barberService';
import { formatCurrency } from '../../../utils/formatUtils';
import { format, parseISO, isValid } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import { PlusIcon, SearchIcon } from '@heroicons/react/24/outline';

const AdminAppointmentsList = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    barbeiro: '',
    data: '',
    status: ''
  });
  const [barbers, setBarbers] = useState([]);
  
  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const data = await barberService.getAllBarbers();
        setBarbers(data);
      } catch (err) {
        console.error("Erro ao buscar barbeiros:", err);
      }
    };
    
    fetchBarbers();
  }, []);
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        
        // Criar objeto de parâmetros com filtros não vazios
        const params = {};
        if (filters.barbeiro) params.barbeiro = filters.barbeiro;
        if (filters.data) params.data = filters.data;
        if (filters.status) params.status = filters.status;
        
        const data = await appointmentService.getAppointments(params);
        setAppointments(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar os agendamentos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [filters]);
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      barbeiro: '',
      data: '',
      status: ''
    });
  };
  
  const formatAppointmentDate = (appointment) => {
    if (!appointment.data) return '';
    
    const date = typeof appointment.data === 'string' ? parseISO(appointment.data) : appointment.data;
    
    if (!isValid(date)) return '';
    
    return format(date, "dd/MM/yyyy", { locale: pt });
  };
  
  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      
      // Atualizar a lista local
      setAppointments(prevAppointments => 
        prevAppointments.map(appointment => 
          appointment._id === appointmentId 
            ? { ...appointment, status: newStatus } 
            : appointment
        )
      );
    } catch (err) {
      setError('Erro ao atualizar status do agendamento.');
      console.error(err);
    }
  };
  
  if (loading && appointments.length === 0) {
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Agendamentos</h1>
          <Link to="/admin/appointments/new">
            <Button className="flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Novo Agendamento
            </Button>
          </Link>
        </div>
        
        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-6"
            onClose={() => setError(null)}
          />
        )}
        
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Barbeiro
              </label>
              <select
                name="barbeiro"
                value={filters.barbeiro}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="">Todos os barbeiros</option>
                {barbers.map(barber => (
                  <option key={barber._id} value={barber._id}>
                    {barber.nome}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data
              </label>
              <input
                type="date"
                name="data"
                value={filters.data}
                onChange={handleFilterChange}
                className="form-input"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="form-input"
              >
                <option value="">Todos os status</option>
                <option value="agendado">Agendado</option>
                <option value="confirmado">Confirmado</option>
                <option value="concluido">Concluído</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full md:w-auto"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </div>
        
        {/* Lista de agendamentos */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 mb-4">Nenhum agendamento encontrado com os filtros selecionados.</p>
            <Button variant="outline" onClick={clearFilters}>Limpar Filtros</Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Hora
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cliente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Barbeiro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviços
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Valor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatAppointmentDate(appointment)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.horario}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.cliente?.nome || "Cliente não disponível"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.cliente?.telefone || ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.barbeiro?.nome || "Barbeiro não disponível"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {appointment.servicos?.map(servico => servico.nome).join(', ') || "Serviços não disponíveis"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          appointment.status === 'agendado' ? 'bg-blue-100 text-blue-800' :
                          appointment.status === 'confirmado' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'concluido' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(appointment.precoTotal || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/appointments/${appointment._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Detalhes
                          </Link>
                          
                          {appointment.status === 'agendado' && (
                            <button
                              onClick={() => handleUpdateStatus(appointment._id, 'confirmado')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Confirmar
                            </button>
                          )}
                          
                          {(appointment.status === 'agendado' || appointment.status === 'confirmado') && (
                            <button
                              onClick={() => handleUpdateStatus(appointment._id, 'concluido')}
                              className="text-teal-600 hover:text-teal-900"
                            >
                              Concluir
                            </button>
                          )}
                          
                          {(appointment.status === 'agendado' || appointment.status === 'confirmado') && (
                            <button
                              onClick={() => handleUpdateStatus(appointment._id, 'cancelado')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Cancelar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAppointmentsList;
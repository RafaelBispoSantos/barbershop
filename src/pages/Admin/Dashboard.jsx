import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Card from '../../components/ui/Card';
import { appointmentService } from '../../services/appointmentService';
import { barberService } from '../../services/barberService';
import { serviceService } from '../../services/serviceService';
import { formatCurrency } from '../../utils/formatUtils';
import { format, startOfDay, endOfDay, addDays } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAgendamentos: 0,
    agendamentosHoje: 0,
    faturamentoSemanal: 0,
    barbeirosAtivos: 0
  });
  
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar agendamentos de hoje
        const today = new Date();
        const formattedToday = format(today, 'yyyy-MM-dd');
        const todayAgendamentos = await appointmentService.getAppointmentsByDate(formattedToday);
        setTodayAppointments(todayAgendamentos);
        
        // Buscar estatísticas
        const totalAgendamentos = await appointmentService.getTotalAppointments();
        const barbeiros = await barberService.getAllBarbers();
        
        // Calcular faturamento da semana
        let faturamentoSemanal = 0;
        const endDate = today;
        const startDate = addDays(today, -7);
        
        for (let i = 0; i < 7; i++) {
          const date = addDays(startDate, i);
          const formattedDate = format(date, 'yyyy-MM-dd');
          const dayAppointments = await appointmentService.getAppointmentsByDate(formattedDate);
          
          faturamentoSemanal += dayAppointments.reduce((total, appt) => total + appt.precoTotal, 0);
        }
        
        setStats({
          totalAgendamentos: totalAgendamentos.length,
          agendamentosHoje: todayAgendamentos.length,
          faturamentoSemanal,
          barbeirosAtivos: barbeiros.filter(b => b.ativo).length
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const formatAppointmentTime = (appointment) => {
    const dateObj = new Date(appointment.data);
    const [hours, minutes] = appointment.horario.split(':');
    dateObj.setHours(parseInt(hours), parseInt(minutes));
    
    return format(dateObj, "HH:mm", { locale: pt });
  };
  
  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        
        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-barber"></div>
          </div>
        ) : (
          <>
            {/* Cards de estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-500 mb-2">Agendamentos Hoje</h3>
                <p className="text-3xl font-bold text-barber">{stats.agendamentosHoje}</p>
                <Link to="/admin/appointments" className="text-sm text-barber hover:underline mt-2 inline-block">
                  Ver detalhes
                </Link>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-500 mb-2">Total de Agendamentos</h3>
                <p className="text-3xl font-bold text-barber">{stats.totalAgendamentos}</p>
                <Link to="/admin/appointments" className="text-sm text-barber hover:underline mt-2 inline-block">
                  Ver histórico
                </Link>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-500 mb-2">Faturamento Semanal</h3>
                <p className="text-3xl font-bold text-barber">{formatCurrency(stats.faturamentoSemanal)}</p>
                <Link to="/admin/reports" className="text-sm text-barber hover:underline mt-2 inline-block">
                  Ver relatórios
                </Link>
              </Card>
              
              <Card className="p-6">
                <h3 className="text-lg font-medium text-gray-500 mb-2">Barbeiros Ativos</h3>
                <p className="text-3xl font-bold text-barber">{stats.barbeirosAtivos}</p>
                <Link to="/admin/barbers" className="text-sm text-barber hover:underline mt-2 inline-block">
                  Gerenciar barbeiros
                </Link>
              </Card>
            </div>
            
            {/* Agendamentos de hoje */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Agendamentos de Hoje</h2>
                <Link to="/admin/appointments/new" className="bg-barber text-white px-4 py-2 rounded-md hover:bg-barber-dark">
                  Novo Agendamento
                </Link>
              </div>
              
              {todayAppointments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum agendamento para hoje.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Horário
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
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {todayAppointments.map((appointment) => (
                        <tr key={appointment._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatAppointmentTime(appointment)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appointment.cliente.nome}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appointment.barbeiro.nome}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {appointment.servicos.map(s => s.nome).join(', ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              appointment.status === 'agendado' ? 'bg-blue-100 text-blue-800' :
                              appointment.status === 'confirmado' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'cancelado' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Link 
                              to={`/admin/appointments/${appointment._id}`}
                              className="text-barber hover:underline mr-3"
                            >
                              Detalhes
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Links rápidos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/admin/barbers" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Gerenciar Barbeiros</h3>
                <p className="text-gray-500">Adicione, edite ou desative barbeiros e configure seus horários de trabalho.</p>
              </Link>
              
              <Link to="/admin/services" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Gerenciar Serviços</h3>
                <p className="text-gray-500">Configure os serviços oferecidos, preços e durações.</p>
              </Link>
              
              <Link to="/admin/reports" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Relatórios</h3>
                <p className="text-gray-500">Veja relatórios detalhados de faturamento, agendamentos e desempenho.</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
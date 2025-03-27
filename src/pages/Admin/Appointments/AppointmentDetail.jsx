import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import { formatCurrency, formatDuration } from '../../../utils/formatUtils';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt-BR';
import { appointmentService } from '../../../services/appointmentService';

const AdminAppointmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        setLoading(true);
        const data = await appointmentService.getAppointmentById(id);
        setAppointment(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar detalhes do agendamento.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointment();
  }, [id]);
  
  const formatAppointmentDateTime = (appointment) => {
    if (!appointment || !appointment.data) return '';
    
    const date = typeof appointment.data === 'string' ? parseISO(appointment.data) : appointment.data;
    
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: pt });
  };
  
  const handleUpdateStatus = async (newStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(id, newStatus);
      setAppointment(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      setError('Erro ao atualizar status do agendamento.');
      console.error(err);
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
  
  if (!appointment) {
    return (
      <AdminLayout>
        <div className="p-6">
          <Alert type="error" message="Agendamento não encontrado." />
          <div className="mt-4">
            <Button onClick={() => navigate('/admin/appointments')}>
              Voltar para Agendamentos
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Detalhes do Agendamento</h1>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => navigate('/admin/appointments')}>
              Voltar
            </Button>
            
            {appointment.status === 'agendado' && (
              <Button onClick={() => handleUpdateStatus('confirmado')}>
                Confirmar
              </Button>
            )}
            
            {(appointment.status === 'agendado' || appointment.status === 'confirmado') && (
              <Button onClick={() => handleUpdateStatus('concluido')}>
                Concluir
              </Button>
            )}
            
            {(appointment.status === 'agendado' || appointment.status === 'confirmado') && (
              <Button variant="danger" onClick={() => handleUpdateStatus('cancelado')}>
                Cancelar
              </Button>
            )}
          </div>
        </div>
        
        {error && (
          <Alert
            type="error"
            message={error}
            className="mb-6"
            onClose={() => setError(null)}
          />
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações principais */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">Informações do Agendamento</h2>
                <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
                  appointment.status === 'agendado' ? 'bg-blue-100 text-blue-800' :
                  appointment.status === 'confirmado' ? 'bg-green-100 text-green-800' :
                  appointment.status === 'concluido' ? 'bg-gray-100 text-gray-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Data:</p>
                  <p className="font-medium">{formatAppointmentDateTime(appointment)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Horário:</p>
                  <p className="font-medium">{appointment.horario}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duração:</p>
                  <p className="font-medium">{formatDuration(appointment.duracao)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valor Total:</p>
                  <p className="font-medium">{formatCurrency(appointment.precoTotal)}</p>
                </div>
              </div>
              
              {appointment.notasCliente && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Notas do Cliente:</p>
                  <p className="bg-gray-50 p-2 rounded">{appointment.notasCliente}</p>
                </div>
              )}
            </div>
            
            {/* Serviços */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Serviços</h2>
              
              {appointment.servicos && appointment.servicos.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Serviço
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Duração
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preço
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointment.servicos.map((servico) => (
                        <tr key={servico._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{servico.nome}</div>
                            {servico.descricao && (
                              <div className="text-xs text-gray-500">{servico.descricao}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatDuration(servico.duracao)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(servico.preco)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold">
                          Total
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold">
                          {formatDuration(appointment.duracao)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-bold">
                          {formatCurrency(appointment.precoTotal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">Nenhum serviço encontrado.</p>
              )}
            </div>
            
            {/* Avaliação (se existir) */}
            {appointment.avaliacao && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Avaliação do Cliente</h2>
                
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star}>
                        {star <= appointment.avaliacao.nota ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-700">
                    {appointment.avaliacao.nota}/5
                  </span>
                </div>
                
                {appointment.avaliacao.comentario && (
                  <div>
                    <p className="text-sm text-gray-500">Comentário:</p>
                    <p className="bg-gray-50 p-2 rounded mt-1">{appointment.avaliacao.comentario}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Sidebar com informações do cliente e barbeiro */}
          <div className="lg:col-span-1">
            {/* Cliente */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Cliente</h2>
              
              {appointment.cliente ? (
                <div>
                  <div className="flex items-center mb-4">
                    {appointment.cliente.fotoPerfil ? (
                      <img
                        src={appointment.cliente.fotoPerfil}
                        alt={appointment.cliente.nome}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-lg">
                          {appointment.cliente.nome.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{appointment.cliente.nome}</p>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <p className="text-sm text-gray-500">Email:</p>
                    <p className="font-medium">{appointment.cliente.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Telefone:</p>
                    <p className="font-medium">{appointment.cliente.telefone}</p>
                  </div>
                  
                  <div className="mt-4">
                    <Link
                      to={`/admin/clients/${appointment.cliente._id}`}
                      className="text-barber hover:underline"
                    >
                      Ver perfil completo
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Informações do cliente não disponíveis.</p>
              )}
            </div>
            
            {/* Barbeiro */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Barbeiro</h2>
              
              {appointment.barbeiro ? (
                <div>
                  <div className="flex items-center mb-4">
                    {appointment.barbeiro.fotoPerfil ? (
                      <img
                        src={appointment.barbeiro.fotoPerfil}
                        alt={appointment.barbeiro.nome}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-lg">
                          {appointment.barbeiro.nome.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{appointment.barbeiro.nome}</p>
                    </div>
                  </div>
                  
                  {appointment.barbeiro.especialidades && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Especialidades:</p>
                      <div className="flex flex-wrap gap-1">
                        {appointment.barbeiro.especialidades.map((especialidade, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-barber-light text-barber-dark"
                          >
                            {especialidade}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Link
                      to={`/admin/barbers/${appointment.barbeiro._id}`}
                      className="text-barber hover:underline"
                    >
                      Ver perfil completo
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">Informações do barbeiro não disponíveis.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAppointmentDetail;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import Button from '../../../components/ui/Button';
import Alert from '../../../components/ui/Alert';
import { barberService } from '../../../services/barberService';
import { 
    PlusIcon, 
    PencilIcon, 
    TrashIcon, 
    UserCircleIcon,
    CalendarIcon,
    XCircleIcon,     // Substituto para BanIcon
    CheckCircleIcon
  } from '@heroicons/react/24/outline';

const AdminBarbersList = () => {
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        setLoading(true);
        const data = await barberService.getAllBarbers();
        setBarbers(data);
        setError(null);
      } catch (err) {
        setError('Erro ao carregar a lista de barbeiros.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBarbers();
  }, []);
  
  const handleToggleActive = async (barberId, currentStatus) => {
    try {
      await barberService.updateBarber(barberId, { ativo: !currentStatus });
      
      // Atualizar a lista local
      setBarbers(prevBarbers => 
        prevBarbers.map(barber => 
          barber._id === barberId 
            ? { ...barber, ativo: !currentStatus } 
            : barber
        )
      );
    } catch (err) {
      setError('Erro ao atualizar status do barbeiro.');
      console.error(err);
    }
  };

  const handleDeleteBarber = async (barberId) => {
    try {
      await barberService.deleteBarber(barberId);
      
      // Remover o barbeiro da lista local
      setBarbers(prevBarbers => 
        prevBarbers.filter(barber => barber._id !== barberId)
      );
      
      setConfirmDelete(null);
      // Mostrar mensagem de sucesso (opcional)
      setError({ type: 'success', message: 'Barbeiro excluído com sucesso!' });
    } catch (err) {
      if (err.response && err.response.status === 400) {
        // Erro específico quando há agendamentos futuros
        setError('Não é possível excluir este barbeiro pois existem agendamentos futuros.');
      } else {
        setError('Erro ao excluir barbeiro.');
      }
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
  
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gerenciamento de Barbeiros</h1>
          <Link to="/admin/barbers/new">
            <Button className="flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Novo Barbeiro
            </Button>
          </Link>
        </div>
        
        {error && typeof error === 'object' && error.type === 'success' ? (
          <Alert
            type="success"
            message={error.message}
            className="mb-6"
            onClose={() => setError(null)}
          />
        ) : error && (
          <Alert
            type="error"
            message={error}
            className="mb-6"
            onClose={() => setError(null)}
          />
        )}
        
        {barbers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 mb-4">Nenhum barbeiro cadastrado ainda.</p>
            <Link to="/admin/barbers/new">
              <Button>Adicionar Barbeiro</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Barbeiro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contato
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Especialidades
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Horário
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
                  {barbers.map((barber) => (
                    <tr key={barber._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {barber.fotoPerfil ? (
                            <img
                              src={barber.fotoPerfil}
                              alt={barber.nome}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <UserCircleIcon className="h-10 w-10 text-gray-400" />
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{barber.nome}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{barber.email}</div>
                        <div className="text-sm text-gray-500">{barber.telefone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {barber.especialidades?.map((especialidade, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-barber-light text-barber-dark"
                            >
                              {especialidade}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {barber.horarioTrabalho ? (
                          <>
                            <div>{barber.horarioTrabalho.inicio} - {barber.horarioTrabalho.fim}</div>
                            <div>
                              {formatDiasSemana(barber.horarioTrabalho.diasDisponiveis)}
                            </div>
                          </>
                        ) : (
                          "Não configurado"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          barber.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {barber.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            to={`/admin/barbers/${barber._id}/schedule`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Gerenciar Horários"
                          >
                            <CalendarIcon className="h-5 w-5" />
                          </Link>
                          <Link
                            to={`/admin/barbers/${barber._id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleToggleActive(barber._id, barber.ativo)}
                            className={barber.ativo ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                            title={barber.ativo ? "Desativar" : "Ativar"}
                          >
                            {barber.ativo ? (
                              <XCircleIcon className="h-5 w-5" />
                            ) : (
                              <CheckCircleIcon className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(barber._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Modal de confirmação de exclusão */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar exclusão</h3>
              <p className="text-gray-500 mb-6">
                Esta ação não poderá ser desfeita. O barbeiro será permanentemente excluído do sistema.
              </p>
              <div className="flex justify-end space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="danger"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDeleteBarber(confirmDelete)}
                >
                  Confirmar Exclusão
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

// Função auxiliar para formatar os dias da semana
const formatDiasSemana = (dias) => {
  if (!dias || !Array.isArray(dias)) return 'Não definido';
  
  const nomesDias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return dias.map(dia => nomesDias[dia]).join(', ');
};

export default AdminBarbersList;
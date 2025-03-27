import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ScissorsIcon,
  XCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import AdminLayout from "../../components/admin/AdminLayout";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { serviceService } from "../../services/serviceService";
import { formatDuration } from "date-fns";
import { formatCurrency } from "../../utils/formatUtils";

const AdminServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await serviceService.getAllServices();
      setServices(data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar a lista de serviços.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (serviceId, currentStatus) => {
    try {
      await serviceService.updateService(serviceId, { ativo: !currentStatus });

      // Atualizar a lista local
      setServices((prevServices) =>
        prevServices.map((service) =>
          service._id === serviceId
            ? { ...service, ativo: !currentStatus }
            : service
        )
      );

      setSuccess(
        `Serviço ${!currentStatus ? "ativado" : "desativado"} com sucesso!`
      );

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError("Erro ao atualizar status do serviço.");
      console.error(err);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await serviceService.deleteService(serviceId);

      // Remover o serviço da lista local
      setServices((prevServices) =>
        prevServices.filter((service) => service._id !== serviceId)
      );
      setConfirmDelete(null);

      setSuccess("Serviço excluído com sucesso!");

      // Limpar mensagem de sucesso após 3 segundos
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError("Erro ao excluir o serviço.");
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
          <h1 className="text-2xl font-bold text-gray-900">
            Gerenciamento de Serviços
          </h1>
          <Link to="/admin/services/new">
            <Button className="flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Novo Serviço
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

        {success && (
          <Alert
            type="success"
            message={success}
            className="mb-6"
            onClose={() => setSuccess(null)}
          />
        )}

        {services.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500 mb-4">
              Nenhum serviço cadastrado ainda.
            </p>
            <Link to="/admin/services/new">
              <Button>Adicionar Serviço</Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Serviço
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoria
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duração
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Preço
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
                  {services.map((service) => (
                    <tr key={service._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {service.imagem ? (
                            <img
                              src={service.imagem}
                              alt={service.nome}
                              className="h-10 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                              <ScissorsIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {service.nome}
                            </div>
                            {service.descricao && (
                              <div className="text-xs text-gray-500 max-w-xs truncate">
                                {service.descricao}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.categoria || "Sem categoria"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDuration(service.duracao)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatCurrency(service.preco)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            service.ativo
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {service.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-3">
                          <Link
                            to={`/admin/services/${service._id}/edit`}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() =>
                              handleToggleActive(service._id, service.ativo)
                            }
                            className={
                              service.ativo
                                ? "text-red-600 hover:text-red-900"
                                : "text-green-600 hover:text-green-900"
                            }
                            title={service.ativo ? "Desativar" : "Ativar"}
                          >
                            {service.ativo ? (
                              <XCircleIcon className="h-5 w-5" />
                            ) : (
                              <CheckCircleIcon className="h-5 w-5" />
                            )}
                          </button>
                          <button
                            onClick={() => setConfirmDelete(service._id)}
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirmar exclusão
              </h3>
              <p className="text-gray-500 mb-6">
                Esta ação não poderá ser desfeita. O serviço será
                permanentemente excluído do sistema.
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
                  onClick={() => handleDeleteService(confirmDelete)}
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

export default AdminServicesList;
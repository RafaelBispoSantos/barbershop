import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceService } from '../../../../services/serviceService';
import AdminLayout from '../../../../components/admin/AdminLayout';
import Alert from '../../../../components/ui/Alert';
import Input from '../../../../components/ui/Input';
import Button from '../../../../components/ui/Button';


const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: 0,
    duracao: 30,
    categoria: 'Cortes',
    imagem: '',
    ativo: true
  });
  
  useEffect(() => {
    if (isEditing) {
      const fetchService = async () => {
        try {
          setLoading(true);
          const data = await serviceService.getServiceById(id);
          setFormData(data);
          setError(null);
        } catch (err) {
          setError('Erro ao carregar informações do serviço.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      
      fetchService();
    }
  }, [id, isEditing]);
  
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      let result;
      
      if (isEditing) {
        result = await serviceService.updateService(id, formData);
        setSuccess('Serviço atualizado com sucesso!');
      } else {
        result = await serviceService.createService(formData);
        setSuccess('Serviço criado com sucesso!');
      }
      console.log(result);

      // Redirecionar após um breve delay para mostrar a mensagem de sucesso
      setTimeout(() => {
        navigate('/admin/services');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao salvar informações do serviço.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  const categoriaOptions = [
    "Cortes",
    "Barbas",
    "Tratamentos",
    "Coloração",
    "Combos",
    "Outros"
  ];
  
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditing ? 'Editar Serviço' : 'Adicionar Novo Serviço'}
        </h1>
        
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
        
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="nome"
              name="nome"
              label="Nome do Serviço"
              value={formData.nome}
              onChange={handleChange}
              required
            />
            
            <div className="flex flex-col space-y-1">
              <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
                Categoria
              </label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-barber focus:border-barber rounded-md shadow-sm"
                required
              >
                {categoriaOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            
            <Input
              id="preco"
              name="preco"
              label="Preço (R$)"
              type="number"
              min="0"
              step="0.01"
              value={formData.preco}
              onChange={handleChange}
              required
            />
            
            <Input
              id="duracao"
              name="duracao"
              label="Duração (minutos)"
              type="number"
              min="15"
              step="5"
              value={formData.duracao}
              onChange={handleChange}
              required
            />
            
            <Input
              id="imagem"
              name="imagem"
              label="URL da Imagem"
              value={formData.imagem}
              onChange={handleChange}
            />
          </div>
          
          <div className="mt-4 md:col-span-2">
            <div className="flex flex-col space-y-1">
              <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-barber focus:border-barber"
              />
            </div>
          </div>
          
          {isEditing && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Status</h3>
              
              <div className="flex items-center">
                <input
                  id="ativo"
                  name="ativo"
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                  className="h-4 w-4 text-barber border-gray-300 rounded focus:ring-barber"
                />
                <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
                  Serviço Ativo
                </label>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/services')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ServiceForm;
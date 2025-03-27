import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../components/admin/AdminLayout';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Alert from '../../../components/ui/Alert';
import { barberService } from '../../../services/barberService';

const BarberForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Estado inicial com estrutura completa
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    especialidades: '',
    fotoPerfil: '',
    horarioTrabalho: {
      inicio: '09:00',
      fim: '18:00',
      diasDisponiveis: [1, 2, 3, 4, 5]
    },
    ativo: true
  });
  
  useEffect(() => {
    if (isEditing) {
      const fetchBarber = async () => {
        try {
          setLoading(true);
          const data = await barberService.getBarberById(id);
          
          // Garantir que horarioTrabalho sempre exista com valores padrão
          const horarioTrabalho = data.horarioTrabalho || {
            inicio: '09:00',
            fim: '18:00',
            diasDisponiveis: [1, 2, 3, 4, 5]
          };
          
          // Se diasDisponiveis não existir, inicialize com array vazio
          horarioTrabalho.diasDisponiveis = horarioTrabalho.diasDisponiveis || [];
          
          // Converter a lista de especialidades para string
          const especialidadesStr = Array.isArray(data.especialidades)
            ? data.especialidades.join(', ')
            : '';
          
          setFormData({
            ...formData, // Mantenha os valores padrão
            ...data,     // Sobrescreva com dados da API
            especialidades: especialidadesStr,
            horarioTrabalho, // Sobrescreva com horarioTrabalho tratado
            ativo: data.ativo !== undefined ? data.ativo : true // Valor padrão se não existir
          });
          
          setError(null);
        } catch (err) {
          console.error('Erro detalhado:', err);
          setError('Erro ao carregar informações do barbeiro.');
        } finally {
          setLoading(false);
        }
      };
      
      fetchBarber();
    }
  }, [id, isEditing, formData]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Lidar com campos aninhados (horarioTrabalho)
      const [parent, child] = name.split('.');
      
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent] || {}), // Tratamento para evitar undefined
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleDiasChange = (dia) => {
    setFormData(prev => {
      // Certifique-se de que horarioTrabalho e diasDisponiveis existam
      const horarioTrabalho = prev.horarioTrabalho || {
        inicio: '09:00',
        fim: '18:00',
        diasDisponiveis: []
      };
      const diasAtuais = Array.isArray(horarioTrabalho.diasDisponiveis) 
        ? [...horarioTrabalho.diasDisponiveis] 
        : [];
      
      if (diasAtuais.includes(dia)) {
        // Remover dia
        return {
          ...prev,
          horarioTrabalho: {
            ...horarioTrabalho,
            diasDisponiveis: diasAtuais.filter(d => d !== dia)
          }
        };
      } else {
        // Adicionar dia
        return {
          ...prev,
          horarioTrabalho: {
            ...horarioTrabalho,
            diasDisponiveis: [...diasAtuais, dia].sort((a, b) => a - b)
          }
        };
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Converter a string de especialidades de volta para um array
      const especialidadesArray = formData.especialidades
        ? formData.especialidades.split(',').map(item => item.trim()).filter(item => item)
        : [];
      
      // Garantir que todos os campos obrigatórios estejam presentes
      const barbeiroDados = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        especialidades: especialidadesArray,
        fotoPerfil: formData.fotoPerfil || '',
        horarioTrabalho: {
          inicio: formData.horarioTrabalho?.inicio || '09:00',
          fim: formData.horarioTrabalho?.fim || '18:00',
          diasDisponiveis: formData.horarioTrabalho?.diasDisponiveis || [1, 2, 3, 4, 5]
        },
        ativo: formData.ativo !== undefined ? formData.ativo : true
      };
      
      console.log('Enviando dados:', barbeiroDados);
      
      let result;
      
      if (isEditing) {
        result = await barberService.updateBarber(id, barbeiroDados);
        console.log('Resposta da API (update):', result);
        
        // Atualizar formData com os dados retornados
        if (result) {
          // Converter a lista de especialidades para string
          const especialidadesStr = Array.isArray(result.especialidades)
            ? result.especialidades.join(', ')
            : '';
            
          setFormData({
            ...result,
            especialidades: especialidadesStr
          });
        }
        
        setSuccess('Barbeiro atualizado com sucesso!');
      } else {
        result = await barberService.createBarber(barbeiroDados);
        console.log('Resposta da API (create):', result);
        
        // Atualizar formData com os dados retornados
        if (result) {
          // Converter a lista de especialidades para string
          const especialidadesStr = Array.isArray(result.especialidades)
            ? result.especialidades.join(', ')
            : '';
            
          setFormData({
            ...result,
            especialidades: especialidadesStr
          });
        }
        
        setSuccess('Barbeiro criado com sucesso!');
      }
      
      // Redirecionar após um breve delay para mostrar a mensagem de sucesso
      setTimeout(() => {
        navigate('/admin/barbers');
      }, 2000);
    } catch (err) {
      console.error('Erro detalhado:', err);
      console.error('Status:', err.response?.status);
      console.error('Dados da resposta:', err.response?.data);
      
      setError(err.response?.data?.message || 'Erro ao salvar informações do barbeiro.');
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEditing ? 'Editar Barbeiro' : 'Adicionar Novo Barbeiro'}
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
              label="Nome Completo"
              value={formData.nome || ''}
              onChange={handleChange}
              required
            />
            
            <Input
              id="email"
              name="email"
              label="Email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
            />
            
            <Input
              id="telefone"
              name="telefone"
              label="Telefone"
              value={formData.telefone || ''}
              onChange={handleChange}
              required
            />
            
            <Input
              id="fotoPerfil"
              name="fotoPerfil"
              label="URL da Foto de Perfil"
              value={formData.fotoPerfil || ''}
              onChange={handleChange}
            />
            
            <div className="md:col-span-2">
              <Input
                id="especialidades"
                name="especialidades"
                label="Especialidades (separadas por vírgula)"
                value={formData.especialidades || ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Horário de Trabalho</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="horario-inicio"
                name="horarioTrabalho.inicio"
                label="Horário de Início"
                type="time"
                value={formData.horarioTrabalho?.inicio || '09:00'}
                onChange={handleChange}
                required
              />
              
              <Input
                id="horario-fim"
                name="horarioTrabalho.fim"
                label="Horário de Término"
                type="time"
                value={formData.horarioTrabalho?.fim || '18:00'}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dias de Trabalho
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
                      (formData.horarioTrabalho?.diasDisponiveis || []).includes(dia.value)
                        ? 'bg-barber text-white border-barber'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleDiasChange(dia.value)}
                  >
                    {dia.label}
                  </button>
                ))}
              </div>
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
                  checked={formData.ativo !== undefined ? formData.ativo : true}
                  onChange={(e) => setFormData(prev => ({ ...prev, ativo: e.target.checked }))}
                  className="h-4 w-4 text-barber border-gray-300 rounded focus:ring-barber"
                />
                <label htmlFor="ativo" className="ml-2 block text-sm text-gray-900">
                  Barbeiro Ativo
                </label>
              </div>
            </div>
          )}
          
          <div className="mt-8 flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/admin/barbers')}
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

export default BarberForm;
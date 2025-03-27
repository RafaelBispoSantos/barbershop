import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    fotoPerfil: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { redirect: '/profile' } });
      return;
    }
    
    if (currentUser) {
      setFormData({
        nome: currentUser.nome || '',
        email: currentUser.email || '',
        telefone: currentUser.telefone || '',
        fotoPerfil: currentUser.fotoPerfil || ''
      });
    }
  }, [currentUser, isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Simulando uma chamada de API com um timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Implementar atualização de perfil quando tivermos essa funcionalidade na API
      // Exemplo de como seria:
      // await userService.updateProfile(formData);
      
      setSuccess('Perfil atualizado com sucesso!');
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao atualizar o perfil');
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      logout();
      setLoading(false);
      navigate('/');
    }, 500); // Pequeno delay para mostrar o estado de loading
  };
  
  const handlePhotoChange = () => {
    setLoading(true);
    // Simulando o upload de uma imagem
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        fotoPerfil: "https://randomuser.me/api/portraits/women/44.jpg" // Exemplo de URL de imagem
      }));
      setSuccess('Foto atualizada com sucesso!');
      setLoading(false);
    }, 1500);
  };
  
  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Carregando...</p>
      </div>
    );
  }
  
  const isAdmin = () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return false;
    
    try {
      const userData = JSON.parse(userStr);
      return userData.isAdmin === true;
    } catch (e) {
      return false;
    }
  };
  
  return (
    <div>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>
          
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
          
          {loading && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="animate-spin h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Processando sua solicitação...
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {isAdmin() && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    Você tem acesso ao painel administrativo.
                  </p>
                  <p className="mt-3 text-sm md:mt-0 md:ml-6">
                    <Link to="/admin" className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600">
                      Acessar painel <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <div className="flex items-center">
                    <div className="w-20 h-20 bg-gray-300 rounded-full overflow-hidden">
                      {formData.fotoPerfil ? (
                        <img
                          src={formData.fotoPerfil}
                          alt={formData.nome}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200">
                          <svg
                            className="h-12 w-12 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 14c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={handlePhotoChange}
                        disabled={loading}
                      >
                        {loading ? 'Carregando...' : 'Alterar Foto'}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Input
                  id="nome"
                  name="nome"
                  label="Nome Completo"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                
                <Input
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                
                <Input
                  id="telefone"
                  name="telefone"
                  label="Telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                
                <div className="flex justify-between mt-8">
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                  <Button type="button" variant="danger" onClick={handleLogout} disabled={loading}>
                    {loading ? 'Saindo...' : 'Sair'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
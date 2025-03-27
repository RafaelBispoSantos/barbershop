// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false); // Adicionando estado de sucesso
  
  useEffect(() => {
    // Se o usuário já estiver autenticado, redirecionar
    if (isAuthenticated()) {
      navigate('/profile');
    }
    
    // Verificar se há mensagem de redirecionamento
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [isAuthenticated, navigate, location.state]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Certifique-se que o código do handleSubmit esteja assim:
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Chamar a função login do contexto
      await login(formData.email, formData.password);
      
      // Definir o estado de sucesso como true aqui
      setSuccess(true);
      
      // Adicione logs para depuração
      console.log("Login bem-sucedido, redirecionando...");
      
      // Redirecionar para a página solicitada ou para o perfil
      // Use setTimeout para garantir que o estado de autenticação seja atualizado
      setTimeout(() => {
        if (location.state?.redirect) {
          navigate(location.state.redirect);
        } else {
          navigate('/');  // Redirecionar para home em vez de profile
        }
      }, 100);
      
    } catch (err) {
      setError(authError || 'Erro ao fazer login. Verifique suas credenciais.');
      console.error("Erro no login:", err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Login</h1>
          
          {error && (
            <Alert
              type="error"
              message={error}
              className="mb-6"
              onClose={() => setError(null)}
            />
          )}
          
          {message && (
            <Alert
              type="info"
              message={message}
              className="mb-6"
              onClose={() => setMessage(null)}
            />
          )}
          
          {success && (
            <div className="mt-4 mb-6 text-center bg-green-50 p-4 rounded-md border border-green-200">
              <p className="text-green-600 font-medium">Login bem-sucedido!</p>
              <button 
                className="mt-2 text-barber hover:underline font-medium"
                onClick={() => navigate('/')}
              >
                Clique aqui para ir para a página inicial
              </button>
            </div>
          )}
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <Input
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                
                <Input
                  id="password"
                  name="password"
                  label="Senha"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                
                <Button
                  type="submit"
                  disabled={loading}
                  fullWidth
                  className="mt-4"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Não tem uma conta?{' '}
                  <Link
                    to="/register"
                    className="text-barber hover:underline"
                    state={location.state}
                  >
                    Registre-se
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
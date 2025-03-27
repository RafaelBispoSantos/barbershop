import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated, error: authError } = useAuth();
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Se o usuário já estiver autenticado, redirecionar
    if (isAuthenticated()) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar senhas
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const userData = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        password: formData.password
      };
      
      await register(userData);
      
      // Redirecionar para o login com mensagem de sucesso
      navigate('/login', {
        state: {
          message: 'Conta criada com sucesso! Faça login para continuar.',
          redirect: location.state?.redirect
        }
      });
    } catch (err) {
      setError(authError || 'Erro ao criar conta. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Criar Conta</h1>
          
          {error && (
            <Alert
              type="error"
              message={error}
              className="mb-6"
              onClose={() => setError(null)}
            />
          )}
          
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <Input
                  id="nome"
                  name="nome"
                  label="Nome Completo"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
                
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
                  id="telefone"
                  name="telefone"
                  label="Telefone"
                  value={formData.telefone}
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
                
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirmar Senha"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                
                <Button
                  type="submit"
                  disabled={loading}
                  fullWidth
                  className="mt-4"
                >
                  {loading ? 'Registrando...' : 'Registrar'}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  Já tem uma conta?{' '}
                  <Link
                    to="/login"
                    className="text-barber hover:underline"
                    state={location.state}
                  >
                    Faça login
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

export default Register;

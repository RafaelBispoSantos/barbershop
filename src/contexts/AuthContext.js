import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar se o usuário está autenticado diretamente no localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        console.log("Usuário carregado do localStorage:", userData);
        setCurrentUser(userData);
      } catch (err) {
        console.error("Erro ao carregar usuário do localStorage:", err);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Iniciando login com:", email);
      const data = await authService.login(email, password);
      console.log("Login response:", data);
      
      // Armazene o token diretamente aqui também (redundância para garantir)
      if (data && data.token) {
        console.log("Salvando token:", data.token.substring(0, 10) + "...");
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        return data;
      } else {
        console.error("Resposta sem token:", data);
        throw new Error('Token não encontrado na resposta');
      }
    } catch (err) {
      console.error("Erro no AuthContext.login:", err);
      setError(err.response?.data?.message || 'Ocorreu um erro ao fazer login');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      // Fazer o registro
      const data = await authService.register(userData);
      
      // Se o registro for bem-sucedido, armazenar token e usuário
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentUser(data.user);
        
        console.log("Registro bem-sucedido:", data);
        console.log("Token armazenado:", data.token);
        console.log("Usuário armazenado:", data.user);
      }
      
      return data;
    } catch (err) {
      console.error("Erro no registro:", err);
      setError(err.response?.data?.message || 'Ocorreu um erro ao criar conta');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    console.log("Verificando autenticação, token:", token);
    return !!token;
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
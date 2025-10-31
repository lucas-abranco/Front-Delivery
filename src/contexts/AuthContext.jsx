import React, { createContext, useContext, useState, useEffect } from 'react';

// Define a URL base da nossa API de back-end
const API_URL = 'http://localhost:3000';

// Cria o Contexto
const AuthContext = createContext();

// Cria um "Hook" personalizado para facilitar o uso deste contexto noutros componentes
export function useAuth() {
  return useContext(AuthContext);
}

// Cria o "Provedor" que irá conter toda a lógica e partilhar os dados
export function AuthProvider({ children }) {
  // Tenta ler os dados guardados no navegador ao iniciar
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null); // Para guardar os dados do perfil
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userType, setUserType] = useState(localStorage.getItem('userType'));

  // Este efeito corre sempre que o estado 'token' muda
  useEffect(() => {
    if (token) {
      // Se temos um token, guarda-o no localStorage e vai buscar o perfil
      localStorage.setItem('token', token);
      setIsLoggedIn(true);
      fetchUserProfile(token);
    } else {
      // Se não há token (ex: no logout), limpa tudo
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      setUser(null);
      setIsLoggedIn(false);
      setUserType(null);
    }
  }, [token]);

  // Função para buscar o perfil do utilizador usando o token
  const fetchUserProfile = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });
      if (!response.ok) throw new Error('Falha ao buscar perfil. O token pode ter expirado.');
      
      const profileData = await response.json();
      setUser(profileData);
      
      // Lógica para diferenciar o tipo de utilizador (baseado na presença de 'vehicleType')
      const type = profileData.vehicleType ? 'driver' : 'client';
      setUserType(type);
      localStorage.setItem('userType', type);

    } catch (error) {
      console.error(error.message);
      // Se o token for inválido ou expirado, desloga o utilizador
      logout();
    }
  };

  // --- FUNÇÕES DE CLIENTE ---
  const login = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/client/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Credenciais de cliente inválidas.');
    }
    const data = await response.json();
    setToken(data.access_token);
  };
  
  const register = async (userData) => {
    const response = await fetch(`${API_URL}/auth/client/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha no registo.');
    }
    return response.json();
  };

  // --- FUNÇÕES DE ENTREGADOR (NOVAS) ---
  const loginDriver = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/driver/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Credenciais de entregador inválidas.');
    }
    const data = await response.json();
    setToken(data.access_token);
  };
  
  const registerDriver = async (driverData) => {
    const response = await fetch(`${API_URL}/auth/driver/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driverData)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha no registo.');
    }
    return response.json();
  };

  // --- FUNÇÃO DE LOGOUT (GERAL) ---
  const logout = () => {
    setToken(null);
  };

  // Agrupa todos os valores que queremos partilhar
  const value = {
    token,
    user,
    isLoggedIn,
    userType,
    login,
    logout,
    register,
    loginDriver,    // Exporta a nova função
    registerDriver, // Exporta a nova função
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


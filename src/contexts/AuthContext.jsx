import { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storagedToken = localStorage.getItem('@SIAS:token');
    const storagedUser = localStorage.getItem('@SIAS:user');

    if (storagedToken && storagedUser) {
      setUser(JSON.parse(storagedUser));
      api.defaults.headers.Authorization = `Bearer ${storagedToken}`;
    }
    setLoading(false);
  }, []);

  async function signIn({ login, senha }) {
    try {
      const response = await api.post('/auth/login', { login, senha });
      
      const token = response.data; 
      
      const usuarioLogado = { login, role: 'USER' }; 

      setUser(usuarioLogado);

      localStorage.setItem('@SIAS:token', token);
      localStorage.setItem('@SIAS:user', JSON.stringify(usuarioLogado));

      api.defaults.headers.Authorization = `Bearer ${token}`;
      
      return { success: true };
    } catch (error) {
      console.error("Erro na autenticação:", error);
      return { 
        success: false, 
        message: error.response?.data || "Usuário ou senha incorretos." 
      };
    }
  }

  function signOut() {
    localStorage.removeItem('@SIAS:token');
    localStorage.removeItem('@SIAS:user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
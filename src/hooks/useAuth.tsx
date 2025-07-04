
import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    try {
      // Recuperar usuário do localStorage na inicialização
      const savedUser = localStorage.getItem('demoUser');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setAuthState({ user, isLoading: false });
      } else {
        setAuthState({ user: null, isLoading: false });
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      localStorage.removeItem('demoUser');
      setAuthState({ user: null, isLoading: false });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const savedUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
      const user = savedUsers.find((u: any) => u.email === email && u.password === password);
      
      if (user) {
        const userToSave = { ...user };
        delete userToSave.password; // Não salvar senha no estado
        
        localStorage.setItem('demoUser', JSON.stringify(userToSave));
        setAuthState({ user: userToSave, isLoading: false });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const savedUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
      
      // Verificar se email já existe
      if (savedUsers.some((u: any) => u.email === email)) {
        return false;
      }
      
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        createdAt: new Date().toISOString(),
      };
      
      // Salvar usuário na lista
      savedUsers.push(newUser);
      localStorage.setItem('demoUsers', JSON.stringify(savedUsers));
      
      // Login automático após registro
      const userToSave = { ...newUser };
      delete userToSave.password;
      
      localStorage.setItem('demoUser', JSON.stringify(userToSave));
      setAuthState({ user: userToSave, isLoading: false });
      
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('demoUser');
    setAuthState({ user: null, isLoading: false });
  };

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: !!authState.user,
    login,
    register,
    logout,
  };
};


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
    const initializeAuth = () => {
      console.log('Inicializando autenticação...');
      
      // Usuários demo pré-definidos
      const demoUsers = [
        {
          id: '1',
          name: 'Usuário Demo',
          email: 'demo@teste.com',
          password: '123456',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Admin Demo',
          email: 'admin@teste.com',
          password: 'admin123',
          createdAt: new Date().toISOString()
        }
      ];

      // Garantir que os usuários demo estejam sempre disponíveis
      const existingUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
      if (existingUsers.length === 0) {
        localStorage.setItem('demoUsers', JSON.stringify(demoUsers));
      }

      // Verificar se há usuário salvo
      const savedUser = localStorage.getItem('demoUser');
      console.log('Usuário salvo encontrado:', !!savedUser);
      
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          console.log('Usuário carregado:', user.email);
          setAuthState({ user, isLoading: false });
        } catch (error) {
          console.log('Erro ao carregar usuário, fazendo logout');
          localStorage.removeItem('demoUser');
          setAuthState({ user: null, isLoading: false });
        }
      } else {
        console.log('Nenhum usuário salvo, mostrando login');
        setAuthState({ user: null, isLoading: false });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('Tentativa de login para:', email);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const savedUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
    const user = savedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const userToSave = { ...user };
      delete userToSave.password;
      
      localStorage.setItem('demoUser', JSON.stringify(userToSave));
      setAuthState({ user: userToSave, isLoading: false });
      console.log('Login realizado com sucesso');
      return true;
    }
    
    console.log('Credenciais inválidas');
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    console.log('Tentativa de registro para:', email);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const savedUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
    
    // Verificar se email já existe
    if (savedUsers.some((u: any) => u.email === email)) {
      console.log('Email já existe');
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
    console.log('Registro realizado com sucesso');
    
    return true;
  };

  const logout = () => {
    console.log('Fazendo logout...');
    localStorage.removeItem('demoUser');
    setAuthState({ user: null, isLoading: false });
  };

  // Função para forçar logout (útil para debugging)
  const forceLogout = () => {
    console.log('Forçando logout...');
    localStorage.clear();
    setAuthState({ user: null, isLoading: false });
  };

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: !!authState.user,
    login,
    register,
    logout,
    forceLogout,
  };
};

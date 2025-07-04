
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
      console.log('🔄 Inicializando sistema de autenticação...');
      
      // Verificar se existe usuário logado
      const savedUser = localStorage.getItem('appUser');
      
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          console.log('👤 Usuário encontrado:', user.email);
          setAuthState({ user, isLoading: false });
        } catch (error) {
          console.log('❌ Erro ao carregar usuário, limpando dados');
          localStorage.removeItem('appUser');
          setAuthState({ user: null, isLoading: false });
        }
      } else {
        console.log('🔓 Nenhum usuário logado - mostrando tela de login');
        setAuthState({ user: null, isLoading: false });
      }
    };

    // Simular carregamento para melhor UX
    setTimeout(initializeAuth, 800);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 Tentativa de login:', email);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const savedUsers = JSON.parse(localStorage.getItem('appUsers') || '[]');
    const user = savedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const userToSave = { ...user };
      delete userToSave.password;
      
      localStorage.setItem('appUser', JSON.stringify(userToSave));
      setAuthState({ user: userToSave, isLoading: false });
      console.log('✅ Login realizado com sucesso para:', email);
      return true;
    }
    
    console.log('❌ Credenciais inválidas para:', email);
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    console.log('📝 Tentativa de cadastro:', email);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const savedUsers = JSON.parse(localStorage.getItem('appUsers') || '[]');
    
    // Verificar se email já existe
    if (savedUsers.some((u: any) => u.email === email)) {
      console.log('❌ Email já existe:', email);
      return false;
    }
    
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      createdAt: new Date().toISOString(),
    };
    
    // Salvar novo usuário
    savedUsers.push(newUser);
    localStorage.setItem('appUsers', JSON.stringify(savedUsers));
    
    // Login automático após cadastro
    const userToSave = { ...newUser };
    delete userToSave.password;
    
    localStorage.setItem('appUser', JSON.stringify(userToSave));
    setAuthState({ user: userToSave, isLoading: false });
    console.log('✅ Cadastro realizado com sucesso:', email);
    
    return true;
  };

  const logout = () => {
    console.log('🚪 Fazendo logout - limpando dados do usuário...');
    
    // Limpar apenas dados do usuário logado (mantém usuários cadastrados)
    localStorage.removeItem('appUser');
    
    // Forçar limpeza do estado
    setAuthState({ user: null, isLoading: false });
    
    // Recarregar página para garantir limpeza completa
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const forceLogout = () => {
    console.log('🧹 Limpando todos os dados...');
    localStorage.clear();
    setAuthState({ user: null, isLoading: false });
    window.location.reload();
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


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
      
      // Criar usuários demo se não existirem
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

      // Garantir que usuários demo existam
      const existingUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
      if (existingUsers.length === 0) {
        localStorage.setItem('demoUsers', JSON.stringify(demoUsers));
        console.log('✅ Usuários demo criados');
      }

      // Verificar se existe usuário logado
      const savedUser = localStorage.getItem('demoUser');
      
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          console.log('👤 Usuário encontrado:', user.email);
          setAuthState({ user, isLoading: false });
        } catch (error) {
          console.log('❌ Erro ao carregar usuário, limpando dados');
          localStorage.removeItem('demoUser');
          setAuthState({ user: null, isLoading: false });
        }
      } else {
        console.log('🔓 Nenhum usuário logado - mostrando tela de login');
        setAuthState({ user: null, isLoading: false });
      }
    };

    // Simular carregamento para mostrar melhor UX
    setTimeout(initializeAuth, 800);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 Tentativa de login:', email);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const savedUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
    const user = savedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (user) {
      const userToSave = { ...user };
      delete userToSave.password;
      
      localStorage.setItem('demoUser', JSON.stringify(userToSave));
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
    
    const savedUsers = JSON.parse(localStorage.getItem('demoUsers') || '[]');
    
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
    localStorage.setItem('demoUsers', JSON.stringify(savedUsers));
    
    // Login automático após cadastro
    const userToSave = { ...newUser };
    delete userToSave.password;
    
    localStorage.setItem('demoUser', JSON.stringify(userToSave));
    setAuthState({ user: userToSave, isLoading: false });
    console.log('✅ Cadastro realizado com sucesso:', email);
    
    return true;
  };

  const logout = () => {
    console.log('🚪 Fazendo logout - limpando todos os dados...');
    
    // Limpar dados do usuário
    localStorage.removeItem('demoUser');
    
    // Forçar limpeza do estado imediatamente
    setAuthState({ user: null, isLoading: false });
    
    // Garantir que a página seja recarregada para limpar qualquer estado residual
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

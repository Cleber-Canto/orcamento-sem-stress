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
    console.log('📋 Usuários salvos:', savedUsers.map((u: any) => ({ email: u.email, hasPassword: !!u.password })));
    
    // Normalizar email de entrada e buscar usuário
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPassword = password.trim();
    
    const user = savedUsers.find((u: any) => 
      u.email.toLowerCase().trim() === normalizedEmail && 
      u.password.trim() === normalizedPassword
    );
    
    console.log('🔍 Procurando usuário com:', { email: normalizedEmail, password: normalizedPassword });
    console.log('🔍 Usuários disponíveis:', savedUsers.map((u: any) => ({ 
      email: u.email, 
      password: u.password,
      match: u.email.toLowerCase().trim() === normalizedEmail && u.password.trim() === normalizedPassword
    })));
    
    if (user) {
      const userToSave = { ...user };
      delete userToSave.password;
      
      localStorage.setItem('appUser', JSON.stringify(userToSave));
      setAuthState({ user: userToSave, isLoading: false });
      console.log('✅ Login realizado com sucesso para:', email);
      return true;
    }
    
    console.log('❌ Credenciais inválidas para:', email);
    console.log('🔍 Detalhes do erro - Email buscado:', normalizedEmail);
    console.log('🔍 Emails disponíveis:', savedUsers.map((u: any) => u.email.toLowerCase().trim()));
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    console.log('📝 Tentativa de cadastro:', email);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const savedUsers = JSON.parse(localStorage.getItem('appUsers') || '[]');
    console.log('🔍 Usuários existentes antes do cadastro:', savedUsers.map((u: any) => ({ email: u.email, id: u.id })));
    
    // Normalizar dados de entrada
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();
    const normalizedPassword = password.trim();
    
    // Verificar se email já existe (comparação rigorosa)
    const emailExists = savedUsers.some((u: any) => 
      u.email.toLowerCase().trim() === normalizedEmail
    );
    
    console.log('🔍 Verificando duplicação para email:', normalizedEmail);
    console.log('🔍 Emails já cadastrados:', savedUsers.map((u: any) => u.email.toLowerCase().trim()));
    console.log('🔍 Email já existe?', emailExists);
    
    if (emailExists) {
      console.log('❌ Email já existe:', normalizedEmail);
      return { 
        success: false, 
        message: 'Este email já possui uma conta. Faça login ou use outro email.' 
      };
    }
    
    const newUser = {
      id: Date.now().toString(),
      name: normalizedName,
      email: normalizedEmail,
      password: normalizedPassword,
      createdAt: new Date().toISOString(),
    };
    
    // Salvar novo usuário
    savedUsers.push(newUser);
    localStorage.setItem('appUsers', JSON.stringify(savedUsers));
    
    console.log('✅ Cadastro realizado com sucesso:', normalizedEmail);
    console.log('💾 Usuário salvo:', { 
      email: newUser.email, 
      name: newUser.name, 
      id: newUser.id, 
      password: newUser.password 
    });
    console.log('📋 Total de usuários após cadastro:', savedUsers.length);
    
    return { 
      success: true, 
      message: `Conta criada com sucesso! Agora você pode fazer login com ${normalizedEmail}` 
    };
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    console.log('🔄 Tentativa de recuperação de senha:', email);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const savedUsers = JSON.parse(localStorage.getItem('appUsers') || '[]');
    const user = savedUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      return { 
        success: false, 
        message: 'Email não encontrado no sistema.' 
      };
    }
    
    // Em um sistema real, aqui enviaria email
    console.log('📧 Email de recuperação enviado para:', email);
    
    return { 
      success: true, 
      message: `Instruções de recuperação foram enviadas para ${email}. Verifique sua caixa de entrada.` 
    };
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
    resetPassword,
    logout,
    forceLogout,
  };
};

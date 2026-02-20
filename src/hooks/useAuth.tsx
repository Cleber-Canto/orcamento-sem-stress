import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
          email: session.user.email || '',
          createdAt: session.user.created_at,
        };
        setAuthState({ user, isLoading: false });
      } else {
        setAuthState({ user: null, isLoading: false });
      }
    });

    // THEN check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const user: User = {
          id: session.user.id,
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
          email: session.user.email || '',
          createdAt: session.user.created_at,
        };
        setAuthState({ user, isLoading: false });
      } else {
        setAuthState({ user: null, isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });
    return !error;
  };

  const register = async (name: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        data: { name: name.trim() },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Conta criada com sucesso! Verifique seu email para confirmar.' };
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: `Instruções de recuperação enviadas para ${email}.` };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthState({ user: null, isLoading: false });
  };

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: !!authState.user,
    login,
    register,
    resetPassword,
    logout,
    forceLogout: logout,
  };
};

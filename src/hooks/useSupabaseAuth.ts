import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useSupabaseAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false
  });

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session: session,
          isLoading: false,
          isAuthenticated: !!session
        });
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ?? null,
        session: session,
        isLoading: false,
        isAuthenticated: !!session
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name: name
          }
        }
      });

      if (error) {
        toast.error(error.message);
        return { success: false, message: error.message };
      }

      toast.success('Cadastro realizado! Verifique seu email para confirmar a conta.');
      return { success: true, message: 'Cadastro realizado com sucesso!' };
    } catch (error: any) {
      toast.error('Erro ao cadastrar');
      return { success: false, message: error.message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast.error(error.message);
        return false;
      }

      toast.success('Login realizado com sucesso!');
      return true;
    } catch (error: any) {
      toast.error('Erro ao fazer login');
      return false;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`
      });

      if (error) {
        toast.error(error.message);
        return { success: false, message: error.message };
      }

      // Chamar edge function para enviar email personalizado
      try {
        await supabase.functions.invoke('send-recovery-email', {
          body: { 
            email: email,
            resetUrl: `${window.location.origin}/reset-password`
          }
        });
      } catch (emailError) {
        console.log('Edge function error (não crítico):', emailError);
      }

      toast.success('Email de recuperação enviado!');
      return { success: true, message: 'Email de recuperação enviado!' };
    } catch (error: any) {
      toast.error('Erro ao enviar email de recuperação');
      return { success: false, message: error.message };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Logout realizado com sucesso!');
      }
    } catch (error: any) {
      toast.error('Erro ao fazer logout');
    }
  };

  return {
    ...authState,
    signUp,
    signIn,
    resetPassword,
    signOut
  };
};
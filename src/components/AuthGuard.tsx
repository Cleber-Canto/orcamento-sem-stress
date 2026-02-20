
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, LogIn, UserPlus, KeyRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import ForgotPasswordForm from './auth/ForgotPasswordForm';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, login, register, resetPassword } = useAuth();
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'forgot'>('login');

  console.log('🛡️ AuthGuard - Estado:', { 
    isLoading, 
    hasUser: !!user, 
    userEmail: user?.email 
  });

  // Tela de carregamento melhorada
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <Shield className="h-16 w-16 text-blue-600 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">FinanceApp</h2>
          <p className="text-gray-600">Carregando sistema...</p>
        </div>
      </div>
    );
  }

  // Se usuário está logado, mostra o app
  if (user) {
    console.log('✅ Usuário autenticado, mostrando dashboard para:', user.email);
    return <>{children}</>;
  }

  // Se não há usuário, mostra tela de login/cadastro/recuperação
  console.log('🔓 Nenhum usuário logado - exibindo telas de autenticação');

  const getCardTitle = () => {
    switch (currentView) {
      case 'register':
        return (
          <>
            <UserPlus className="h-5 w-5 text-green-600" />
            Criar Nova Conta
          </>
        );
      case 'forgot':
        return (
          <>
            <KeyRound className="h-5 w-5 text-orange-600" />
            Recuperar Senha
          </>
        );
      default:
        return (
          <>
            <LogIn className="h-5 w-5 text-blue-600" />
            Fazer Login
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header do Sistema */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">FinanceApp</h1>
          </div>
          <p className="text-gray-600">
            Sistema completo de controle financeiro pessoal
          </p>
        </div>

        {/* Card de Autenticação */}
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              {getCardTitle()}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Formulários baseados na view atual */}
            {currentView === 'register' && (
              <RegisterForm 
                onRegister={register}
                onSwitchToLogin={() => setCurrentView('login')} 
              />
            )}
            
            {currentView === 'forgot' && (
              <ForgotPasswordForm 
                onResetPassword={resetPassword}
                onBackToLogin={() => setCurrentView('login')} 
              />
            )}
            
            {currentView === 'login' && (
              <>
                <LoginForm 
                  onLogin={login}
                  onSwitchToRegister={() => setCurrentView('register')}
                  onForgotPassword={() => setCurrentView('forgot')} 
                />
                
                {/* Informações das contas de teste */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">
                    🔑 Contas de teste disponíveis:
                  </h3>
                  <div className="space-y-1 text-xs text-blue-700">
                    <div className="flex justify-between">
                      <span>cantosaraiva97@gmail.com</span>
                      <span className="font-mono">12345CLE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>cantosaraiva@hotmail.com</span>
                      <span className="font-mono">1234cl</span>
                    </div>
                    <div className="flex justify-between">
                      <span>lana_luka@hotmail.com</span>
                      <span className="font-mono">12345LC</span>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    💡 Ou cadastre uma nova conta!
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Rodapé Informativo */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Seus dados ficam salvos com segurança no Supabase</p>
          <p>FinanceApp - Controle Financeiro</p>
        </div>
      </div>
    </div>
  );
};

export default AuthGuard;

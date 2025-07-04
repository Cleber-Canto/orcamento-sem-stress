
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, login, register } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  console.log('🛡️ AuthGuard - Estado:', { 
    isLoading, 
    hasUser: !!user, 
    userEmail: user?.email 
  });

  // Tela de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          </div>
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

  // Se não há usuário, SEMPRE mostra tela de login/cadastro
  console.log('🔓 Nenhum usuário logado - exibindo telas de autenticação');

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
              {showRegister ? (
                <>
                  <UserPlus className="h-5 w-5 text-green-600" />
                  Criar Nova Conta
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 text-blue-600" />
                  Fazer Login
                </>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Formulários de Login/Cadastro */}
            {showRegister ? (
              <RegisterForm 
                onRegister={register}
                onSwitchToLogin={() => setShowRegister(false)} 
              />
            ) : (
              <LoginForm 
                onLogin={login}
                onSwitchToRegister={() => setShowRegister(true)} 
              />
            )}

            {/* Usuários Demo */}
            <div className="text-center pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
                <Users className="h-4 w-4" />
                Contas Demo Disponíveis:
              </div>
              <div className="space-y-1 text-xs text-gray-400">
                <p>📧 <strong>demo@teste.com</strong> • 🔑 <strong>123456</strong></p>
                <p>📧 <strong>admin@teste.com</strong> • 🔑 <strong>admin123</strong></p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rodapé Informativo */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Seus dados ficam salvos localmente no navegador</p>
          <p>Sistema de demonstração - FinanceApp</p>
        </div>
      </div>
    </div>
  );
};

export default AuthGuard;


import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Users, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, login, register } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  console.log('AuthGuard - Estado atual:', { isLoading, user: !!user });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se há usuário logado, mostra o app
  if (user) {
    console.log('Usuário autenticado, mostrando dashboard');
    return <>{children}</>;
  }

  // Se não há usuário, mostra as telas de login/cadastro
  console.log('Nenhum usuário logado, mostrando tela de autenticação');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">FinanceApp</h1>
          </div>
          <p className="text-gray-600">
            Sistema completo de controle financeiro pessoal
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-xl">
              {showRegister ? (
                <>
                  <UserPlus className="h-5 w-5 text-green-600" />
                  Criar Conta
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5 text-blue-600" />
                  Entrar
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <div className="text-center pt-4 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-2">
                <Users className="h-4 w-4" />
                Usuários Demo Disponíveis:
              </div>
              <div className="space-y-1 text-xs text-gray-400">
                <p>📧 <strong>demo@teste.com</strong> • 🔑 <strong>123456</strong></p>
                <p>📧 <strong>admin@teste.com</strong> • 🔑 <strong>admin123</strong></p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>🔒 Seus dados ficam salvos localmente no navegador</p>
          <p>Este é um sistema de demonstração</p>
        </div>
      </div>
    </div>
  );
};

export default AuthGuard;

import React, { useState } from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  const [isRegistering, setIsRegistering] = useState(false);
  const { user, isLoading, isAuthenticated, login, register, logout } = useAuth();

  // Se a chave do Clerk não estiver configurada, usa sistema demo
  if (!publishableKey) {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      );
    }

    // Se usuário demo está logado, mostra o sistema
    if (isAuthenticated && user) {
      return (
        <div className="relative">
          <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
            <div className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium">
              Olá, {user.name}
            </div>
            <Button 
              onClick={logout}
              variant="outline"
              size="sm"
            >
              Sair
            </Button>
          </div>
          {children}
        </div>
      );
    }

    // Mostra tela de cadastro/login demo
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="container mx-auto p-4 max-w-md">
          <Card className="shadow-2xl border-0 animate-fade-in">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  Controle Financeiro Inteligente
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  {isRegistering 
                    ? 'Crie sua conta para começar (DEMO)' 
                    : 'Faça login para acessar (DEMO)'
                  }
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <p className="text-xs text-gray-600">Controle de Gastos</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <p className="text-xs text-gray-600">Análises Inteligentes</p>
                </div>
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <p className="text-xs text-gray-600">100% Seguro</p>
                </div>
              </div>
              
              {isRegistering ? (
                <RegisterForm 
                  onRegister={register}
                  onSwitchToLogin={() => setIsRegistering(false)}
                />
              ) : (
                <LoginForm 
                  onLogin={login}
                  onSwitchToRegister={() => setIsRegistering(true)}
                />
              )}
              
              <div className="text-center space-y-2">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 justify-center">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <p className="text-xs text-yellow-800">
                      MODO DEMONSTRAÇÃO - Configure o Clerk para autenticação real
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                  <span>✓ Dados Seguros</span>
                  <span>✓ Gratuito</span>
                  <span>✓ Sem Anúncios</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
          <div className="container mx-auto p-4 max-w-md">
            <Card className="shadow-2xl border-0">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800">
                    Controle Financeiro Inteligente
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    {isRegistering 
                      ? 'Crie sua conta para começar a organizar suas finanças' 
                      : 'Faça login para acessar suas finanças de forma segura'
                    }
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600">Controle de Gastos</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-600">Análises Inteligentes</p>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                      <Shield className="h-6 w-6 text-purple-600" />
                    </div>
                    <p className="text-xs text-gray-600">100% Seguro</p>
                  </div>
                </div>
                
                {isRegistering ? (
                  <div className="space-y-4">
                    <SignUpButton mode="modal" fallbackRedirectUrl="/">
                      <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium py-3">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Criar Conta Gratuita
                      </Button>
                    </SignUpButton>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Já tem uma conta?{' '}
                        <button 
                          onClick={() => setIsRegistering(false)}
                          className="text-blue-600 hover:text-blue-700 font-medium underline"
                        >
                          Fazer Login
                        </button>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <SignInButton mode="modal" fallbackRedirectUrl="/">
                      <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium py-3">
                        <LogIn className="h-4 w-4 mr-2" />
                        Entrar com Segurança
                      </Button>
                    </SignInButton>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-600">
                        Não tem uma conta?{' '}
                        <button 
                          onClick={() => setIsRegistering(true)}
                          className="text-blue-600 hover:text-blue-700 font-medium underline"
                        >
                          Criar Conta Gratuita
                        </button>
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="text-center space-y-2">
                  <p className="text-xs text-gray-500">
                    Seus dados são protegidos com criptografia de ponta
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                    <span>✓ Dados Seguros</span>
                    <span>✓ Gratuito</span>
                    <span>✓ Sem Anúncios</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SignedOut>
      
      <SignedIn>
        <div className="absolute top-4 right-4 z-50">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}
          />
        </div>
        {children}
      </SignedIn>
    </>
  );
};

export default AuthGuard;

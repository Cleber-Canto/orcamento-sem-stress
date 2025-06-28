
import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  // Se a chave do Clerk não estiver configurada, mostra a aplicação com um aviso
  if (!publishableKey) {
    return (
      <div className="relative">
        <div className="absolute top-4 right-4 z-50">
          <Card className="bg-yellow-50 border-yellow-200 shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <p className="text-xs text-yellow-800">
                  Login não configurado - <a href="https://go.clerk.com/lovable" target="_blank" className="underline">Configure aqui</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        {children}
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
                    Faça login para acessar suas finanças de forma segura
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
                
                <SignInButton mode="modal" fallbackRedirectUrl="/">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium py-3">
                    Entrar com Segurança
                  </Button>
                </SignInButton>
                
                <p className="text-xs text-center text-gray-500">
                  Seus dados são protegidos com criptografia de ponta
                </p>
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

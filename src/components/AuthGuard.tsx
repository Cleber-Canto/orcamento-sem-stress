
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

  // Se a chave do Clerk não estiver configurada, mostra instruções
  if (!publishableKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="container mx-auto p-4 max-w-md">
          <Card className="shadow-2xl border-0 border-red-200">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-red-800">
                  Configuração Necessária
                </CardTitle>
                <p className="text-red-600 mt-2 text-sm">
                  Para usar o sistema de login seguro, você precisa configurar sua chave do Clerk
                </p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-100 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Como configurar:</h3>
                <ol className="text-sm text-red-700 space-y-1">
                  <li>1. Visite <a href="https://go.clerk.com/lovable" target="_blank" className="underline font-medium">https://go.clerk.com/lovable</a></li>
                  <li>2. Crie sua conta gratuita</li>
                  <li>3. Copie sua Publishable Key</li>
                  <li>4. Cole a chave como VITE_CLERK_PUBLISHABLE_KEY</li>
                </ol>
              </div>
              <p className="text-xs text-center text-red-500">
                Após configurar, recarregue a página
              </p>
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

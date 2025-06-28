
import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, TrendingUp, PieChart, Target } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  return (
    <>
      <SignedIn>
        <div className="flex justify-between items-center p-4 bg-white shadow-sm border-b">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Financeiro</h1>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
        {children}
      </SignedIn>
      
      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Controle Financeiro Seguro
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Acesse sua dashboard personalizada para gerenciar suas finanças de forma segura
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Gastos</p>
                </div>
                <div>
                  <PieChart className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Orçamento</p>
                </div>
                <div>
                  <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Metas</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">🔒 Seus dados protegidos</h4>
                  <p className="text-sm text-gray-600">
                    Todas as informações ficam criptografadas e seguras em sua conta pessoal
                  </p>
                </div>
                
                <SignInButton mode="modal">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Entrar com Segurança
                  </Button>
                </SignInButton>
                
                <p className="text-xs text-gray-500 text-center">
                  Ao entrar, você concorda com nossos termos de uso e política de privacidade
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </SignedOut>
    </>
  );
};

export default AuthGuard;

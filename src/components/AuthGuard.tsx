
import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, TrendingUp, PieChart, Target, Lock, BarChart3 } from 'lucide-react';

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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg shadow-2xl border-0">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Controle Financeiro Inteligente
              </CardTitle>
              <p className="text-gray-600 mt-3 text-lg">
                Acesse sua dashboard personalizada para gerenciar suas finanças com segurança e praticidade
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <TrendingUp className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-blue-800 mb-1">Controle de Gastos</h4>
                  <p className="text-sm text-blue-600">Monitore todos os seus gastos</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-100">
                  <PieChart className="h-10 w-10 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-green-800 mb-1">Gráfico Pizza</h4>
                  <p className="text-sm text-green-600">Visualize o orçamento</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-100">
                  <Target className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-purple-800 mb-1">Metas Financeiras</h4>
                  <p className="text-sm text-purple-600">Alcance seus objetivos</p>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-xl border border-orange-100">
                  <BarChart3 className="h-10 w-10 text-orange-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-orange-800 mb-1">Análises</h4>
                  <p className="text-sm text-orange-600">Insights inteligentes</p>
                </div>
              </div>
              
              {/* Security Section */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="h-6 w-6 text-blue-600" />
                  <h4 className="font-semibold text-gray-800 text-lg">Seus dados 100% protegidos</h4>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Todas as informações ficam criptografadas e seguras em sua conta pessoal. 
                  Seus dados financeiros nunca são compartilhados com terceiros.
                </p>
              </div>
              
              {/* Login Button */}
              <div className="space-y-4">
                <SignInButton mode="modal">
                  <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
                    <Lock className="h-5 w-5 mr-2" />
                    Entrar com Segurança
                  </Button>
                </SignInButton>
                
                <p className="text-xs text-gray-500 text-center leading-relaxed">
                  Ao entrar, você concorda com nossos termos de uso e política de privacidade. 
                  <br />
                  Seus dados financeiros ficam seguros conosco.
                </p>
              </div>

              {/* Benefits */}
              <div className="pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-700 mb-3 text-center">Por que escolher nosso sistema?</h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Interface intuitiva e fácil de usar</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Gráficos avançados para análise</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Controle total dos seus dados</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SignedOut>
    </>
  );
};

export default AuthGuard;

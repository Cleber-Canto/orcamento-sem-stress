
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, LogOut, Home } from 'lucide-react';

interface LogoutConfirmationProps {
  userName: string;
  onConfirmLogout: () => void;
  onCancel: () => void;
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({
  userName,
  onConfirmLogout,
  onCancel
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl text-gray-800">
            <LogOut className="h-6 w-6 text-red-600" />
            Sair do Sistema
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👋</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Até logo, {userName}!
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Tem certeza que deseja sair do sistema? Seus dados estão salvos com segurança.
            </p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={onConfirmLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sim, Quero Sair
            </Button>
            
            <Button
              onClick={onCancel}
              variant="outline"
              className="w-full border-2 border-blue-300 text-blue-600 hover:bg-blue-50 font-semibold py-3"
            >
              <Home className="h-4 w-4 mr-2" />
              Continuar no Sistema
            </Button>
          </div>

          <div className="text-center pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              💡 Seus dados financeiros ficam salvos localmente
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoutConfirmation;

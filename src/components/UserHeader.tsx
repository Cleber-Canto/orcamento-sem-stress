
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LogOut, User, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const UserHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    console.log('🚪 Usuário solicitou logout');
    setIsLoggingOut(true);
    
    // Mostrar mensagem de despedida
    toast({
      title: "👋 Até logo!",
      description: `Obrigado por usar nosso sistema, ${user?.name}! Seus dados foram salvos com segurança.`,
      duration: 3000,
    });

    // Aguardar um momento para mostrar a mensagem
    setTimeout(() => {
      logout();
      setIsLoggingOut(false);
    }, 1500);
  };

  return (
    <Card className="mb-6 bg-white/90 backdrop-blur-sm border-2 border-blue-100">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">{user?.name}</h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="lg"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 border-2 font-semibold"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saindo...
              </>
            ) : (
              <>
                <LogOut className="h-5 w-5" />
                Sair
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserHeader;

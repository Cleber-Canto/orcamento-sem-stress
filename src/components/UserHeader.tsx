
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const UserHeader: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    console.log('🚪 Usuário solicitou logout');
    logout();
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
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300 border-2 font-semibold"
          >
            <LogOut className="h-5 w-5" />
            Sair
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserHeader;

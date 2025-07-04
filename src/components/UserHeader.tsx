
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
    <Card className="mb-6 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">{user?.name}</h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserHeader;

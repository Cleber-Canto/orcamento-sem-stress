import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Info } from 'lucide-react';

interface SupabaseOnlyNoticeProps {
  featureName: string;
}

const SupabaseOnlyNotice: React.FC<SupabaseOnlyNoticeProps> = ({ featureName }) => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <Database className="h-16 w-16 text-blue-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          {featureName} - Versão Supabase
        </h3>
        <p className="text-gray-500 mb-4">
          Esta seção foi migrada para usar o Supabase e está sendo atualizada.
        </p>
        <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Info className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Status</span>
          </div>
          <p className="text-sm text-blue-700">
            A funcionalidade principal está funcionando. Recursos avançados serão implementados em breve.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupabaseOnlyNotice;

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

const EmptyPurchasesState: React.FC = () => {
  return (
    <Card>
      <CardContent className="text-center py-8">
        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhuma compra parcelada</h3>
        <p className="text-gray-500">
          Suas compras parceladas aparecerão aqui. <br/>
          Para adicionar uma compra parcelada, vá em "Adicionar Gasto" e marque a opção "Compra Parcelada".
        </p>
      </CardContent>
    </Card>
  );
};

export default EmptyPurchasesState;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';
import { Expense } from '@/types/installments';
import PurchaseCard from './PurchaseCard';
import EmptyPurchasesState from './EmptyPurchasesState';

interface PurchasesListProps {
  installmentPurchases: Expense[][];
  onDeletePurchase: (purchaseGroup: Expense[], description: string) => void;
  onUpdatePurchaseDate?: (purchaseGroup: Expense[], newDate: string) => void;
}

const PurchasesList: React.FC<PurchasesListProps> = ({ 
  installmentPurchases, 
  onDeletePurchase, 
  onUpdatePurchaseDate 
}) => {
  if (installmentPurchases.length === 0) {
    return <EmptyPurchasesState />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Suas Compras Parceladas
        </CardTitle>
        <p className="text-sm text-gray-600">
          ℹ️ As parcelas seguem a data de vencimento da fatura do cartão (dia 28), não a data da compra
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {installmentPurchases.map((purchaseGroup, index) => (
            <PurchaseCard
              key={index}
              purchaseGroup={purchaseGroup}
              index={index}
              onDeletePurchase={onDeletePurchase}
              onUpdatePurchaseDate={onUpdatePurchaseDate}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchasesList;

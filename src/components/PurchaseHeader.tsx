
import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Expense } from '@/types/installments';
import PurchaseEditDialog from './PurchaseEditDialog';

interface PurchaseHeaderProps {
  firstInstallment: Expense;
  originalAmount: number;
  totalInstallments: number;
  monthlyAmount: number;
  purchaseGroup: Expense[];
  onDeletePurchase: (purchaseGroup: Expense[], description: string) => void;
  onUpdatePurchaseDate?: (purchaseGroup: Expense[], newDate: string) => void;
}

const PurchaseHeader: React.FC<PurchaseHeaderProps> = ({
  firstInstallment,
  originalAmount,
  totalInstallments,
  monthlyAmount,
  purchaseGroup,
  onDeletePurchase,
  onUpdatePurchaseDate
}) => {
  const purchaseDate = new Date(firstInstallment.date);

  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <h3 className="font-semibold text-xl text-gray-800">{firstInstallment.description}</h3>
        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Compra: {purchaseDate.toLocaleDateString('pt-BR')}
          </span>
          <span>{firstInstallment.category}</span>
          <span>{firstInstallment.paymentMethod}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            R$ {originalAmount.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">
            {totalInstallments}x de R$ {monthlyAmount.toFixed(2)}
          </div>
        </div>
        <div className="flex gap-2">
          <PurchaseEditDialog
            purchaseGroup={purchaseGroup}
            onUpdatePurchaseDate={onUpdatePurchaseDate}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeletePurchase(purchaseGroup, firstInstallment.description)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseHeader;

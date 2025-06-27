
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard } from 'lucide-react';

interface InstallmentsSummaryProps {
  totalPendingInstallments: number;
  totalPendingAmount: number;
  totalPurchases: number;
}

const InstallmentsSummary: React.FC<InstallmentsSummaryProps> = ({
  totalPendingInstallments,
  totalPendingAmount,
  totalPurchases
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Parcelas Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-800">{totalPendingInstallments}</div>
          <div className="text-xs text-blue-600 mt-1">parcelas a pagar</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-orange-700">Valor Pendente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-800">R$ {totalPendingAmount.toFixed(2)}</div>
          <div className="text-xs text-orange-600 mt-1">a pagar no futuro</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-700">Compras Parceladas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-800">{totalPurchases}</div>
          <div className="text-xs text-purple-600 mt-1">ativas</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstallmentsSummary;


import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface PurchaseStatsProps {
  paidInstallments: number;
  pendingInstallments: number;
  overdueInstallments: number;
  monthlyAmount: number;
}

const PurchaseStats: React.FC<PurchaseStatsProps> = ({
  paidInstallments,
  pendingInstallments,
  overdueInstallments,
  monthlyAmount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <div>
          <div className="font-semibold text-green-800">Pagas: {paidInstallments}</div>
          <div className="text-sm text-green-600">R$ {(paidInstallments * monthlyAmount).toFixed(2)}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
        <Clock className="w-5 h-5 text-orange-600" />
        <div>
          <div className="font-semibold text-orange-800">Pendentes: {pendingInstallments}</div>
          <div className="text-sm text-orange-600">R$ {(pendingInstallments * monthlyAmount).toFixed(2)}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <div>
          <div className="font-semibold text-red-800">Vencidas: {overdueInstallments}</div>
          <div className="text-sm text-red-600">R$ {(overdueInstallments * monthlyAmount).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseStats;

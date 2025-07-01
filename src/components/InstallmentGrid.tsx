
import React from 'react';

interface InstallmentDetail {
  number: number;
  date: Date;
  isPaid: boolean;
  isOverdue: boolean;
  isPending: boolean;
  status: string;
  amount: number;
}

interface InstallmentGridProps {
  installmentDetails: InstallmentDetail[];
  totalInstallments: number;
}

const InstallmentGrid: React.FC<InstallmentGridProps> = ({
  installmentDetails,
  totalInstallments
}) => {
  return (
    <div>
      <h4 className="font-medium text-gray-800 mb-3">Cronograma Detalhado:</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {installmentDetails.map((detail, i) => (
          <div 
            key={i} 
            className={`p-3 rounded-lg border-2 ${
              detail.isPaid 
                ? 'bg-green-50 border-green-200' 
                : detail.isOverdue 
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm">
                Parcela {detail.number}/{totalInstallments}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                detail.isPaid 
                  ? 'bg-green-200 text-green-800' 
                  : detail.isOverdue 
                    ? 'bg-red-200 text-red-800'
                    : 'bg-yellow-200 text-yellow-800'
              }`}>
                {detail.status}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {detail.date.toLocaleDateString('pt-BR')}
            </div>
            <div className="font-bold text-gray-800">
              R$ {detail.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstallmentGrid;

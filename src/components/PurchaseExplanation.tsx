
import React from 'react';
import { Info } from 'lucide-react';

interface PurchaseExplanationProps {
  purchaseDate: Date;
  firstInstallmentDate: Date;
}

const PurchaseExplanation: React.FC<PurchaseExplanationProps> = ({
  purchaseDate,
  firstInstallmentDate
}) => {
  return (
    <div className="mb-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
      <div className="flex items-start gap-2">
        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">📅 Cronograma de Parcelas:</p>
          <p>
            <strong>Compra realizada:</strong> {purchaseDate.toLocaleDateString('pt-BR')} → 
            <strong> Primeira parcela:</strong> {firstInstallmentDate.toLocaleDateString('pt-BR')}
          </p>
          <p className="text-xs mt-1 text-blue-600">
            ✅ A primeira parcela vence no mesmo dia da compra. As próximas parcelas mantêm o mesmo dia nos meses seguintes.
          </p>
          <p className="text-xs mt-1 text-blue-500">
            💡 <strong>Exemplo:</strong> Compra em 20/05 → 1ª parcela 20/05, 2ª parcela 20/06, 3ª parcela 20/07, etc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseExplanation;

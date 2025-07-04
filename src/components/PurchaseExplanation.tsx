
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
          <p className="font-medium mb-1">📅 Cronograma de Parcelas (Nova Lógica):</p>
          <p>
            <strong>Compra realizada:</strong> {purchaseDate.toLocaleDateString('pt-BR')} → 
            <strong> Primeira parcela:</strong> {firstInstallmentDate.toLocaleDateString('pt-BR')}
          </p>
          <p className="text-xs mt-1 text-blue-600">
            ✅ A primeira parcela vence no mesmo dia da compra, mas no MÊS SEGUINTE. As próximas parcelas mantêm o mesmo dia nos meses subsequentes.
          </p>
          <p className="text-xs mt-1 text-blue-500">
            💡 <strong>Exemplo:</strong> Compra em {purchaseDate.getDate()}/{(purchaseDate.getMonth() + 1).toString().padStart(2, '0')}/{purchaseDate.getFullYear()} → 
            1ª parcela {firstInstallmentDate.getDate()}/{(firstInstallmentDate.getMonth() + 1).toString().padStart(2, '0')}/{firstInstallmentDate.getFullYear()}, 
            2ª parcela {firstInstallmentDate.getDate()}/{(firstInstallmentDate.getMonth() + 2).toString().padStart(2, '0')}/{firstInstallmentDate.getFullYear()}, etc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseExplanation;

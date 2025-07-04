
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
  // Garantir que as datas sejam mostradas corretamente
  const purchaseDateFormatted = purchaseDate.toLocaleDateString('pt-BR');
  const firstInstallmentDateFormatted = firstInstallmentDate.toLocaleDateString('pt-BR');
  
  console.log('=== EXPLANATION COMPONENT ===');
  console.log('Data da compra recebida:', purchaseDateFormatted);
  console.log('Primeira parcela recebida:', firstInstallmentDateFormatted);
  
  return (
    <div className="mb-4 p-3 bg-blue-100 rounded-lg border border-blue-200">
      <div className="flex items-start gap-2">
        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-1">📅 Cronograma de Parcelas (Nova Lógica):</p>
          <p>
            <strong>Compra realizada:</strong> {purchaseDateFormatted} → 
            <strong> Primeira parcela:</strong> {firstInstallmentDateFormatted}
          </p>
          <p className="text-xs mt-1 text-blue-600">
            ✅ A primeira parcela vence no mesmo dia da compra, mas no MÊS SEGUINTE. As próximas parcelas mantêm o mesmo dia nos meses subsequentes.
          </p>
          <p className="text-xs mt-1 text-blue-500">
            💡 <strong>Exemplo:</strong> Compra em {purchaseDateFormatted} → 
            1ª parcela {firstInstallmentDateFormatted}, 
            2ª parcela {firstInstallmentDate.getDate()}/{(firstInstallmentDate.getMonth() + 2).toString().padStart(2, '0')}/{firstInstallmentDate.getFullYear()}, etc.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PurchaseExplanation;

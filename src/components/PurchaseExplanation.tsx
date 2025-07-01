
import React from 'react';

interface PurchaseExplanationProps {
  purchaseDate: Date;
  firstInstallmentDate: Date;
}

const PurchaseExplanation: React.FC<PurchaseExplanationProps> = ({
  purchaseDate,
  firstInstallmentDate
}) => {
  return (
    <div className="bg-blue-100 p-3 rounded-lg mb-4">
      <h4 className="font-medium text-blue-800 mb-1">📅 Como funcionam as parcelas:</h4>
      <p className="text-sm text-blue-700">
        As parcelas mantêm o mesmo dia da compra. 
        Compra realizada em {purchaseDate.toLocaleDateString('pt-BR')}, 
        primeira parcela vence em {firstInstallmentDate.toLocaleDateString('pt-BR')}.
      </p>
    </div>
  );
};

export default PurchaseExplanation;

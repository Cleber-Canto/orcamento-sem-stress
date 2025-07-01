
import React from 'react';

interface PurchaseProgressBarProps {
  paidInstallments: number;
  totalInstallments: number;
}

const PurchaseProgressBar: React.FC<PurchaseProgressBarProps> = ({
  paidInstallments,
  totalInstallments
}) => {
  const progressPercentage = (paidInstallments / totalInstallments) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
      <div 
        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
        style={{ width: `${progressPercentage}%` }}
      ></div>
    </div>
  );
};

export default PurchaseProgressBar;

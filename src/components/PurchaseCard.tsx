
import React from 'react';
import { Expense } from '@/types/installments';
import { calculateFirstInstallmentDate } from '@/utils/dateUtils';
import PurchaseHeader from './PurchaseHeader';
import PurchaseExplanation from './PurchaseExplanation';
import PurchaseStats from './PurchaseStats';
import PurchaseProgressBar from './PurchaseProgressBar';
import InstallmentGrid from './InstallmentGrid';

interface PurchaseCardProps {
  purchaseGroup: Expense[];
  index: number;
  onDeletePurchase: (purchaseGroup: Expense[], description: string) => void;
  onUpdatePurchaseDate?: (purchaseGroup: Expense[], newDate: string) => void;
}

const PurchaseCard: React.FC<PurchaseCardProps> = ({ 
  purchaseGroup, 
  index, 
  onDeletePurchase, 
  onUpdatePurchaseDate 
}) => {
  const currentDate = new Date();
  const sortedGroup = purchaseGroup.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const firstInstallment = sortedGroup[0];
  const totalInstallments = firstInstallment.totalInstallments || purchaseGroup.length;
  const originalAmount = firstInstallment.originalAmount || (firstInstallment.amount * totalInstallments);
  const monthlyAmount = originalAmount / totalInstallments;
  
  const purchaseDate = new Date(firstInstallment.date);
  
  // A primeira parcela vence no mesmo dia da compra
  const firstInstallmentDate = calculateFirstInstallmentDate(firstInstallment.date);
  
  console.log('=== DEBUG PURCHASE CARD ===');
  console.log('Data da compra:', purchaseDate.toLocaleDateString('pt-BR'));
  console.log('Data da primeira parcela:', firstInstallmentDate.toLocaleDateString('pt-BR'));
  console.log('Total de parcelas:', totalInstallments);
  console.log('Valor original:', originalAmount);
  console.log('Valor mensal:', monthlyAmount);
  console.log('Parcelas existentes no banco:', purchaseGroup.length);
  console.log('Parcelas existentes:', purchaseGroup.map(p => ({ number: p.installmentNumber, date: p.date })));
  
  // Calcular parcelas seguindo o dia da compra
  let paidInstallments = 0;
  let overdueInstallments = 0;
  let pendingInstallments = 0;
  const installmentDetails = [];
  
  for (let i = 0; i < totalInstallments; i++) {
    // Calcular a data de cada parcela mantendo o mesmo dia
    const installmentDate = new Date(firstInstallmentDate);
    installmentDate.setMonth(firstInstallmentDate.getMonth() + i);
    
    // Ajustar para o último dia do mês se o dia não existir
    if (installmentDate.getMonth() !== (firstInstallmentDate.getMonth() + i) % 12) {
      installmentDate.setDate(0);
    }
    
    const existingInstallment = purchaseGroup.find(exp => exp.installmentNumber === (i + 1));
    const hasPassedCurrentDate = installmentDate < currentDate;
    
    // Lógica de status corrigida
    const monthsSinceDue = hasPassedCurrentDate ? 
      (currentDate.getFullYear() - installmentDate.getFullYear()) * 12 + 
      (currentDate.getMonth() - installmentDate.getMonth()) : 0;
    
    const isPaid = !!existingInstallment;
    const isOverdue = hasPassedCurrentDate && !existingInstallment;
    const isPending = !hasPassedCurrentDate && !existingInstallment;
    
    console.log(`Parcela ${i + 1}/${totalInstallments}:`, {
      date: installmentDate.toLocaleDateString('pt-BR'),
      isPaid,
      isOverdue,
      isPending,
      existingInstallment: !!existingInstallment,
      hasPassedCurrentDate
    });
    
    if (isPaid) paidInstallments++;
    if (isOverdue) overdueInstallments++;
    if (isPending) pendingInstallments++;
    
    let status = 'A vencer';
    if (isPaid) status = 'Paga';
    else if (isOverdue) status = 'Vencida';
    
    installmentDetails.push({
      number: i + 1,
      date: installmentDate,
      isPaid,
      isOverdue,
      isPending,
      status,
      amount: monthlyAmount
    });
  }

  console.log('Resumo das parcelas:', {
    paidInstallments,
    overdueInstallments,
    pendingInstallments
  });

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <PurchaseHeader
        firstInstallment={firstInstallment}
        originalAmount={originalAmount}
        totalInstallments={totalInstallments}
        monthlyAmount={monthlyAmount}
        purchaseGroup={purchaseGroup}
        onDeletePurchase={onDeletePurchase}
        onUpdatePurchaseDate={onUpdatePurchaseDate}
      />

      <PurchaseExplanation
        purchaseDate={purchaseDate}
        firstInstallmentDate={firstInstallmentDate}
      />
      
      <PurchaseStats
        paidInstallments={paidInstallments}
        pendingInstallments={pendingInstallments}
        overdueInstallments={overdueInstallments}
        monthlyAmount={monthlyAmount}
      />

      <PurchaseProgressBar
        paidInstallments={paidInstallments}
        totalInstallments={totalInstallments}
      />

      <InstallmentGrid
        installmentDetails={installmentDetails}
        totalInstallments={totalInstallments}
      />
    </div>
  );
};

export default PurchaseCard;

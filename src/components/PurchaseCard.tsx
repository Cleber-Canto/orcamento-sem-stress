
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
  
  // Usar a data original da compra sem modificações
  const purchaseDate = new Date(firstInstallment.date);
  const firstInstallmentDate = new Date(firstInstallment.date); // Primeira parcela no mesmo dia da compra
  
  console.log('=== DEBUG PURCHASE CARD CORRIGIDO ===');
  console.log('Data original inserida:', firstInstallment.date);
  console.log('Data da compra processada:', purchaseDate.toLocaleDateString('pt-BR'));
  console.log('Data da primeira parcela:', firstInstallmentDate.toLocaleDateString('pt-BR'));
  console.log('Total de parcelas:', totalInstallments);
  console.log('Valor original:', originalAmount);
  console.log('Valor mensal:', monthlyAmount);
  
  // Calcular parcelas seguindo exatamente a data original
  let paidInstallments = 0;
  let overdueInstallments = 0;
  let pendingInstallments = 0;
  const installmentDetails = [];
  
  for (let i = 0; i < totalInstallments; i++) {
    // Calcular a data de cada parcela mantendo o mesmo dia da compra original
    const installmentDate = new Date(firstInstallmentDate);
    installmentDate.setMonth(firstInstallmentDate.getMonth() + i);
    
    // Verificar se o dia existe no mês (ex: 31 em fevereiro)
    if (installmentDate.getDate() !== firstInstallmentDate.getDate()) {
      installmentDate.setDate(0); // Último dia do mês anterior
    }
    
    const existingInstallment = purchaseGroup.find(exp => exp.installmentNumber === (i + 1));
    const hasPassedCurrentDate = installmentDate < currentDate;
    
    const isPaid = !!existingInstallment;
    const isOverdue = hasPassedCurrentDate && !existingInstallment;
    const isPending = !hasPassedCurrentDate && !existingInstallment;
    
    console.log(`Parcela ${i + 1}/${totalInstallments}:`, {
      date: installmentDate.toLocaleDateString('pt-BR'),
      originalDate: firstInstallment.date,
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

  console.log('Resumo das parcelas corrigido:', {
    paidInstallments,
    overdueInstallments,
    pendingInstallments,
    dataOriginal: firstInstallment.date
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

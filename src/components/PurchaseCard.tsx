
import React from 'react';
import { Expense } from '@/types/installments';
import PurchaseHeader from './PurchaseHeader';
import PurchaseExplanation from './PurchaseExplanation';
import PurchaseStats from './PurchaseStats';
import PurchaseProgressBar from './PurchaseProgressBar';
import InstallmentGrid from './InstallmentGrid';
import { calculateFirstInstallmentDate, calculateAllInstallmentDates } from '@/utils/dateUtils';

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
  
  console.log('=== ANÁLISE DA COMPRA (NOVA LÓGICA) ===');
  console.log('Descrição:', firstInstallment.description);
  console.log('Data EXATA inserida pelo usuário:', firstInstallment.date);
  console.log('Valor original:', originalAmount);
  console.log('Total de parcelas:', totalInstallments);
  console.log('Valor mensal:', monthlyAmount);
  
  // Usar a data EXATA inserida pelo usuário
  const purchaseDate = new Date(firstInstallment.date + 'T00:00:00');
  console.log('Data da compra processada:', purchaseDate.toLocaleDateString('pt-BR'));
  
  // Calcular a primeira parcela (mês seguinte, mesmo dia)
  const firstInstallmentDate = calculateFirstInstallmentDate(firstInstallment.date);
  console.log('Primeira parcela:', firstInstallmentDate.toLocaleDateString('pt-BR'));
  
  // Calcular todas as datas de parcelas
  const allInstallmentDates = calculateAllInstallmentDates(firstInstallment.date, totalInstallments);
  
  // Calcular status das parcelas
  let paidInstallments = 0;
  let overdueInstallments = 0;
  let pendingInstallments = 0;
  const installmentDetails = [];
  
  for (let i = 0; i < totalInstallments; i++) {
    const installmentDate = allInstallmentDates[i];
    
    console.log(`Parcela ${i + 1}: ${installmentDate.toLocaleDateString('pt-BR')}`);
    
    const existingInstallment = purchaseGroup.find(exp => exp.installmentNumber === (i + 1));
    const hasPassedCurrentDate = installmentDate < currentDate;
    
    const isPaid = !!existingInstallment;
    const isOverdue = hasPassedCurrentDate && !existingInstallment;
    const isPending = !hasPassedCurrentDate && !existingInstallment;
    
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

  console.log('=== RESUMO FINAL (NOVA LÓGICA) ===');
  console.log('Data da compra:', purchaseDate.toLocaleDateString('pt-BR'));
  console.log('Primeira parcela:', firstInstallmentDate.toLocaleDateString('pt-BR'));
  console.log('Parcelas pagas:', paidInstallments);
  console.log('Parcelas vencidas:', overdueInstallments);
  console.log('Parcelas pendentes:', pendingInstallments);

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

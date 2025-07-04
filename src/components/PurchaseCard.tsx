
import React from 'react';
import { Expense } from '@/types/installments';
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
  
  console.log('=== CORREÇÃO PURCHASE CARD ===');
  console.log('Data original da compra:', firstInstallment.date);
  
  // Usar EXATAMENTE a data inserida pelo usuário
  const purchaseDate = new Date(firstInstallment.date);
  const firstInstallmentDate = new Date(firstInstallment.date); // Primeira parcela no mesmo dia
  
  console.log('Data da compra:', purchaseDate.toLocaleDateString('pt-BR'));
  console.log('Data da primeira parcela:', firstInstallmentDate.toLocaleDateString('pt-BR'));
  console.log('Dia da compra:', purchaseDate.getDate());
  console.log('Mês da compra:', purchaseDate.getMonth() + 1);
  console.log('Ano da compra:', purchaseDate.getFullYear());
  
  // Calcular parcelas usando a data EXATA inserida
  let paidInstallments = 0;
  let overdueInstallments = 0;
  let pendingInstallments = 0;
  const installmentDetails = [];
  
  for (let i = 0; i < totalInstallments; i++) {
    // Calcular cada parcela usando a data original + i meses
    const installmentDate = new Date(purchaseDate.getFullYear(), purchaseDate.getMonth() + i, purchaseDate.getDate());
    
    // Verificar se o dia existe no mês (ex: 31 em fevereiro)
    if (installmentDate.getDate() !== purchaseDate.getDate()) {
      installmentDate.setDate(0); // Último dia do mês anterior
    }
    
    console.log(`Parcela ${i + 1}: Data calculada = ${installmentDate.toLocaleDateString('pt-BR')} (${installmentDate.getDate()}/${installmentDate.getMonth() + 1}/${installmentDate.getFullYear()})`);
    
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

  console.log('Resumo final:', {
    dataOriginalCompra: firstInstallment.date,
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

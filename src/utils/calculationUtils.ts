
import { EnhancedInstallment } from '@/types/installments';

// Função para calcular o total pendente de parcelas
export const calculatePendingInstallmentsTotal = (installments: EnhancedInstallment[]) => {
  return installments
    .filter(inst => !inst.isPaid)
    .reduce((sum, inst) => sum + inst.amount, 0);
};

// Função para calcular estatísticas de parcelas
export const calculateInstallmentStats = (installments: EnhancedInstallment[]) => {
  const totalInstallments = installments.length;
  const paidInstallments = installments.filter(inst => inst.isPaid).length;
  const pendingInstallments = totalInstallments - paidInstallments;
  
  const totalAmount = installments.reduce((sum, inst) => sum + inst.amount, 0);
  const paidAmount = installments.filter(inst => inst.isPaid).reduce((sum, inst) => sum + inst.amount, 0);
  const pendingAmount = totalAmount - paidAmount;
  
  return {
    totalInstallments,
    paidInstallments,
    pendingInstallments,
    totalAmount,
    paidAmount,
    pendingAmount,
    completionPercentage: totalInstallments > 0 ? (paidInstallments / totalInstallments) * 100 : 0
  };
};

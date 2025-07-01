
import { EnhancedInstallment } from '@/types/installments';

// Função para gerar relatório detalhado de parcelas (como o exemplo solicitado)
export const generateInstallmentReport = (installments: EnhancedInstallment[], purchaseDate: string) => {
  const purchase = new Date(purchaseDate);
  const today = new Date();
  
  const paidInstallments = installments.filter(inst => inst.isPaid);
  const pendingInstallments = installments.filter(inst => !inst.isPaid);
  const overdueInstallments = pendingInstallments.filter(inst => new Date(inst.date) < today);
  const upcomingInstallments = pendingInstallments.filter(inst => new Date(inst.date) >= today);
  
  return {
    purchaseInfo: {
      date: purchase.toLocaleDateString('pt-BR'),
      totalInstallments: installments.length,
      description: installments[0]?.description || 'Compra'
    },
    paidInstallments: paidInstallments.map(inst => ({
      number: inst.installmentNumber,
      amount: inst.amount,
      dueDate: new Date(inst.date).toLocaleDateString('pt-BR'),
      status: 'Paga'
    })),
    overdueInstallments: overdueInstallments.map(inst => ({
      number: inst.installmentNumber,
      amount: inst.amount,
      dueDate: new Date(inst.date).toLocaleDateString('pt-BR'),
      status: 'Vencida'
    })),
    upcomingInstallments: upcomingInstallments.map(inst => ({
      number: inst.installmentNumber,
      amount: inst.amount,
      dueDate: new Date(inst.date).toLocaleDateString('pt-BR'),
      status: 'A vencer'
    }))
  };
};

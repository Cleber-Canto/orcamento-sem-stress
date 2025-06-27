
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { InstallmentsSectionProps, Expense } from '@/types/installments';
import { groupInstallmentsByPurchase, generateAllInstallments } from '@/utils/installmentUtils';
import InstallmentsSummary from './InstallmentsSummary';
import PurchasesList from './PurchasesList';
import InstallmentsCalendar from './InstallmentsCalendar';

const InstallmentsSection: React.FC<InstallmentsSectionProps> = ({ expenses, onDeleteExpense }) => {
  const { toast } = useToast();

  console.log('Todas as despesas:', expenses);
  console.log('Despesas com isInstallment:', expenses.filter(e => e.isInstallment));

  const installmentGroups = groupInstallmentsByPurchase(expenses);
  const installmentPurchases = Object.values(installmentGroups);
  const allInstallments = generateAllInstallments(installmentGroups);

  console.log('Todas as parcelas geradas:', allInstallments);

  // Calcular totais
  const totalPendingAmount = allInstallments
    .filter(inst => !inst.isPaid)
    .reduce((sum, inst) => sum + inst.amount, 0);

  const totalPendingInstallments = allInstallments.filter(inst => !inst.isPaid).length;
  const totalPurchases = installmentPurchases.length;

  console.log('Totais calculados:', {
    totalPendingAmount,
    totalPendingInstallments,
    totalPurchases
  });

  const handleDeletePurchase = (purchaseGroup: Expense[], description: string) => {
    // Deletar todas as parcelas desta compra
    purchaseGroup.forEach(expense => {
      onDeleteExpense(expense.id);
    });

    toast({
      title: "Compra parcelada excluída",
      description: `${description} e todas suas parcelas foram removidas`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Controle de Parcelas</h2>
      </div>

      <InstallmentsSummary
        totalPendingInstallments={totalPendingInstallments}
        totalPendingAmount={totalPendingAmount}
        totalPurchases={totalPurchases}
      />

      <PurchasesList
        installmentPurchases={installmentPurchases}
        onDeletePurchase={handleDeletePurchase}
      />

      <InstallmentsCalendar allInstallments={allInstallments} />
    </div>
  );
};

export default InstallmentsSection;

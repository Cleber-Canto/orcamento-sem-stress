
import { Expense, EnhancedInstallment } from '@/types/installments';

// Função para calcular a data da primeira parcela baseada na data real da compra
export const calculateFirstInstallmentDate = (purchaseDate: string) => {
  const purchase = new Date(purchaseDate);
  
  console.log('Data da compra:', purchase);
  
  // A primeira parcela será no próximo mês, mantendo o mesmo dia
  const firstInstallmentDate = new Date(purchase);
  firstInstallmentDate.setMonth(firstInstallmentDate.getMonth() + 1);
  
  // Se o dia não existir no próximo mês (ex: 31 para fevereiro), ajustar para o último dia
  if (firstInstallmentDate.getMonth() !== (purchase.getMonth() + 1) % 12) {
    firstInstallmentDate.setDate(0); // Último dia do mês anterior
  }
  
  console.log('Primeira parcela será em:', firstInstallmentDate);
  
  return firstInstallmentDate;
};

// Agrupar compras parceladas por descrição e valor original
export const groupInstallmentsByPurchase = (expenses: Expense[]) => {
  const installmentExpenses = expenses.filter(expense => expense.isInstallment);
  console.log('Despesas parceladas filtradas:', installmentExpenses);
  
  const grouped: { [key: string]: Expense[] } = {};
  
  installmentExpenses.forEach(expense => {
    // Criar chave única baseada na descrição e valor original
    const key = `${expense.description}-${expense.originalAmount || expense.amount}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(expense);
  });
  
  console.log('Compras agrupadas:', grouped);
  return grouped;
};

// Gerar cronograma completo de todas as parcelas seguindo mês a mês
export const generateAllInstallments = (installmentGroups: { [key: string]: Expense[] }) => {
  const allInstallments: EnhancedInstallment[] = [];
  
  Object.values(installmentGroups).forEach(group => {
    if (group.length === 0) return;
    
    // Ordenar o grupo por data para pegar a primeira parcela (mais antiga)
    const sortedGroup = group.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstInstallment = sortedGroup[0];
    const totalInstallments = firstInstallment.totalInstallments || group.length;
    const originalAmount = firstInstallment.originalAmount || (firstInstallment.amount * totalInstallments);
    const monthlyAmount = originalAmount / totalInstallments;
    
    // Calcular a data da primeira parcela baseada na data real da compra
    const baseDate = calculateFirstInstallmentDate(firstInstallment.date);
    
    for (let i = 0; i < totalInstallments; i++) {
      const installmentDate = new Date(baseDate);
      installmentDate.setMonth(installmentDate.getMonth() + i);
      
      // Ajustar se o dia não existir no mês
      const targetMonth = (baseDate.getMonth() + i) % 12;
      if (installmentDate.getMonth() !== targetMonth) {
        // Se o dia não existe no mês, usar o último dia do mês
        installmentDate.setMonth(targetMonth + 1, 0);
      }
      
      // Verificar se esta parcela já foi paga (existe na lista de despesas)
      const existingInstallment = group.find(exp => exp.installmentNumber === (i + 1));
      const isPaid = !!existingInstallment;
      
      allInstallments.push({
        ...firstInstallment,
        installmentNumber: i + 1,
        amount: monthlyAmount,
        date: installmentDate.toISOString().split('T')[0],
        isPaid: isPaid,
        id: existingInstallment?.id || firstInstallment.id + i
      });
    }
  });
  
  return allInstallments;
};


import { Expense } from '@/types/installments';

// Agrupar compras parceladas por descrição e valor original
export const groupInstallmentsByPurchase = (expenses: Expense[]) => {
  console.log('Iniciando agrupamento. Total de despesas:', expenses.length);
  
  // Filtrar apenas despesas parceladas
  const installmentExpenses = expenses.filter(expense => {
    const isInstallment = expense.isInstallment === true || 
                         (expense.installmentNumber && expense.installmentNumber > 0) ||
                         (expense.totalInstallments && expense.totalInstallments > 1);
    console.log('Verificando despesa:', expense.description, 'isInstallment:', isInstallment);
    return isInstallment;
  });
  
  console.log('Despesas parceladas encontradas:', installmentExpenses.length);
  console.log('Despesas parceladas:', installmentExpenses);
  
  const grouped: { [key: string]: Expense[] } = {};
  
  installmentExpenses.forEach(expense => {
    // Criar chave única baseada na descrição, valor original e data base
    const originalAmount = expense.originalAmount || expense.amount;
    const baseDate = expense.date.substring(0, 7); // YYYY-MM para agrupar por mês base
    const key = `${expense.description}-${originalAmount}-${baseDate}`;
    console.log('Criando chave para agrupamento:', key);
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(expense);
  });
  
  console.log('Compras agrupadas por chave:', grouped);
  return grouped;
};

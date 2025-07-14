import { useState, useEffect } from 'react';
import { Goal, Income, Expense } from '@/types/financial';
import { gerarParcelasCartao } from '@/utils/parcelas';

export const useFinancialData = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);

  // Carregar dados do localStorage
  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedGoals = localStorage.getItem('goals');
    const savedIncomes = localStorage.getItem('incomes');
    const savedMonthlyIncome = localStorage.getItem('monthlyIncome');

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    }
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
    if (savedIncomes) {
      setIncomes(JSON.parse(savedIncomes));
    }
    if (savedMonthlyIncome) {
      setMonthlyIncome(parseFloat(savedMonthlyIncome));
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('incomes', JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem('monthlyIncome', monthlyIncome.toString());
  }, [monthlyIncome]);

  // Cálculos
  const totalExtraIncome = incomes
    .filter(income => !income.isRecurring)
    .reduce((sum, income) => sum + income.amount, 0);

  const totalIncome = monthlyIncome + totalExtraIncome;
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBalance = totalIncome - totalExpenses;

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newId = Date.now();
    
    if (expense.isInstallment && expense.totalInstallments && expense.totalInstallments > 1) {
      // Gerar parcelas
      const parcelas = gerarParcelasCartao(
        expense.amount * expense.totalInstallments,
        new Date(expense.date),
        expense.totalInstallments
      ).map((parcela, idx) => ({
        id: `${newId}-${idx}`,
        category: expense.category,
        amount: parcela.amount,
        date: parcela.date,
        description: expense.description,
        paymentMethod: expense.paymentMethod || 'Cartão de Crédito',
        installmentNumber: parcela.installmentNumber,
        totalInstallments: parcela.totalInstallments,
        originalAmount: expense.amount * expense.totalInstallments,
        isInstallment: true,
        dueDate: parcela.date,
        originalExpenseId: newId.toString()
      }));

      // Adicionar todas as parcelas
      setExpenses(prev => [...prev, ...parcelas as any]);
    } else {
      // Adicionar despesa única
      setExpenses(prev => [...prev, { ...expense, id: newId.toString() } as any]);
    }
  };

  const deleteExpense = (expenseId: string | number) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId.toString()));
  };

  return {
    expenses,
    goals,
    incomes,
    monthlyIncome,
    totalExtraIncome,
    totalIncome,
    totalExpenses,
    remainingBalance,
    setGoals,
    setMonthlyIncome,
    setIncomes,
    addExpense,
    deleteExpense
  };
};
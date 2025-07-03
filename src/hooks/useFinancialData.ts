
import { useState, useEffect } from 'react';
import { Goal, Income, Expense } from '@/types/financial';

export const useFinancialData = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('financial-expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [
      { id: 1, category: 'Alimentação', amount: 45.50, date: '2024-01-15', description: 'Almoço', paymentMethod: 'Cartão de Crédito' },
      { id: 2, category: 'Transporte', amount: 12.00, date: '2024-01-15', description: 'Uber', paymentMethod: 'PIX' },
      { id: 3, category: 'Mercado', amount: 120.00, date: '2024-01-14', description: 'Compras semanais', paymentMethod: 'Cartão de Débito' },
      { id: 4, category: 'Débito Automático', amount: 89.90, date: '2024-01-10', description: 'Internet (1/12)', paymentMethod: 'Débito Automático', isInstallment: true, installmentNumber: 1, totalInstallments: 12 },
      { id: 5, category: 'Impostos', amount: 250.00, date: '2024-01-05', description: 'IPTU', paymentMethod: 'Boleto' },
    ];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const savedGoals = localStorage.getItem('financial-goals');
    return savedGoals ? JSON.parse(savedGoals) : [
      { id: 1, name: 'Emergência', target: 500, current: 150, type: 'save' as const },
      { id: 2, name: 'Delivery', target: 300, current: 280, type: 'limit' as const },
    ];
  });

  const [monthlyIncome, setMonthlyIncome] = useState(() => {
    const savedIncome = localStorage.getItem('financial-income');
    return savedIncome ? JSON.parse(savedIncome) : 2500;
  });

  const [incomes, setIncomes] = useState<Income[]>(() => {
    const savedIncomes = localStorage.getItem('financial-incomes');
    return savedIncomes ? JSON.parse(savedIncomes) : [];
  });

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('financial-expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('financial-goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('financial-income', JSON.stringify(monthlyIncome));
  }, [monthlyIncome]);

  useEffect(() => {
    localStorage.setItem('financial-incomes', JSON.stringify(incomes));
  }, [incomes]);

  const totalExtraIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalIncome = monthlyIncome + totalExtraIncome;
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBalance = totalIncome - totalExpenses;

  const addExpense = (expense: any) => {
    setExpenses([...expenses, { ...expense, id: Date.now() + Math.random() }]);
  };

  const deleteExpense = (expenseId: number) => {
    setExpenses(expenses.filter(expense => expense.id !== expenseId));
  };

  return {
    expenses,
    goals,
    monthlyIncome,
    incomes,
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

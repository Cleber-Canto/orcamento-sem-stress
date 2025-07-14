import { useState, useEffect } from 'react';
import { Goal, Income, Expense } from '@/types/financial';
import { gerarParcelasCartao } from '@/utils/parcelas'; // ajuste o caminho conforme seu projeto

export const useFinancialData = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('financial-expenses');
    return savedExpenses
      ? JSON.parse(savedExpenses)
      : [
          {
            id: 1,
            category: 'Alimentação',
            amount: 45.5,
            date: '2024-01-15',
            description: 'Almoço',
            paymentMethod: 'Cartão de Crédito',
          },
        ];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const savedGoals = localStorage.getItem('financial-goals');
    return savedGoals
      ? JSON.parse(savedGoals)
      : [
          { id: 1, name: 'Emergência', target: 500, current: 150, type: 'save' },
          { id: 2, name: 'Delivery', target: 300, current: 280, type: 'limit' },
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

  // Somar só as despesas principais (não soma parcelas, pois estão dentro do installments)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const remainingBalance = totalIncome - totalExpenses;

  const addExpense = (expense: Expense) => {
    const newId = Date.now() + Math.floor(Math.random() * 1000);

    // Se não for parcelado, adiciona direto
    if (!expense.isInstallment || !expense.totalInstallments || expense.totalInstallments <= 1) {
      setExpenses(prev => [...prev, { ...expense, id: newId.toString() } as any]);
      return;
    }

    // Gerar parcelas dentro do campo installments
    const parcelas = gerarParcelasCartao(
      expense.amount,
      new Date(expense.date),
      expense.totalInstallments
    ).map((parcela, idx) => ({
      id: `${newId}${idx}`, // id único para cada parcela
      category: expense.category,
      amount: parcela.amount,
      date: parcela.date,
      description: `${expense.description} (${parcela.installmentNumber}/${parcela.totalInstallments})`,
      paymentMethod: expense.paymentMethod,
      isInstallment: true,
      installmentNumber: parcela.installmentNumber,
      totalInstallments: parcela.totalInstallments,
      dueDate: parcela.date,
      // Não cria parcelas dentro das parcelas para evitar recursão
    }));

    const expenseComParcelas: Expense = {
      ...expense,
      id: newId.toString(),
      installments: parcelas,
    };

    setExpenses(prev => [...prev, expenseComParcelas as any]);
  };

  const deleteExpense = (expenseId: number) => {
    setExpenses(prev => prev.filter(expense => expense.id !== expenseId.toString()));
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
    deleteExpense,
  };
};

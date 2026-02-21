import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Goal, Income, Expense } from '@/types/financial';

export const useSupabaseFinancialData = (userId: string | undefined) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchAllData();
    }
  }, [userId]);

  const fetchAllData = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses' as any)
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (expensesError) throw expensesError;

      const { data: goalsData, error: goalsError } = await supabase
        .from('goals' as any)
        .select('*')
        .eq('user_id', userId);

      if (goalsError) throw goalsError;

      const { data: incomesData, error: incomesError } = await supabase
        .from('incomes' as any)
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (incomesError) throw incomesError;

      const convertedExpenses: Expense[] = (expensesData as any[])?.map((expense: any) => ({
        id: expense.id,
        category: expense.category,
        amount: parseFloat(expense.amount?.toString() || '0'),
        date: expense.date,
        description: expense.description,
        paymentMethod: expense.payment_method as any,
        isInstallment: expense.is_installment,
        installmentNumber: expense.installment_number,
        totalInstallments: expense.total_installments,
        originalAmount: expense.original_amount ? parseFloat(expense.original_amount?.toString() || '0') : undefined,
        dueDate: expense.due_date,
        billingInfo: expense.billing_cutoff_day ? {
          cutoffDay: expense.billing_cutoff_day,
          dueDay: expense.billing_due_day,
          billingMonth: expense.billing_month
        } : undefined,
        isRecurring: expense.is_recurring,
        recurringFrequency: expense.recurring_frequency as any,
        notes: expense.notes,
        originalExpenseId: expense.original_expense_id
      })) || [];

      const convertedGoals: Goal[] = (goalsData as any[])?.map((goal: any) => ({
        id: goal.id,
        name: goal.name,
        target: parseFloat(goal.target?.toString() || '0'),
        current: parseFloat(goal.current?.toString() || '0'),
        type: goal.type as 'save' | 'limit'
      })) || [];

      const convertedIncomes: Income[] = (incomesData as any[])?.map((income: any) => ({
        id: income.id,
        description: income.description,
        amount: parseFloat(income.amount?.toString() || '0'),
        type: income.type as any,
        date: income.date,
        isRecurring: income.is_recurring
      })) || [];

      setExpenses(convertedExpenses);
      setGoals(convertedGoals);
      setIncomes(convertedIncomes);

      const monthlyIncomeTotal = convertedIncomes
        .filter(income => income.isRecurring)
        .reduce((sum, income) => sum + income.amount, 0);
      setMonthlyIncome(monthlyIncomeTotal);

    } catch (error: any) {
      toast.error('Erro ao carregar dados financeiros');
      console.error('Error fetching financial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addIncome = async (incomeData: Omit<Income, 'id'>) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('incomes' as any)
        .insert({
          user_id: userId,
          description: incomeData.description,
          amount: incomeData.amount,
          type: incomeData.type,
          date: incomeData.date,
          is_recurring: incomeData.isRecurring
        } as any);

      if (error) throw error;

      toast.success('Renda adicionada com sucesso!');
      await fetchAllData();
    } catch (error: any) {
      toast.error('Erro ao adicionar renda');
      console.error('Error adding income:', error);
    }
  };

  const deleteIncome = async (incomeId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('incomes' as any)
        .delete()
        .eq('id', incomeId)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Renda excluída com sucesso!');
      await fetchAllData();
    } catch (error: any) {
      toast.error('Erro ao excluir renda');
      console.error('Error deleting income:', error);
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('expenses' as any)
        .insert({
          user_id: userId,
          category: expenseData.category,
          amount: expenseData.amount,
          date: expenseData.date,
          description: expenseData.description,
          payment_method: expenseData.paymentMethod,
          is_installment: expenseData.isInstallment,
          installment_number: expenseData.installmentNumber,
          total_installments: expenseData.totalInstallments,
          original_amount: expenseData.originalAmount,
          due_date: expenseData.dueDate,
          billing_cutoff_day: expenseData.billingInfo?.cutoffDay,
          billing_due_day: expenseData.billingInfo?.dueDay,
          billing_month: expenseData.billingInfo?.billingMonth,
          is_recurring: expenseData.isRecurring,
          recurring_frequency: expenseData.recurringFrequency,
          notes: expenseData.notes,
          original_expense_id: expenseData.originalExpenseId
        } as any);

      if (error) throw error;

      toast.success('Despesa adicionada com sucesso!');
      await fetchAllData();
    } catch (error: any) {
      toast.error('Erro ao adicionar despesa');
      console.error('Error adding expense:', error);
    }
  };

  const deleteExpense = async (expenseId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('expenses' as any)
        .delete()
        .eq('id', expenseId)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Despesa excluída com sucesso!');
      await fetchAllData();
    } catch (error: any) {
      toast.error('Erro ao excluir despesa');
      console.error('Error deleting expense:', error);
    }
  };

  const totalExtraIncome = incomes
    .filter(income => !income.isRecurring)
    .reduce((sum, income) => sum + income.amount, 0);

  const totalIncome = monthlyIncome + totalExtraIncome;
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBalance = totalIncome - totalExpenses;

  return {
    expenses,
    goals,
    incomes,
    monthlyIncome,
    totalExtraIncome,
    totalIncome,
    totalExpenses,
    remainingBalance,
    isLoading,
    addExpense,
    deleteExpense,
    addIncome,
    deleteIncome,
    setGoals,
    setMonthlyIncome,
    setIncomes,
    refreshData: fetchAllData
  };
};

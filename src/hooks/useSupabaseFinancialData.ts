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

  // Buscar dados quando userId estiver disponível
  useEffect(() => {
    if (userId) {
      fetchAllData();
    }
  }, [userId]);

  const fetchAllData = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      
      // Buscar despesas
      const { data: expensesData, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (expensesError) throw expensesError;

      // Buscar objetivos
      const { data: goalsData, error: goalsError } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', userId);

      if (goalsError) throw goalsError;

      // Buscar receitas
      const { data: incomesData, error: incomesError } = await supabase
        .from('incomes')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (incomesError) throw incomesError;

      // Converter dados do banco para o formato esperado
      const convertedExpenses: Expense[] = expensesData?.map(expense => ({
        id: expense.id,
        category: expense.category,
        amount: parseFloat(expense.amount),
        date: expense.date,
        description: expense.description,
        paymentMethod: expense.payment_method as 'PIX' | 'Boleto' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Débito Automático',
        isInstallment: expense.is_installment,
        installmentNumber: expense.installment_number,
        totalInstallments: expense.total_installments,
        originalAmount: expense.original_amount ? parseFloat(expense.original_amount) : undefined,
        dueDate: expense.due_date,
        billingInfo: expense.billing_cutoff_day ? {
          cutoffDay: expense.billing_cutoff_day,
          dueDay: expense.billing_due_day,
          billingMonth: expense.billing_month
        } : undefined,
        isRecurring: expense.is_recurring,
        recurringFrequency: expense.recurring_frequency as 'monthly' | 'weekly' | 'yearly',
        notes: expense.notes,
        originalExpenseId: expense.original_expense_id
      })) || [];

      const convertedGoals: Goal[] = goalsData?.map(goal => ({
        id: goal.id,
        name: goal.name,
        target: parseFloat(goal.target),
        current: parseFloat(goal.current),
        type: goal.type as 'save' | 'limit'
      })) || [];

      const convertedIncomes: Income[] = incomesData?.map(income => ({
        id: income.id,
        description: income.description,
        amount: parseFloat(income.amount),
        type: income.type as 'salary' | 'extra' | 'investment' | 'freelance' | 'bonus',
        date: income.date,
        isRecurring: income.is_recurring
      })) || [];

      setExpenses(convertedExpenses);
      setGoals(convertedGoals);
      setIncomes(convertedIncomes);

      // Calcular renda mensal total
      const monthlyIncome = convertedIncomes
        .filter(income => income.isRecurring)
        .reduce((sum, income) => sum + income.amount, 0);
      setMonthlyIncome(monthlyIncome);

    } catch (error: any) {
      toast.error('Erro ao carregar dados financeiros');
      console.error('Error fetching financial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addExpense = async (expenseData: Omit<Expense, 'id'>) => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
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
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Despesa adicionada com sucesso!');
      await fetchAllData(); // Recarregar dados
    } catch (error: any) {
      toast.error('Erro ao adicionar despesa');
      console.error('Error adding expense:', error);
    }
  };

  const deleteExpense = async (expenseId: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId)
        .eq('user_id', userId);

      if (error) throw error;

      toast.success('Despesa excluída com sucesso!');
      await fetchAllData(); // Recarregar dados
    } catch (error: any) {
      toast.error('Erro ao excluir despesa');
      console.error('Error deleting expense:', error);
    }
  };

  // Cálculos
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
    setGoals,
    setMonthlyIncome,
    setIncomes,
    refreshData: fetchAllData
  };
};
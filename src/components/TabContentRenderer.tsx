
import React from 'react';
import ExpenseForm from './ExpenseForm';
import DashboardContent from './DashboardContent';
import SupabaseOnlyNotice from './SupabaseOnlyNotice';
import { Goal, Income, Expense } from '@/types/financial';
import { groupInstallmentsByPurchase } from '@/utils/installmentUtils';

interface TabContentRendererProps {
  activeTab: string;
  expenses: Expense[];
  goals: Goal[];
  incomes: Income[];
  monthlyIncome: number;
  totalIncome: number;
  totalExtraIncome: number;
  totalExpenses: number;
  remainingBalance: number;
  onAddExpense: (expense: any) => void;
  onDeleteExpense: (expenseId: string) => void;
  onSetGoals: (goals: Goal[]) => void;
  onSetMonthlyIncome: (income: number) => void;
  onSetIncomes: (incomes: Income[]) => void;
}

const TabContentRenderer: React.FC<TabContentRendererProps> = ({
  activeTab,
  expenses,
  goals,
  incomes,
  monthlyIncome,
  totalIncome,
  totalExtraIncome,
  totalExpenses,
  remainingBalance,
  onAddExpense,
  onDeleteExpense,
  onSetGoals,
  onSetMonthlyIncome,
  onSetIncomes
}) => {
  // Processar dados de parcelas para o histórico
  const installmentGroups = groupInstallmentsByPurchase(expenses);
  const installmentPurchases = Object.values(installmentGroups);

  switch (activeTab) {
    case 'add':
      return <ExpenseForm onAddExpense={onAddExpense} />;
    case 'charts':
      return <SupabaseOnlyNotice featureName="Gráficos e Relatórios" />;
    case 'goals':
      return <SupabaseOnlyNotice featureName="Metas Financeiras" />;
    case 'alerts':
      return <SupabaseOnlyNotice featureName="Alertas Inteligentes" />;
    case 'education':
      return <SupabaseOnlyNotice featureName="Educação Financeira" />;
    case 'income':
      return <SupabaseOnlyNotice featureName="Controle de Receitas" />;
    case 'installments':
      return <SupabaseOnlyNotice featureName="Controle de Parcelas" />;
    case 'budget':
      return <SupabaseOnlyNotice featureName="Orçamento Mensal" />;
    case 'credit-card':
      return <SupabaseOnlyNotice featureName="Fatura do Cartão" />;
    default:
      return (
        <DashboardContent
          totalIncome={totalIncome}
          monthlyIncome={monthlyIncome}
          totalExtraIncome={totalExtraIncome}
          totalExpenses={totalExpenses}
          remainingBalance={remainingBalance}
          expenses={expenses}
          goals={goals}
          onDeleteExpense={onDeleteExpense}
        />
      );
  }
};

export default TabContentRenderer;

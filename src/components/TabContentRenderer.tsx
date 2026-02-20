
import React from 'react';
import ExpenseForm from './ExpenseForm';
import DashboardContent from './DashboardContent';
import InstallmentsSection from './InstallmentsSection';
import GoalsSection from './GoalsSection';
import IncomeSection from './IncomeSection';
import BudgetSection from './BudgetSection';
import CreditCardBilling from './CreditCardBilling';
import AlertsSection from './AlertsSection';
import EducationSection from './EducationSection';
import ExpenseChart from './ExpenseChart';
import { Goal, Income, Expense } from '@/types/financial';

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
  switch (activeTab) {
    case 'add':
      return <ExpenseForm onAddExpense={onAddExpense} />;
    case 'charts':
      return <ExpenseChart expenses={expenses as any} />;
    case 'goals':
      return <GoalsSection goals={goals as any} setGoals={onSetGoals as any} />;
    case 'alerts':
      return <AlertsSection expenses={expenses as any} goals={goals as any} monthlyIncome={monthlyIncome} />;
    case 'education':
      return <EducationSection />;
    case 'income':
      return <IncomeSection monthlyIncome={monthlyIncome} setMonthlyIncome={onSetMonthlyIncome} incomes={incomes as any} setIncomes={onSetIncomes as any} />;
    case 'installments':
      return <InstallmentsSection expenses={expenses} onDeleteExpense={onDeleteExpense as any} />;
    case 'budget':
      return <BudgetSection expenses={expenses as any} monthlyIncome={monthlyIncome} />;
    case 'credit-card':
      return <CreditCardBilling expenses={expenses as any} />;
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

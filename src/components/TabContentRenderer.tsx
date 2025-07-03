
import React from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseChart from './ExpenseChart';
import GoalsSection from './GoalsSection';
import AlertsSection from './AlertsSection';
import EducationSection from './EducationSection';
import IncomeSection from './IncomeSection';
import InstallmentsSection from './InstallmentsSection';
import BudgetSection from './BudgetSection';
import CreditCardBilling from './CreditCardBilling';
import DashboardContent from './DashboardContent';
import PurchaseHistoryTable from './PurchaseHistoryTable';
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
  onDeleteExpense: (expenseId: number) => void;
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
      return <ExpenseChart expenses={expenses} />;
    case 'goals':
      return <GoalsSection goals={goals} setGoals={onSetGoals} />;
    case 'alerts':
      return <AlertsSection expenses={expenses} goals={goals} monthlyIncome={totalIncome} />;
    case 'education':
      return <EducationSection />;
    case 'income':
      return (
        <IncomeSection 
          monthlyIncome={monthlyIncome} 
          setMonthlyIncome={onSetMonthlyIncome}
          incomes={incomes}
          setIncomes={onSetIncomes}
        />
      );
    case 'installments':
      return (
        <div className="space-y-6">
          <InstallmentsSection
            expenses={expenses}
            onDeleteExpense={onDeleteExpense}
          />
          <PurchaseHistoryTable 
            installmentPurchases={installmentPurchases} 
          />
        </div>
      );
    case 'budget':
      return <BudgetSection expenses={expenses} monthlyIncome={totalIncome} />;
    case 'credit-card':
      return <CreditCardBilling expenses={expenses} />;
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

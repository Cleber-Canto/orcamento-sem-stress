
import React from 'react';
import FinancialSummaryCards from './FinancialSummaryCards';
import RecentExpensesList from './RecentExpensesList';
import GoalsProgress from './GoalsProgress';
import { Goal, Expense } from '@/types/financial';

interface DashboardContentProps {
  totalIncome: number;
  monthlyIncome: number;
  totalExtraIncome: number;
  totalExpenses: number;
  remainingBalance: number;
  expenses: Expense[];
  goals: Goal[];
  onDeleteExpense: (expenseId: number) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  totalIncome,
  monthlyIncome,
  totalExtraIncome,
  totalExpenses,
  remainingBalance,
  expenses,
  goals,
  onDeleteExpense
}) => {
  return (
    <div className="space-y-6">
      <FinancialSummaryCards
        totalIncome={totalIncome}
        monthlyIncome={monthlyIncome}
        totalExtraIncome={totalExtraIncome}
        totalExpenses={totalExpenses}
        remainingBalance={remainingBalance}
      />
      <RecentExpensesList expenses={expenses} onDeleteExpense={onDeleteExpense} />
      <GoalsProgress goals={goals} />
    </div>
  );
};

export default DashboardContent;

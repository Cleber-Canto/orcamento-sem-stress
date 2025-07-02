
import React, { useState, useEffect } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseChart from './ExpenseChart';
import GoalsSection from './GoalsSection';
import AlertsSection from './AlertsSection';
import EducationSection from './EducationSection';
import IncomeSection from './IncomeSection';
import InstallmentsSection from './InstallmentsSection';
import BudgetSection from './BudgetSection';
import FinancialSummaryCards from './FinancialSummaryCards';
import RecentExpensesList from './RecentExpensesList';
import GoalsProgress from './GoalsProgress';
import NavigationTabs from './NavigationTabs';

interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  type: 'save' | 'limit';
}

interface Income {
  id: number;
  description: string;
  amount: number;
  type: 'salary' | 'extra' | 'investment' | 'freelance' | 'bonus';
  date: string;
  isRecurring: boolean;
}

interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod?: string;
  isInstallment?: boolean;
  installments?: number;
  installmentNumber?: number;
  totalInstallments?: number;
  isRecurring?: boolean;
  recurringFrequency?: string;
  notes?: string;
}

const FinancialDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Carrega dados do localStorage ou usa valores padrão
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

  // Salva dados no localStorage sempre que mudarem
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

  const renderTabContent = () => {
    switch (activeTab) {
      case 'add':
        return <ExpenseForm onAddExpense={addExpense} />;
      case 'charts':
        return <ExpenseChart expenses={expenses} />;
      case 'goals':
        return <GoalsSection goals={goals} setGoals={setGoals} />;
      case 'alerts':
        return <AlertsSection expenses={expenses} goals={goals} monthlyIncome={totalIncome} />;
      case 'education':
        return <EducationSection />;
      case 'income':
        return <IncomeSection 
          monthlyIncome={monthlyIncome} 
          setMonthlyIncome={setMonthlyIncome}
          incomes={incomes}
          setIncomes={setIncomes}
        />;
      case 'installments':
        return <InstallmentsSection expenses={expenses} onDeleteExpense={deleteExpense} />;
      case 'budget':
        return <BudgetSection expenses={expenses} monthlyIncome={totalIncome} />;
      default:
        return (
          <div className="space-y-6">
            <FinancialSummaryCards
              totalIncome={totalIncome}
              monthlyIncome={monthlyIncome}
              totalExtraIncome={totalExtraIncome}
              totalExpenses={totalExpenses}
              remainingBalance={remainingBalance}
            />
            <RecentExpensesList expenses={expenses} onDeleteExpense={deleteExpense} />
            <GoalsProgress goals={goals} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Controle Financeiro Inteligente</h1>
          <p className="text-gray-600">Organize suas finanças e alcance seus objetivos</p>
        </div>

        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
      </div>
    </div>
  );
};

export default FinancialDashboard;

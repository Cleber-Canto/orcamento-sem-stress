
import React, { useState } from 'react';
import NavigationTabs from './NavigationTabs';
import TabContentRenderer from './TabContentRenderer';
import UserHeader from './UserHeader';
import { useFinancialData } from '@/hooks/useFinancialData';
import { useAuth } from '@/hooks/useAuth';

const FinancialDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();
  
  const {
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
  } = useFinancialData();

  // Log para debug
  console.log('📊 FinancialDashboard - Usuário logado:', user?.email);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto p-4 max-w-6xl">
        {/* Header do usuário com botão de logout */}
        <UserHeader />
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Controle Financeiro Inteligente
          </h1>
          <p className="text-gray-600">
            Organize suas finanças e alcance seus objetivos, {user?.name}!
          </p>
        </div>

        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <TabContentRenderer
          activeTab={activeTab}
          expenses={expenses}
          goals={goals}
          incomes={incomes}
          monthlyIncome={monthlyIncome}
          totalIncome={totalIncome}
          totalExtraIncome={totalExtraIncome}
          totalExpenses={totalExpenses}
          remainingBalance={remainingBalance}
          onAddExpense={addExpense}
          onDeleteExpense={deleteExpense}
          onSetGoals={setGoals}
          onSetMonthlyIncome={setMonthlyIncome}
          onSetIncomes={setIncomes}
        />
      </div>
    </div>
  );
};

export default FinancialDashboard;

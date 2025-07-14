import React, { useState } from 'react';
import NavigationTabs from './NavigationTabs';
import TabContentRenderer from './TabContentRenderer';
import UserHeader from './UserHeader';
import { useAuth } from '@/hooks/useAuth';
import { useFinancialData } from '@/hooks/useFinancialData';

const FinancialDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const { user, logout } = useAuth();
  const { 
    expenses, 
    goals, 
    incomes, 
    monthlyIncome, 
    totalExtraIncome, 
    totalIncome, 
    totalExpenses, 
    remainingBalance,
    addExpense,
    deleteExpense,
    setGoals,
    setMonthlyIncome,
    setIncomes
  } = useFinancialData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <UserHeader 
          user={{ 
            name: user?.name || 'Usuário', 
            email: user?.email || '' 
          }} 
          onLogout={logout} 
        />
        
        <div className="mt-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Bem-vindo, {user?.name || 'Usuário'}!
          </h1>
          
          <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="mt-6">
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
      </div>
    </div>
  );
};

export default FinancialDashboard;
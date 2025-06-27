
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, TrendingUp, AlertTriangle, Target, BookOpen, DollarSign } from 'lucide-react';
import ExpenseForm from './ExpenseForm';
import ExpenseChart from './ExpenseChart';
import GoalsSection from './GoalsSection';
import AlertsSection from './AlertsSection';
import EducationSection from './EducationSection';

const FinancialDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Alimentação', amount: 45.50, date: '2024-01-15', description: 'Almoço' },
    { id: 2, category: 'Transporte', amount: 12.00, date: '2024-01-15', description: 'Uber' },
    { id: 3, category: 'Mercado', amount: 120.00, date: '2024-01-14', description: 'Compras semanais' },
  ]);

  const [goals, setGoals] = useState([
    { id: 1, name: 'Emergência', target: 500, current: 150, type: 'save' },
    { id: 2, name: 'Delivery', target: 300, current: 280, type: 'limit' },
  ]);

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const monthlyIncome = 2500; // Valor exemplo
  const remainingBalance = monthlyIncome - totalExpenses;

  const addExpense = (expense: any) => {
    setExpenses([...expenses, { ...expense, id: Date.now() }]);
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
        return <AlertsSection expenses={expenses} goals={goals} monthlyIncome={monthlyIncome} />;
      case 'education':
        return <EducationSection />;
      default:
        return (
          <div className="space-y-6">
            {/* Resumo Financeiro */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Renda Mensal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-800">R$ {monthlyIncome.toFixed(2)}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Gastos Totais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-800">R$ {totalExpenses.toFixed(2)}</div>
                </CardContent>
              </Card>
              
              <Card className={`bg-gradient-to-br ${remainingBalance >= 0 ? 'from-green-50 to-green-100 border-green-200' : 'from-red-50 to-red-100 border-red-200'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className={`text-sm font-medium ${remainingBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                    Saldo Restante
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${remainingBalance >= 0 ? 'text-green-800' : 'text-red-800'}`}>
                    R$ {remainingBalance.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Últimas Despesas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Últimas Despesas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expenses.slice(-5).reverse().map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-sm text-gray-600">{expense.category} • {new Date(expense.date).toLocaleDateString()}</div>
                      </div>
                      <div className="font-bold text-red-600">-R$ {expense.amount.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Progresso das Metas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Suas Metas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{goal.name}</span>
                        <span className="text-sm text-gray-600">
                          R$ {goal.current.toFixed(2)} / R$ {goal.target.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${goal.type === 'save' ? 'bg-green-500' : 'bg-blue-500'}`}
                          style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {((goal.current / goal.target) * 100).toFixed(1)}% concluído
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
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

        {/* Navegação */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'outline'}
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'add' ? 'default' : 'outline'}
            onClick={() => setActiveTab('add')}
            className="flex items-center gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Adicionar Gasto
          </Button>
          <Button
            variant={activeTab === 'charts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('charts')}
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Gráficos
          </Button>
          <Button
            variant={activeTab === 'goals' ? 'default' : 'outline'}
            onClick={() => setActiveTab('goals')}
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" />
            Metas
          </Button>
          <Button
            variant={activeTab === 'alerts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('alerts')}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Alertas
          </Button>
          <Button
            variant={activeTab === 'education' ? 'default' : 'outline'}
            onClick={() => setActiveTab('education')}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Educação
          </Button>
        </div>

        {/* Conteúdo */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default FinancialDashboard;

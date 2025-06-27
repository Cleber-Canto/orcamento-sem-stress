
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, TrendingUp, AlertTriangle, Target, BookOpen, DollarSign, Wallet } from 'lucide-react';
import ExpenseForm from './ExpenseForm';
import ExpenseChart from './ExpenseChart';
import GoalsSection from './GoalsSection';
import AlertsSection from './AlertsSection';
import EducationSection from './EducationSection';
import IncomeSection from './IncomeSection';

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

  // Análise de parcelas por mês
  const getInstallmentsByMonth = () => {
    const installmentExpenses = expenses.filter(expense => expense.isInstallment && expense.installmentNumber && expense.totalInstallments);
    const installmentsByMonth: { [key: string]: Expense[] } = {};
    
    installmentExpenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      const monthKey = `${expenseDate.getFullYear()}-${String(expenseDate.getMonth() + 1).padStart(2, '0')}`;
      
      if (!installmentsByMonth[monthKey]) {
        installmentsByMonth[monthKey] = [];
      }
      installmentsByMonth[monthKey].push(expense);
    });
    
    return installmentsByMonth;
  };

  const addExpense = (expense: any) => {
    setExpenses([...expenses, { ...expense, id: Date.now() + Math.random() }]);
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
      default:
        return (
          <div className="space-y-6">
            {/* Resumo Financeiro Melhorado */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Renda Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-800">R$ {totalIncome.toFixed(2)}</div>
                  {totalExtraIncome > 0 && (
                    <div className="text-xs text-green-600 mt-1">
                      Base: R$ {monthlyIncome.toFixed(2)} + Extra: R$ {totalExtraIncome.toFixed(2)}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Gastos Totais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-800">R$ {totalExpenses.toFixed(2)}</div>
                  <div className="text-xs text-red-600 mt-1">
                    {((totalExpenses / totalIncome) * 100).toFixed(1)}% da renda
                  </div>
                </CardContent>
              </Card>
              
              <Card className={`bg-gradient-to-br ${remainingBalance >= 0 ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-red-50 to-red-100 border-red-200'}`}>
                <CardHeader className="pb-2">
                  <CardTitle className={`text-sm font-medium ${remainingBalance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
                    Saldo Restante
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${remainingBalance >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
                    R$ {remainingBalance.toFixed(2)}
                  </div>
                  <div className={`text-xs mt-1 ${remainingBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {remainingBalance >= 0 ? 'Sobrou dinheiro' : 'Gastou mais que ganhou'}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-purple-700">Taxa de Poupança</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-800">
                    {totalIncome > 0 ? ((remainingBalance / totalIncome) * 100).toFixed(1) : '0.0'}%
                  </div>
                  <div className="text-xs text-purple-600 mt-1">
                    {remainingBalance >= totalIncome * 0.2 ? '🎉 Excelente!' : 
                     remainingBalance >= totalIncome * 0.1 ? '👍 Boa!' : '⚠️ Tente economizar mais'}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controle de Parcelas por Mês */}
            {Object.keys(getInstallmentsByMonth()).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Parcelas por Mês
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(getInstallmentsByMonth()).map(([month, monthExpenses]) => {
                      const monthTotal = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
                      return (
                        <div key={month} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">
                              {new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                            </span>
                            <span className="font-bold text-red-600">R$ {monthTotal.toFixed(2)}</span>
                          </div>
                          <div className="space-y-1">
                            {monthExpenses.map(expense => (
                              <div key={expense.id} className="text-sm text-gray-600 flex justify-between">
                                <span>{expense.description} ({expense.installmentNumber}/{expense.totalInstallments})</span>
                                <span>R$ {expense.amount.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

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
                  {expenses.slice(-8).reverse().map((expense) => (
                    <div key={expense.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <span>{expense.category}</span>
                          {expense.paymentMethod && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                {expense.paymentMethod === 'Cartão de Crédito' && '💳'}
                                {expense.paymentMethod === 'Débito Automático' && '🔄'}
                                {expense.paymentMethod === 'PIX' && '📱'}
                                {expense.paymentMethod}
                              </span>
                            </>
                          )}
                          <span>•</span>
                          <span>{new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                        {expense.installmentNumber && expense.totalInstallments && (
                          <div className="text-xs text-blue-600 mt-1">
                            Parcela {expense.installmentNumber}/{expense.totalInstallments}
                          </div>
                        )}
                        {expense.notes && (
                          <div className="text-xs text-gray-500 mt-1">
                            {expense.notes}
                          </div>
                        )}
                      </div>
                      <div className="font-bold text-red-600 ml-4">
                        -R$ {expense.amount.toFixed(2)}
                      </div>
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
            variant={activeTab === 'income' ? 'default' : 'outline'}
            onClick={() => setActiveTab('income')}
            className="flex items-center gap-2"
          >
            <Wallet className="h-4 w-4" />
            Renda
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

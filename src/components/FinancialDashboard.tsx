import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, CreditCard, Target, Calendar, BookOpen, AlertTriangle, PieChart } from 'lucide-react';
import ExpenseForm from './ExpenseForm';
import ExpenseChart from './ExpenseChart';
import IncomeSection from './IncomeSection';
import GoalsSection from './GoalsSection';
import InstallmentsSection from './InstallmentsSection';
import BudgetSection from './BudgetSection';
import AlertsSection from './AlertsSection';
import EducationSection from './EducationSection';
import AuthGuard from './AuthGuard';

interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
}

interface Purchase {
  id: number;
  item: string;
  totalAmount: number;
  installments: number;
  purchaseDate: string;
  firstInstallmentDate: string;
  category: string;
  paymentMethod: string;
  description?: string;
}

// Updated Goal interface to match GoalsSection expectations
interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  type: 'save' | 'limit';
}

const FinancialDashboard = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [purchases, setPurchases] = useState<Purchase[]>(() => {
    const saved = localStorage.getItem('purchases');
    return saved ? JSON.parse(saved) : [];
  });

  const [monthlyIncome, setMonthlyIncome] = useState(() => {
    const saved = localStorage.getItem('monthly-income');
    return saved ? parseFloat(saved) : 0;
  });

  const [incomes, setIncomes] = useState(() => {
    const saved = localStorage.getItem('incomes');
    return saved ? JSON.parse(saved) : [];
  });

  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('goals');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'expenses') {
        setExpenses(e.newValue ? JSON.parse(e.newValue) : []);
      } else if (e.key === 'purchases') {
        setPurchases(e.newValue ? JSON.parse(e.newValue) : []);
      } else if (e.key === 'monthly-income') {
        setMonthlyIncome(e.newValue ? parseFloat(e.newValue) : 0);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('monthly-income', monthlyIncome.toString());
  }, [monthlyIncome]);

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: Date.now() };
    setExpenses([...expenses, newExpense]);
  };

  const deleteExpense = (id: number) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const addPurchase = (purchase: Omit<Purchase, 'id'>) => {
    const newPurchase = { ...purchase, id: Date.now() };
    setPurchases([...purchases, newPurchase]);
  };

  const deletePurchase = (id: number) => {
    setPurchases(purchases.filter(purchase => purchase.id !== id));
  };

  const updatePurchase = (id: number, updatedPurchase: Partial<Purchase>) => {
    setPurchases(purchases.map(purchase => 
      purchase.id === id ? { ...purchase, ...updatedPurchase } : purchase
    ));
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyExpenses = expenses
    .filter(expense => expense.date.startsWith(currentMonth))
    .reduce((sum, expense) => sum + expense.amount, 0);

  const remainingBudget = monthlyIncome - monthlyExpenses;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Renda Mensal</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {monthlyIncome.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gastos do Mês</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {monthlyExpenses.toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Restante</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {remainingBudget.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ {totalExpenses.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="expenses" className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="expenses">Gastos</TabsTrigger>
              <TabsTrigger value="budget">
                <PieChart className="h-4 w-4 mr-1" />
                Orçamento
              </TabsTrigger>
              <TabsTrigger value="income">Renda</TabsTrigger>
              <TabsTrigger value="installments">Parcelas</TabsTrigger>
              <TabsTrigger value="goals">Metas</TabsTrigger>
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
              <TabsTrigger value="education">Educação</TabsTrigger>
            </TabsList>

            <TabsContent value="expenses" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExpenseForm onAddExpense={addExpense} />
                <ExpenseChart expenses={expenses} />
              </div>
            </TabsContent>

            <TabsContent value="budget">
              <BudgetSection expenses={expenses} monthlyIncome={monthlyIncome} />
            </TabsContent>

            <TabsContent value="income">
              <IncomeSection 
                monthlyIncome={monthlyIncome}
                setMonthlyIncome={setMonthlyIncome}
                incomes={incomes}
                setIncomes={setIncomes}
              />
            </TabsContent>

            <TabsContent value="installments">
              <InstallmentsSection 
                expenses={expenses}
                onDeleteExpense={deleteExpense}
              />
            </TabsContent>

            <TabsContent value="goals">
              <GoalsSection 
                goals={goals}
                setGoals={setGoals}
              />
            </TabsContent>

            <TabsContent value="alerts">
              <AlertsSection 
                expenses={expenses} 
                monthlyIncome={monthlyIncome}
                goals={goals}
              />
            </TabsContent>

            <TabsContent value="education">
              <EducationSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AuthGuard>
  );
};

export default FinancialDashboard;

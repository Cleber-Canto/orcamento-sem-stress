
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BudgetForm from './BudgetForm';
import BudgetSummary from './BudgetSummary';
import BudgetAlerts from './BudgetAlerts';
import BudgetAnalysis from './BudgetAnalysis';
import BudgetCategories from './BudgetCategories';
import BudgetPieChart from './BudgetPieChart';

interface BudgetCategory {
  id: number;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  month: string;
  priority: 'essential' | 'important' | 'optional';
}

interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
}

interface BudgetSectionProps {
  expenses: Expense[];
  monthlyIncome: number;
}

const BudgetSection: React.FC<BudgetSectionProps> = ({ expenses, monthlyIncome }) => {
  const { toast } = useToast();
  
  const [budgetCategories, setBudgetCategories] = useState<BudgetCategory[]>(() => {
    const saved = localStorage.getItem('budget-categories');
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  });

  useEffect(() => {
    localStorage.setItem('budget-categories', JSON.stringify(budgetCategories));
  }, [budgetCategories]);

  const calculateSpentByCategory = (category: string) => {
    const [year, month] = selectedMonth.split('-');
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getFullYear() === parseInt(year) &&
               expenseDate.getMonth() === parseInt(month) - 1 &&
               expense.category === category;
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const currentBudget = budgetCategories.map(budget => ({
    ...budget,
    spentAmount: calculateSpentByCategory(budget.category)
  }));

  const addBudgetCategory = (categoryData: Omit<BudgetCategory, 'id' | 'spentAmount'>) => {
    const newBudget: BudgetCategory = {
      id: Date.now(),
      ...categoryData,
      spentAmount: calculateSpentByCategory(categoryData.category)
    };

    setBudgetCategories([...budgetCategories, newBudget]);
  };

  const deleteBudgetCategory = (id: number) => {
    setBudgetCategories(budgetCategories.filter(budget => budget.id !== id));
    toast({
      title: "Orçamento removido",
      description: "Categoria removida do orçamento"
    });
  };

  const totalBudget = currentBudget.reduce((sum, budget) => sum + budget.budgetAmount, 0);
  const totalSpent = currentBudget.reduce((sum, budget) => sum + budget.spentAmount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetUsagePercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Controle de Orçamento Inteligente</h2>
          <p className="text-gray-600">Visualize e controle seus gastos com gráfico de pizza</p>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <Label htmlFor="month-select">Mês</Label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 12 }, (_, i) => {
                  const date = new Date(2025, i);
                  const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                  return (
                    <SelectItem key={value} value={value}>
                      {date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          
          <BudgetForm onAddCategory={addBudgetCategory} selectedMonth={selectedMonth} />
        </div>
      </div>

      <BudgetSummary 
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        remainingBudget={remainingBudget}
        monthlyIncome={monthlyIncome}
        budgetUsagePercentage={budgetUsagePercentage}
      />

      <BudgetPieChart 
        budgetCategories={currentBudget}
        monthlyIncome={monthlyIncome}
      />

      <BudgetAlerts budgetCategories={currentBudget} />

      <BudgetCategories 
        budgetCategories={currentBudget}
        onDeleteCategory={deleteBudgetCategory}
      />

      <BudgetAnalysis 
        budgetCategories={currentBudget}
        monthlyIncome={monthlyIncome}
        selectedMonth={selectedMonth}
      />
    </div>
  );
};

export default BudgetSection;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, AlertTriangle, Plus, Edit, Trash2, DollarSign } from 'lucide-react';
import BudgetAnalysis from './BudgetAnalysis';
import BudgetCategories from './BudgetCategories';

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

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({
    category: '',
    budgetAmount: 0,
    priority: 'important' as const
  });

  // Salvar no localStorage
  useEffect(() => {
    localStorage.setItem('budget-categories', JSON.stringify(budgetCategories));
  }, [budgetCategories]);

  // Calcular gastos por categoria no mês selecionado
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

  // Atualizar valores gastos automaticamente
  const currentBudget = budgetCategories.map(budget => ({
    ...budget,
    spentAmount: calculateSpentByCategory(budget.category)
  }));

  const addBudgetCategory = () => {
    if (!newCategory.category || newCategory.budgetAmount <= 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos corretamente",
        variant: "destructive"
      });
      return;
    }

    const newBudget: BudgetCategory = {
      id: Date.now(),
      category: newCategory.category,
      budgetAmount: newCategory.budgetAmount,
      spentAmount: calculateSpentByCategory(newCategory.category),
      month: selectedMonth,
      priority: newCategory.priority
    };

    setBudgetCategories([...budgetCategories, newBudget]);
    setNewCategory({ category: '', budgetAmount: 0, priority: 'important' });
    setIsAddingCategory(false);

    toast({
      title: "Orçamento adicionado",
      description: `Meta para ${newCategory.category}: R$ ${newCategory.budgetAmount.toFixed(2)}`
    });
  };

  const deleteBudgetCategory = (id: number) => {
    setBudgetCategories(budgetCategories.filter(budget => budget.id !== id));
    toast({
      title: "Orçamento removido",
      description: "Categoria removida do orçamento"
    });
  };

  // Estatísticas gerais
  const totalBudget = currentBudget.reduce((sum, budget) => sum + budget.budgetAmount, 0);
  const totalSpent = currentBudget.reduce((sum, budget) => sum + budget.spentAmount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetUsagePercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Categorias com problemas
  const overdraftCategories = currentBudget.filter(budget => budget.spentAmount > budget.budgetAmount);
  const nearLimitCategories = currentBudget.filter(budget => 
    budget.spentAmount > budget.budgetAmount * 0.8 && budget.spentAmount <= budget.budgetAmount
  );

  const availableCategories = [
    'Alimentação', 'Transporte', 'Mercado', 'Saúde', 'Educação', 'Lazer',
    'Roupas', 'Casa', 'Débito Automático', 'Impostos', 'Investimentos', 'Outros'
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Orçamento Mensal</h2>
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
          
          <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Categoria
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Categoria de Orçamento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={newCategory.category} onValueChange={(value) => setNewCategory({...newCategory, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="budget-amount">Valor do Orçamento (R$)</Label>
                  <Input
                    id="budget-amount"
                    type="number"
                    step="0.01"
                    value={newCategory.budgetAmount}
                    onChange={(e) => setNewCategory({...newCategory, budgetAmount: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select value={newCategory.priority} onValueChange={(value: 'essential' | 'important' | 'optional') => setNewCategory({...newCategory, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="essential">🔴 Essencial</SelectItem>
                      <SelectItem value="important">🟡 Importante</SelectItem>
                      <SelectItem value="optional">🟢 Opcional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsAddingCategory(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={addBudgetCategory}>
                    Adicionar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Orçamento Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">R$ {totalBudget.toFixed(2)}</div>
            <div className="text-xs text-blue-600 mt-1">
              {totalBudget > 0 ? ((totalBudget / monthlyIncome) * 100).toFixed(1) : '0'}% da renda
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Gasto Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800">R$ {totalSpent.toFixed(2)}</div>
            <div className="text-xs text-red-600 mt-1">
              {budgetUsagePercentage.toFixed(1)}% do orçamento
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${remainingBudget >= 0 ? 'from-green-50 to-green-100 border-green-200' : 'from-red-50 to-red-100 border-red-200'}`}>
          <CardHeader className="pb-2">
            <CardTitle className={`text-sm font-medium ${remainingBudget >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              Saldo do Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-800' : 'text-red-800'}`}>
              R$ {remainingBudget.toFixed(2)}
            </div>
            <div className={`text-xs mt-1 ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {remainingBudget >= 0 ? 'Dentro do orçamento' : 'Acima do orçamento'}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Taxa de Economia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">
              {monthlyIncome > 0 ? (((monthlyIncome - totalSpent) / monthlyIncome) * 100).toFixed(1) : '0.0'}%
            </div>
            <div className="text-xs text-purple-600 mt-1">
              R$ {(monthlyIncome - totalSpent).toFixed(2)} economizados
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas */}
      {(overdraftCategories.length > 0 || nearLimitCategories.length > 0) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertTriangle className="h-5 w-5" />
              Alertas de Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overdraftCategories.length > 0 && (
              <div className="mb-3">
                <h4 className="font-medium text-red-700 mb-2">🚨 Orçamento Estourado:</h4>
                <div className="space-y-1">
                  {overdraftCategories.map(budget => (
                    <div key={budget.id} className="text-sm text-red-600">
                      {budget.category}: R$ {budget.spentAmount.toFixed(2)} / R$ {budget.budgetAmount.toFixed(2)} 
                      (+R$ {(budget.spentAmount - budget.budgetAmount).toFixed(2)})
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {nearLimitCategories.length > 0 && (
              <div>
                <h4 className="font-medium text-orange-700 mb-2">⚠️ Próximo do Limite:</h4>
                <div className="space-y-1">
                  {nearLimitCategories.map(budget => (
                    <div key={budget.id} className="text-sm text-orange-600">
                      {budget.category}: R$ {budget.spentAmount.toFixed(2)} / R$ {budget.budgetAmount.toFixed(2)}
                      ({((budget.spentAmount / budget.budgetAmount) * 100).toFixed(0)}%)
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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

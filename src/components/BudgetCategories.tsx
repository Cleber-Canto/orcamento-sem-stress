
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash2, TrendingUp, TrendingDown, Target } from 'lucide-react';

interface BudgetCategory {
  id: string | number;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  month: string;
  priority: 'essential' | 'important' | 'optional';
}

interface BudgetCategoriesProps {
  budgetCategories: BudgetCategory[];
  onDeleteCategory: (id: string | number) => void;
}

const BudgetCategories: React.FC<BudgetCategoriesProps> = ({ 
  budgetCategories, 
  onDeleteCategory 
}) => {
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'essential': return '🔴';
      case 'important': return '🟡';
      case 'optional': return '🟢';
      default: return '⚪';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'essential': return 'border-red-200 bg-red-50';
      case 'important': return 'border-yellow-200 bg-yellow-50';
      case 'optional': return 'border-green-200 bg-green-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getUsageStatus = (spent: number, budget: number) => {
    const percentage = budget > 0 ? (spent / budget) * 100 : 0;
    
    if (percentage > 100) {
      return {
        status: 'exceeded',
        color: 'text-red-600',
        bgColor: 'bg-red-500',
        icon: <TrendingDown className="h-4 w-4 text-red-500" />
      };
    } else if (percentage > 80) {
      return {
        status: 'warning',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-500',
        icon: <TrendingUp className="h-4 w-4 text-yellow-500" />
      };
    } else {
      return {
        status: 'good',
        color: 'text-green-600',
        bgColor: 'bg-green-500',
        icon: <Target className="h-4 w-4 text-green-500" />
      };
    }
  };

  if (budgetCategories.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum orçamento definido</h3>
          <p className="text-gray-500">
            Comece definindo orçamentos para suas categorias de gastos para ter melhor controle financeiro.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Ordenar por prioridade e depois por nome
  const sortedCategories = [...budgetCategories].sort((a, b) => {
    const priorityOrder = { essential: 0, important: 1, optional: 2 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.category.localeCompare(b.category);
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Categorias do Orçamento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCategories.map((budget) => {
            const usagePercentage = budget.budgetAmount > 0 ? (budget.spentAmount / budget.budgetAmount) * 100 : 0;
            const remaining = budget.budgetAmount - budget.spentAmount;
            const usageStatus = getUsageStatus(budget.spentAmount, budget.budgetAmount);

            return (
              <div 
                key={budget.id} 
                className={`p-4 rounded-lg border ${getPriorityColor(budget.priority)}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getPriorityIcon(budget.priority)}</span>
                      <h4 className="font-medium text-gray-800">{budget.category}</h4>
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {budget.priority === 'essential' ? 'Essencial' :
                       budget.priority === 'important' ? 'Importante' : 'Opcional'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {usageStatus.icon}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteCategory(budget.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Orçamento</span>
                    <span className="font-medium">R$ {budget.budgetAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Gasto</span>
                    <span className={`font-medium ${usageStatus.color}`}>
                      R$ {budget.spentAmount.toFixed(2)}
                    </span>
                  </div>

                  <Progress 
                    value={Math.min(usagePercentage, 100)} 
                    className="h-2"
                  />

                  <div className="flex justify-between items-center text-xs">
                    <span className={usageStatus.color}>
                      {usagePercentage.toFixed(1)}% usado
                    </span>
                    <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {remaining >= 0 ? 'Sobra: ' : 'Excesso: '}
                      R$ {Math.abs(remaining).toFixed(2)}
                    </span>
                  </div>

                  {/* Status da categoria */}
                  <div className={`text-xs p-2 rounded ${
                    usageStatus.status === 'exceeded' ? 'bg-red-100 text-red-700' :
                    usageStatus.status === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {usageStatus.status === 'exceeded' ? '🚨 Orçamento estourado!' :
                     usageStatus.status === 'warning' ? '⚠️ Próximo do limite' :
                     '✅ Dentro do orçamento'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetCategories;

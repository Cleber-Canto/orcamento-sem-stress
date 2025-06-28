
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, Target, TrendingDown } from 'lucide-react';

interface BudgetSummaryProps {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  monthlyIncome: number;
  budgetUsagePercentage: number;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  totalBudget,
  totalSpent,
  remainingBudget,
  monthlyIncome,
  budgetUsagePercentage
}) => {
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - totalSpent) / monthlyIncome) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
            <Target className="h-4 w-4" />
            Orçamento Total
          </CardTitle>
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
          <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Gasto Total
          </CardTitle>
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
          <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Taxa de Economia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-800">
            {savingsRate.toFixed(1)}%
          </div>
          <div className="text-xs text-purple-600 mt-1">
            R$ {(monthlyIncome - totalSpent).toFixed(2)} economizados
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSummary;

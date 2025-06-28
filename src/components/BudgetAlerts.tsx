
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface BudgetCategory {
  id: number;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  month: string;
  priority: 'essential' | 'important' | 'optional';
}

interface BudgetAlertsProps {
  budgetCategories: BudgetCategory[];
}

const BudgetAlerts: React.FC<BudgetAlertsProps> = ({ budgetCategories }) => {
  const overdraftCategories = budgetCategories.filter(budget => budget.spentAmount > budget.budgetAmount);
  const nearLimitCategories = budgetCategories.filter(budget => 
    budget.spentAmount > budget.budgetAmount * 0.8 && budget.spentAmount <= budget.budgetAmount
  );

  if (overdraftCategories.length === 0 && nearLimitCategories.length === 0) {
    return null;
  }

  return (
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
  );
};

export default BudgetAlerts;

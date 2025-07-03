
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Calendar, DollarSign, Eye, EyeOff } from 'lucide-react';
import { groupExpensesByBillingMonth } from '@/utils/creditCardUtils';
import { format, parseISO } from 'date-fns';

interface CreditCardBillingProps {
  expenses: any[];
  defaultCutoffDay?: number;
  defaultDueDay?: number;
}

const CreditCardBilling: React.FC<CreditCardBillingProps> = ({ 
  expenses, 
  defaultCutoffDay = 10, 
  defaultDueDay = 25 
}) => {
  const [expandedBills, setExpandedBills] = useState<string[]>([]);

  const toggleBillExpansion = (monthKey: string) => {
    setExpandedBills(prev => 
      prev.includes(monthKey) 
        ? prev.filter(key => key !== monthKey)
        : [...prev, monthKey]
    );
  };

  // Agrupar despesas de cartão de crédito por mês de vencimento
  const billingGroups = groupExpensesByBillingMonth(expenses, defaultCutoffDay, defaultDueDay);
  
  // Ordenar por mês
  const sortedBillings = Object.entries(billingGroups).sort(([a], [b]) => a.localeCompare(b));

  if (sortedBillings.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma compra no cartão de crédito encontrada</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CreditCard className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Faturas do Cartão de Crédito</h3>
      </div>

      {sortedBillings.map(([monthKey, billingExpenses]) => {
        const totalAmount = billingExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        const dueDate = billingExpenses[0]?.dueDate;
        const isExpanded = expandedBills.includes(monthKey);
        const currentDate = new Date();
        const dueDateObj = parseISO(dueDate);
        const isOverdue = dueDateObj < currentDate;
        const isDueSoon = dueDateObj > currentDate && 
          (dueDateObj.getTime() - currentDate.getTime()) < (7 * 24 * 60 * 60 * 1000); // 7 dias

        return (
          <Card key={monthKey} className={`${isOverdue ? 'border-red-300 bg-red-50' : isDueSoon ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <CardTitle className="text-lg">
                      {format(parseISO(monthKey + '-01'), 'MMMM yyyy')}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Vencimento: {format(dueDateObj, 'dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">
                      R$ {totalAmount.toFixed(2)}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={isOverdue ? 'destructive' : isDueSoon ? 'secondary' : 'default'}>
                        {isOverdue ? 'Vencida' : isDueSoon ? 'Vence em breve' : 'Em dia'}
                      </Badge>
                      <Badge variant="outline">
                        {billingExpenses.length} {billingExpenses.length === 1 ? 'compra' : 'compras'}
                      </Badge>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleBillExpansion(monthKey)}
                  >
                    {isExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>

            {isExpanded && (
              <CardContent>
                <div className="space-y-3">
                  {billingExpenses.map((expense, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{expense.description}</p>
                          {expense.isInstallment && (
                            <Badge variant="outline" className="text-xs">
                              {expense.installmentNumber}/{expense.totalInstallments}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          <span className="mr-4">📅 Compra: {format(parseISO(expense.date), 'dd/MM/yyyy')}</span>
                          <span className="mr-4">🏷️ {expense.category}</span>
                          {expense.notes && <span>📝 {expense.notes}</span>}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-semibold">R$ {expense.amount.toFixed(2)}</div>
                        {expense.originalAmount && expense.originalAmount !== expense.amount && (
                          <div className="text-xs text-gray-500">
                            Total: R$ {expense.originalAmount.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Total da fatura:</span>
                    <span className="font-semibold text-lg">R$ {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default CreditCardBilling;

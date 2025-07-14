
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Trash2 } from 'lucide-react';
import { Expense } from '@/types/financial';

interface RecentExpensesListProps {
  expenses: Expense[];
  onDeleteExpense: (expenseId: string) => void;
}

const RecentExpensesList: React.FC<RecentExpensesListProps> = ({ expenses, onDeleteExpense }) => {
  return (
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
              <div className="flex items-center gap-2">
                <div className="font-bold text-red-600">
                  -R$ {expense.amount.toFixed(2)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDeleteExpense(expense.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentExpensesList;

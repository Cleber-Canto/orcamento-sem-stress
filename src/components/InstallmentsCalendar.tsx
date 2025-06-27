
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { EnhancedInstallment } from '@/types/installments';

interface InstallmentsCalendarProps {
  allInstallments: EnhancedInstallment[];
}

const InstallmentsCalendar: React.FC<InstallmentsCalendarProps> = ({ allInstallments }) => {
  // Agrupar parcelas por mês para cronograma
  const installmentsByMonth = allInstallments.reduce((acc, installment) => {
    const monthKey = installment.date.substring(0, 7); // YYYY-MM
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(installment);
    return acc;
  }, {} as Record<string, EnhancedInstallment[]>);

  const sortedMonths = Object.keys(installmentsByMonth).sort();

  if (sortedMonths.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Cronograma de Parcelas por Mês
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedMonths.map((month) => {
            const monthInstallments = installmentsByMonth[month];
            const monthTotal = monthInstallments.reduce((sum, inst) => sum + inst.amount, 0);
            const monthDate = new Date(month + '-01');
            const currentDate = new Date();
            const isPastMonth = monthDate < new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const paidInstallments = monthInstallments.filter(inst => inst.isPaid);
            const pendingInstallments = monthInstallments.filter(inst => !inst.isPaid);

            return (
              <div key={month} className={`p-4 rounded-lg border ${isPastMonth ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {monthDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                    {isPastMonth && <span className="text-xs bg-gray-200 px-2 py-1 rounded">Passado</span>}
                    {!isPastMonth && <span className="text-xs bg-blue-200 px-2 py-1 rounded">Futuro</span>}
                  </h3>
                  <div className="text-right">
                    <div className="font-bold text-lg">R$ {monthTotal.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">
                      {monthInstallments.length} parcela{monthInstallments.length > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Parcelas Pagas */}
                  {paidInstallments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-green-700 mb-2">✅ Pagas ({paidInstallments.length})</h4>
                      {paidInstallments.map((installment, index) => (
                        <div key={index} className="text-sm p-2 bg-green-50 rounded border-l-4 border-green-400 mb-1">
                          <div className="font-medium">{installment.description}</div>
                          <div className="text-gray-600 flex justify-between">
                            <span>{installment.installmentNumber}/{installment.totalInstallments}</span>
                            <span className="font-semibold">R$ {installment.amount.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Parcelas Pendentes */}
                  {pendingInstallments.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-orange-700 mb-2">⏳ Pendentes ({pendingInstallments.length})</h4>
                      {pendingInstallments.map((installment, index) => (
                        <div key={index} className="text-sm p-2 bg-orange-50 rounded border-l-4 border-orange-400 mb-1">
                          <div className="font-medium">{installment.description}</div>
                          <div className="text-gray-600 flex justify-between">
                            <span>{installment.installmentNumber}/{installment.totalInstallments}</span>
                            <span className="font-semibold">R$ {installment.amount.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default InstallmentsCalendar;

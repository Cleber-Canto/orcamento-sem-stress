
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CreditCard, AlertCircle } from 'lucide-react';

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
  originalAmount?: number;
}

interface InstallmentsSectionProps {
  expenses: Expense[];
}

const InstallmentsSection: React.FC<InstallmentsSectionProps> = ({ expenses }) => {
  // Função para gerar todas as parcelas de uma compra
  const generateInstallmentSchedule = (expense: Expense) => {
    if (!expense.isInstallment || !expense.totalInstallments || !expense.originalAmount) {
      return [];
    }

    const installments = [];
    const baseDate = new Date(expense.date);
    const monthlyAmount = expense.originalAmount / expense.totalInstallments;

    for (let i = 0; i < expense.totalInstallments; i++) {
      const installmentDate = new Date(baseDate);
      installmentDate.setMonth(installmentDate.getMonth() + i);
      
      installments.push({
        ...expense,
        installmentNumber: i + 1,
        amount: monthlyAmount,
        date: installmentDate.toISOString().split('T')[0],
        isPaid: i + 1 <= (expense.installmentNumber || 0)
      });
    }

    return installments;
  };

  // Obter todas as compras parceladas únicas
  const installmentPurchases = expenses.filter(expense => 
    expense.isInstallment && expense.installmentNumber === 1
  );

  // Gerar cronograma completo de todas as parcelas
  const allInstallments = installmentPurchases.flatMap(generateInstallmentSchedule);

  // Agrupar parcelas por mês
  const installmentsByMonth = allInstallments.reduce((acc, installment) => {
    const monthKey = installment.date.substring(0, 7); // YYYY-MM
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(installment);
    return acc;
  }, {} as Record<string, any[]>);

  // Ordenar meses
  const sortedMonths = Object.keys(installmentsByMonth).sort();

  // Calcular totais
  const totalPendingAmount = allInstallments
    .filter(inst => !inst.isPaid)
    .reduce((sum, inst) => sum + inst.amount, 0);

  const totalInstallments = allInstallments.filter(inst => !inst.isPaid).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Controle de Parcelas</h2>
      </div>

      {/* Resumo de Parcelas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Parcelas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{totalInstallments}</div>
            <div className="text-xs text-blue-600 mt-1">parcelas a pagar</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Valor Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">R$ {totalPendingAmount.toFixed(2)}</div>
            <div className="text-xs text-orange-600 mt-1">a pagar no futuro</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Compras Parceladas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">{installmentPurchases.length}</div>
            <div className="text-xs text-purple-600 mt-1">ativas</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Compras Parceladas */}
      {installmentPurchases.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Suas Compras Parceladas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {installmentPurchases.map((purchase) => {
                const installmentSchedule = generateInstallmentSchedule(purchase);
                const paidInstallments = installmentSchedule.filter(inst => inst.isPaid).length;
                const pendingInstallments = installmentSchedule.filter(inst => !inst.isPaid).length;
                
                return (
                  <div key={purchase.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{purchase.description}</h3>
                        <p className="text-sm text-gray-600">
                          {purchase.category} • {purchase.paymentMethod}
                        </p>
                        <p className="text-sm text-gray-600">
                          Compra realizada em: {new Date(purchase.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-blue-600">
                          R$ {purchase.originalAmount?.toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {purchase.totalInstallments}x de R$ {(purchase.originalAmount! / purchase.totalInstallments!).toFixed(2)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Pagas: {paidInstallments}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">Pendentes: {pendingInstallments}</span>
                      </div>
                    </div>

                    {/* Barra de Progresso */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(paidInstallments / purchase.totalInstallments!) * 100}%` }}
                      ></div>
                    </div>

                    {/* Próximas Parcelas */}
                    <div className="mt-3">
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        Próximas Parcelas
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {installmentSchedule
                          .filter(inst => !inst.isPaid)
                          .slice(0, 6)
                          .map((installment, index) => (
                            <div key={index} className="text-xs p-2 bg-white rounded border">
                              <div className="font-medium">
                                {installment.installmentNumber}/{purchase.totalInstallments}
                              </div>
                              <div className="text-gray-600">
                                {new Date(installment.date).toLocaleDateString()}
                              </div>
                              <div className="font-semibold text-orange-600">
                                R$ {installment.amount.toFixed(2)}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cronograma de Parcelas por Mês */}
      {sortedMonths.length > 0 && (
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
                const isPastMonth = monthDate < new Date();
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
      )}

      {installmentPurchases.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhuma compra parcelada</h3>
            <p className="text-gray-500">Suas compras parceladas aparecerão aqui</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InstallmentsSection;

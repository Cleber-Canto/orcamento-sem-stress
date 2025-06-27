
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CreditCard, AlertCircle, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  onDeleteExpense: (id: number) => void;
}

const InstallmentsSection: React.FC<InstallmentsSectionProps> = ({ expenses, onDeleteExpense }) => {
  const { toast } = useToast();

  console.log('Todas as despesas:', expenses);
  console.log('Despesas com isInstallment:', expenses.filter(e => e.isInstallment));

  // Agrupar compras parceladas por descrição e valor original
  const groupInstallmentsByPurchase = () => {
    const installmentExpenses = expenses.filter(expense => expense.isInstallment);
    console.log('Despesas parceladas filtradas:', installmentExpenses);
    
    const grouped: { [key: string]: Expense[] } = {};
    
    installmentExpenses.forEach(expense => {
      // Criar chave única baseada na descrição e valor original
      const key = `${expense.description}-${expense.originalAmount || expense.amount}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(expense);
    });
    
    console.log('Compras agrupadas:', grouped);
    return grouped;
  };

  const installmentGroups = groupInstallmentsByPurchase();
  const installmentPurchases = Object.values(installmentGroups);

  // Gerar cronograma completo de todas as parcelas
  const generateAllInstallments = () => {
    const allInstallments: Array<Expense & { isPaid: boolean }> = [];
    
    Object.values(installmentGroups).forEach(group => {
      if (group.length === 0) return;
      
      // Ordenar o grupo por data para pegar a primeira parcela (mais antiga)
      const sortedGroup = group.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const firstInstallment = sortedGroup[0];
      const totalInstallments = firstInstallment.totalInstallments || group.length;
      const originalAmount = firstInstallment.originalAmount || (firstInstallment.amount * totalInstallments);
      const monthlyAmount = originalAmount / totalInstallments;
      
      // Usar a data da primeira parcela como base
      const baseDate = new Date(firstInstallment.date);
      
      for (let i = 0; i < totalInstallments; i++) {
        const installmentDate = new Date(baseDate);
        installmentDate.setMonth(installmentDate.getMonth() + i);
        
        // Verificar se esta parcela já foi paga (existe na lista de despesas)
        const existingInstallment = group.find(exp => exp.installmentNumber === (i + 1));
        const isPaid = !!existingInstallment;
        
        allInstallments.push({
          ...firstInstallment,
          installmentNumber: i + 1,
          amount: monthlyAmount,
          date: installmentDate.toISOString().split('T')[0],
          isPaid: isPaid,
          id: existingInstallment?.id || firstInstallment.id + i
        });
      }
    });
    
    return allInstallments;
  };

  const allInstallments = generateAllInstallments();
  console.log('Todas as parcelas geradas:', allInstallments);

  // Calcular totais
  const totalPendingAmount = allInstallments
    .filter(inst => !inst.isPaid)
    .reduce((sum, inst) => sum + inst.amount, 0);

  const totalPendingInstallments = allInstallments.filter(inst => !inst.isPaid).length;
  const totalPurchases = installmentPurchases.length;

  console.log('Totais calculados:', {
    totalPendingAmount,
    totalPendingInstallments,
    totalPurchases
  });

  // Agrupar parcelas por mês para cronograma
  const installmentsByMonth = allInstallments.reduce((acc, installment) => {
    const monthKey = installment.date.substring(0, 7); // YYYY-MM
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(installment);
    return acc;
  }, {} as Record<string, any[]>);

  const sortedMonths = Object.keys(installmentsByMonth).sort();

  const handleDeletePurchase = (purchaseGroup: Expense[], description: string) => {
    // Deletar todas as parcelas desta compra
    purchaseGroup.forEach(expense => {
      onDeleteExpense(expense.id);
    });

    toast({
      title: "Compra parcelada excluída",
      description: `${description} e todas suas parcelas foram removidas`,
    });
  };

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
            <div className="text-2xl font-bold text-blue-800">{totalPendingInstallments}</div>
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
            <div className="text-2xl font-bold text-purple-800">{totalPurchases}</div>
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
              {installmentPurchases.map((purchaseGroup, index) => {
                const sortedGroup = purchaseGroup.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                const firstInstallment = sortedGroup[0];
                const totalInstallments = firstInstallment.totalInstallments || purchaseGroup.length;
                const originalAmount = firstInstallment.originalAmount || (firstInstallment.amount * totalInstallments);
                const monthlyAmount = originalAmount / totalInstallments;
                const paidInstallments = purchaseGroup.length;
                const pendingInstallments = totalInstallments - paidInstallments;
                
                return (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{firstInstallment.description}</h3>
                        <p className="text-sm text-gray-600">
                          {firstInstallment.category} • {firstInstallment.paymentMethod}
                        </p>
                        <p className="text-sm text-gray-600">
                          Compra realizada em: {new Date(firstInstallment.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-xl font-bold text-blue-600">
                            R$ {originalAmount.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {totalInstallments}x de R$ {monthlyAmount.toFixed(2)}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePurchase(purchaseGroup, firstInstallment.description)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
                        style={{ width: `${(paidInstallments / totalInstallments) * 100}%` }}
                      ></div>
                    </div>

                    {/* Próximas Parcelas */}
                    <div className="mt-3">
                      <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        Próximas Parcelas
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {Array.from({ length: Math.min(6, pendingInstallments) }, (_, i) => {
                          const installmentNumber = paidInstallments + i + 1;
                          const baseDate = new Date(firstInstallment.date);
                          const installmentDate = new Date(baseDate);
                          installmentDate.setMonth(installmentDate.getMonth() + installmentNumber - 1);
                          
                          return (
                            <div key={i} className="text-xs p-2 bg-white rounded border">
                              <div className="font-medium">
                                {installmentNumber}/{totalInstallments}
                              </div>
                              <div className="text-gray-600">
                                {installmentDate.toLocaleDateString('pt-BR')}
                              </div>
                              <div className="font-semibold text-orange-600">
                                R$ {monthlyAmount.toFixed(2)}
                              </div>
                            </div>
                          );
                        })}
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
      )}

      {installmentPurchases.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhuma compra parcelada</h3>
            <p className="text-gray-500">
              Suas compras parceladas aparecerão aqui. <br/>
              Para adicionar uma compra parcelada, vá em "Adicionar Gasto" e marque a opção "Compra Parcelada".
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InstallmentsSection;


import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { InstallmentsSectionProps, Expense } from '@/types/installments';
import { 
  groupInstallmentsByPurchase, 
  generateAllInstallments,
  calculateInstallmentStats 
} from '@/utils/installmentUtils';
import InstallmentsSummary from './InstallmentsSummary';
import PurchasesList from './PurchasesList';
import InstallmentsCalendar from './InstallmentsCalendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, AlertCircle, TrendingUp } from 'lucide-react';

const InstallmentsSection: React.FC<InstallmentsSectionProps> = ({ expenses, onDeleteExpense }) => {
  const { toast } = useToast();

  console.log('=== ANÁLISE DE PARCELAS ===');
  console.log('Total de despesas recebidas:', expenses.length);
  console.log('Despesas com isInstallment true:', expenses.filter(e => e.isInstallment === true).length);
  console.log('Despesas com installmentNumber:', expenses.filter(e => e.installmentNumber && e.installmentNumber > 0).length);
  console.log('Despesas com totalInstallments:', expenses.filter(e => e.totalInstallments && e.totalInstallments > 1).length);

  const installmentGroups = groupInstallmentsByPurchase(expenses);
  const installmentPurchases = Object.values(installmentGroups);
  const allInstallments = generateAllInstallments(installmentGroups);
  const stats = calculateInstallmentStats(allInstallments);

  console.log('=== RESULTADOS ===');
  console.log('Grupos de parcelas:', Object.keys(installmentGroups).length);
  console.log('Compras parceladas:', installmentPurchases.length);
  console.log('Total de parcelas geradas:', allInstallments.length);
  console.log('Estatísticas:', stats);

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

  const handleUpdatePurchaseDate = (purchaseGroup: Expense[], newDate: string) => {
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição de data da compra será implementada em breve",
    });
  };

  // Se não há parcelas, mostrar tela vazia com orientações
  if (installmentPurchases.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Controle de Parcelas</h2>
        </div>

        <Card className="text-center py-12">
          <CardContent>
            <CreditCard className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhuma compra parcelada cadastrada
            </h3>
            <p className="text-gray-500 mb-6">
              Para começar a controlar suas parcelas, adicione uma compra parcelada na aba "Adicionar Gasto"
            </p>
            <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
              <h4 className="font-medium text-blue-800 mb-2">💡 Como funciona:</h4>
              <ul className="text-sm text-blue-700 text-left space-y-1">
                <li>• Marque "Compra Parcelada" ao adicionar um gasto</li>
                <li>• Escolha o número de parcelas</li>
                <li>• O sistema criará o cronograma automaticamente</li>
                <li>• Acompanhe o progresso aqui nesta seção</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Controle de Parcelas</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="h-4 w-4" />
          {stats.completionPercentage.toFixed(1)}% concluído
        </div>
      </div>

      {/* Resumo Estatístico Melhorado */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Compras Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{installmentPurchases.length}</div>
            <div className="text-xs text-blue-600 mt-1">parcelamentos ativos</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Parcelas Pagas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{stats.paidInstallments}</div>
            <div className="text-xs text-green-600 mt-1">
              R$ {stats.paidAmount.toFixed(2)} pagos
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700">Parcelas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800">{stats.pendingInstallments}</div>
            <div className="text-xs text-orange-600 mt-1">
              R$ {stats.pendingAmount.toFixed(2)} pendentes
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Total Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">R$ {stats.totalAmount.toFixed(2)}</div>
            <div className="text-xs text-purple-600 mt-1">em {stats.totalInstallments} parcelas</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerta para parcelas pendentes altas */}
      {stats.pendingAmount > 1000 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <h4 className="font-medium text-orange-800">Atenção aos Compromissos Futuros</h4>
                <p className="text-sm text-orange-700">
                  Você tem R$ {stats.pendingAmount.toFixed(2)} em parcelas pendentes. 
                  Planeje seu orçamento considerando esses valores.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <InstallmentsSummary
        totalPendingInstallments={stats.pendingInstallments}
        totalPendingAmount={stats.pendingAmount}
        totalPurchases={installmentPurchases.length}
      />

      <PurchasesList
        installmentPurchases={installmentPurchases}
        onDeletePurchase={handleDeletePurchase}
        onUpdatePurchaseDate={handleUpdatePurchaseDate}
      />

      <InstallmentsCalendar allInstallments={allInstallments} />
    </div>
  );
};

export default InstallmentsSection;

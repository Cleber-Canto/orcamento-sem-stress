
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, AlertCircle, Trash2 } from 'lucide-react';
import { Expense } from '@/types/installments';
import { calculateFirstInstallmentDate } from '@/utils/installmentUtils';

interface PurchasesListProps {
  installmentPurchases: Expense[][];
  onDeletePurchase: (purchaseGroup: Expense[], description: string) => void;
}

const PurchasesList: React.FC<PurchasesListProps> = ({ installmentPurchases, onDeletePurchase }) => {
  if (installmentPurchases.length === 0) {
    return (
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
    );
  }

  return (
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
            
            // Calcular a data da primeira parcela baseada na data real da compra
            const firstInstallmentDate = calculateFirstInstallmentDate(firstInstallment.date);
            
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
                    <p className="text-sm text-blue-600">
                      Primeira parcela: {firstInstallmentDate.toLocaleDateString('pt-BR')}
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
                      onClick={() => onDeletePurchase(purchaseGroup, firstInstallment.description)}
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
                      const installmentDate = new Date(firstInstallmentDate);
                      installmentDate.setMonth(installmentDate.getMonth() + installmentNumber - 1);
                      
                      // Ajustar se o dia não existir no mês
                      const targetMonth = (firstInstallmentDate.getMonth() + installmentNumber - 1) % 12;
                      if (installmentDate.getMonth() !== targetMonth) {
                        installmentDate.setMonth(targetMonth + 1, 0);
                      }
                      
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
  );
};

export default PurchasesList;

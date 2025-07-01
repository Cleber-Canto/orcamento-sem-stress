
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CreditCard, AlertCircle, Trash2, Edit3, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Expense } from '@/types/installments';
import { generateInstallmentReport } from '@/utils/installmentUtils';

interface PurchasesListProps {
  installmentPurchases: Expense[][];
  onDeletePurchase: (purchaseGroup: Expense[], description: string) => void;
  onUpdatePurchaseDate?: (purchaseGroup: Expense[], newDate: string) => void;
}

const PurchasesList: React.FC<PurchasesListProps> = ({ installmentPurchases, onDeletePurchase, onUpdatePurchaseDate }) => {
  const currentDate = new Date();
  const [editingPurchase, setEditingPurchase] = useState<{ group: Expense[], index: number } | null>(null);
  const [newPurchaseDate, setNewPurchaseDate] = useState('');

  const handleEditDate = (purchaseGroup: Expense[], index: number) => {
    const firstInstallment = purchaseGroup[0];
    const purchaseDate = new Date(firstInstallment.date);
    
    setNewPurchaseDate(purchaseDate.toISOString().split('T')[0]);
    setEditingPurchase({ group: purchaseGroup, index });
  };

  const handleSaveDate = () => {
    if (editingPurchase && onUpdatePurchaseDate && newPurchaseDate) {
      onUpdatePurchaseDate(editingPurchase.group, newPurchaseDate);
      setEditingPurchase(null);
      setNewPurchaseDate('');
    }
  };

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
        <p className="text-sm text-gray-600">
          ℹ️ As parcelas seguem a data de vencimento da fatura do cartão (dia 28), não a data da compra
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {installmentPurchases.map((purchaseGroup, index) => {
            const sortedGroup = purchaseGroup.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            const firstInstallment = sortedGroup[0];
            const totalInstallments = firstInstallment.totalInstallments || purchaseGroup.length;
            const originalAmount = firstInstallment.originalAmount || (firstInstallment.amount * totalInstallments);
            const monthlyAmount = originalAmount / totalInstallments;
            
            const purchaseDate = new Date(firstInstallment.date);
            
            // Calcular parcelas usando a nova lógica
            let paidInstallments = 0;
            let overdueInstallments = 0;
            const installmentDetails = [];
            
            for (let i = 0; i < totalInstallments; i++) {
              const installmentDate = new Date(purchaseDate);
              installmentDate.setMonth(purchaseDate.getMonth() + i + 1);
              installmentDate.setDate(28); // Vencimento sempre no dia 28
              
              const existingInstallment = purchaseGroup.find(exp => exp.installmentNumber === (i + 1));
              const hasPassedCurrentDate = installmentDate <= currentDate;
              const isPaid = !!existingInstallment || hasPassedCurrentDate;
              
              if (isPaid) paidInstallments++;
              if (hasPassedCurrentDate && !existingInstallment) overdueInstallments++;
              
              installmentDetails.push({
                number: i + 1,
                date: installmentDate,
                isPaid,
                isOverdue: hasPassedCurrentDate && !existingInstallment,
                amount: monthlyAmount
              });
            }
            
            const pendingInstallments = totalInstallments - paidInstallments;
            
            return (
              <div key={index} className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                {/* Header da Compra */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl text-gray-800">{firstInstallment.description}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Compra: {purchaseDate.toLocaleDateString('pt-BR')}
                      </span>
                      <span>{firstInstallment.category}</span>
                      <span>{firstInstallment.paymentMethod}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        R$ {originalAmount.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {totalInstallments}x de R$ {monthlyAmount.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditDate(purchaseGroup, index)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Data da Compra</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="purchase-date">Data da Compra</Label>
                              <Input
                                id="purchase-date"
                                type="date"
                                value={newPurchaseDate}
                                onChange={(e) => setNewPurchaseDate(e.target.value)}
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" onClick={() => setEditingPurchase(null)}>
                                Cancelar
                              </Button>
                              <Button onClick={handleSaveDate}>
                                Salvar
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
                </div>

                {/* Explicação da Lógica */}
                <div className="bg-blue-100 p-3 rounded-lg mb-4">
                  <h4 className="font-medium text-blue-800 mb-1">📅 Como funcionam as parcelas:</h4>
                  <p className="text-sm text-blue-700">
                    As parcelas seguem a data de vencimento da fatura do cartão (dia 28), não a data da compra. 
                    Compra realizada em {purchaseDate.toLocaleDateString('pt-BR')}, 
                    primeira parcela vence em {new Date(purchaseDate.getFullYear(), purchaseDate.getMonth() + 1, 28).toLocaleDateString('pt-BR')}.
                  </p>
                </div>
                
                {/* Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-semibold text-green-800">Pagas: {paidInstallments}</div>
                      <div className="text-sm text-green-600">R$ {(paidInstallments * monthlyAmount).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <div>
                      <div className="font-semibold text-orange-800">Pendentes: {pendingInstallments}</div>
                      <div className="text-sm text-orange-600">R$ {(pendingInstallments * monthlyAmount).toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-semibold text-red-800">Vencidas: {overdueInstallments}</div>
                      <div className="text-sm text-red-600">R$ {(overdueInstallments * monthlyAmount).toFixed(2)}</div>
                    </div>
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(paidInstallments / totalInstallments) * 100}%` }}
                  ></div>
                </div>

                {/* Detalhamento das Parcelas */}
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Cronograma Detalhado:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {installmentDetails.map((detail, i) => (
                      <div 
                        key={i} 
                        className={`p-3 rounded-lg border-2 ${
                          detail.isPaid 
                            ? 'bg-green-50 border-green-200' 
                            : detail.isOverdue 
                              ? 'bg-red-50 border-red-200'
                              : 'bg-yellow-50 border-yellow-200'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-sm">
                            Parcela {detail.number}/{totalInstallments}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${
                            detail.isPaid 
                              ? 'bg-green-200 text-green-800' 
                              : detail.isOverdue 
                                ? 'bg-red-200 text-red-800'
                                : 'bg-yellow-200 text-yellow-800'
                          }`}>
                            {detail.isPaid ? 'Paga' : detail.isOverdue ? 'Vencida' : 'A vencer'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {detail.date.toLocaleDateString('pt-BR')}
                        </div>
                        <div className="font-bold text-gray-800">
                          R$ {detail.amount.toFixed(2)}
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
  );
};

export default PurchasesList;

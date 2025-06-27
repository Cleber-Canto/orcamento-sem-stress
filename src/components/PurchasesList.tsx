
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CreditCard, AlertCircle, Trash2, Edit3 } from 'lucide-react';
import { Expense } from '@/types/installments';

interface PurchasesListProps {
  installmentPurchases: Expense[][];
  onDeletePurchase: (purchaseGroup: Expense[], description: string) => void;
  onUpdatePurchaseDate?: (purchaseGroup: Expense[], newDate: string) => void;
}

const PurchasesList: React.FC<PurchasesListProps> = ({ installmentPurchases, onDeletePurchase, onUpdatePurchaseDate }) => {
  // Usar data atual de 2025
  const currentDate = new Date('2025-06-27');
  const [editingPurchase, setEditingPurchase] = useState<{ group: Expense[], index: number } | null>(null);
  const [newPurchaseDate, setNewPurchaseDate] = useState('');

  const handleEditDate = (purchaseGroup: Expense[], index: number) => {
    const firstInstallment = purchaseGroup[0];
    let purchaseDate = new Date(firstInstallment.date);
    
    // Ajustar data da compra para 2025 se estiver no futuro
    if (purchaseDate.getFullYear() > 2025) {
      purchaseDate.setFullYear(2025);
    }
    
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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {installmentPurchases.map((purchaseGroup, index) => {
            const sortedGroup = purchaseGroup.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            const firstInstallment = sortedGroup[0];
            const totalInstallments = firstInstallment.totalInstallments || purchaseGroup.length;
            const originalAmount = firstInstallment.originalAmount || (firstInstallment.amount * totalInstallments);
            const monthlyAmount = originalAmount / totalInstallments;
            
            // Calcular quantas parcelas já foram pagas (incluindo as que passaram da data atual)
            let purchaseDate = new Date(firstInstallment.date);
            
            // Ajustar data da compra para 2025 se estiver no futuro
            if (purchaseDate.getFullYear() > 2025) {
              purchaseDate.setFullYear(2025);
            }
            
            let paidInstallments = 0;
            
            for (let i = 0; i < totalInstallments; i++) {
              const installmentDate = new Date(purchaseDate);
              installmentDate.setMonth(purchaseDate.getMonth() + (i + 1));
              
              const targetDay = purchaseDate.getDate();
              const lastDayOfMonth = new Date(installmentDate.getFullYear(), installmentDate.getMonth() + 1, 0).getDate();
              
              if (targetDay > lastDayOfMonth) {
                installmentDate.setDate(lastDayOfMonth);
              } else {
                installmentDate.setDate(targetDay);
              }
              
              const existingInstallment = purchaseGroup.find(exp => exp.installmentNumber === (i + 1));
              const hasPassedCurrentDate = installmentDate <= currentDate;
              
              if (existingInstallment || hasPassedCurrentDate) {
                paidInstallments++;
              }
            }
            
            const pendingInstallments = totalInstallments - paidInstallments;
            
            // Calcular a data da primeira parcela: mês seguinte à compra
            const firstInstallmentDate = new Date(purchaseDate);
            firstInstallmentDate.setMonth(purchaseDate.getMonth() + 1);
            
            return (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{firstInstallment.description}</h3>
                    <p className="text-sm text-gray-600">
                      {firstInstallment.category} • {firstInstallment.paymentMethod}
                    </p>
                    <p className="text-sm text-gray-600">
                      Compra realizada em: {purchaseDate.toLocaleDateString('pt-BR')}
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
                {pendingInstallments > 0 && (
                  <div className="mt-3">
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      Próximas Parcelas
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {Array.from({ length: Math.min(6, pendingInstallments) }, (_, i) => {
                        const installmentNumber = paidInstallments + i + 1;
                        
                        // Calcular data da parcela: data da compra + número de meses
                        const installmentDate = new Date(purchaseDate);
                        installmentDate.setMonth(purchaseDate.getMonth() + installmentNumber);
                        
                        // Manter o mesmo dia da compra, ajustando se necessário
                        const targetDay = purchaseDate.getDate();
                        const lastDayOfMonth = new Date(installmentDate.getFullYear(), installmentDate.getMonth() + 1, 0).getDate();
                        
                        if (targetDay > lastDayOfMonth) {
                          installmentDate.setDate(lastDayOfMonth);
                        } else {
                          installmentDate.setDate(targetDay);
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
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchasesList;

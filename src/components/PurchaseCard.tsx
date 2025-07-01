import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Trash2, Edit3, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Expense } from '@/types/installments';
import PurchaseEditDialog from './PurchaseEditDialog';
import { calculateFirstInstallmentDate } from '@/utils/installmentUtils';

interface PurchaseCardProps {
  purchaseGroup: Expense[];
  index: number;
  onDeletePurchase: (purchaseGroup: Expense[], description: string) => void;
  onUpdatePurchaseDate?: (purchaseGroup: Expense[], newDate: string) => void;
}

const PurchaseCard: React.FC<PurchaseCardProps> = ({ 
  purchaseGroup, 
  index, 
  onDeletePurchase, 
  onUpdatePurchaseDate 
}) => {
  const currentDate = new Date();
  const sortedGroup = purchaseGroup.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const firstInstallment = sortedGroup[0];
  const totalInstallments = firstInstallment.totalInstallments || purchaseGroup.length;
  const originalAmount = firstInstallment.originalAmount || (firstInstallment.amount * totalInstallments);
  const monthlyAmount = originalAmount / totalInstallments;
  
  const purchaseDate = new Date(firstInstallment.date);
  
  // Calcular parcelas com lógica corrigida
  let paidInstallments = 0;
  let overdueInstallments = 0;
  let pendingInstallments = 0;
  const installmentDetails = [];
  
  // Calcular a primeira parcela corretamente
  const firstInstallmentDate = calculateFirstInstallmentDate(firstInstallment.date);
  
  for (let i = 0; i < totalInstallments; i++) {
    // Calcular a data de cada parcela a partir da primeira parcela
    const installmentDate = new Date(firstInstallmentDate);
    installmentDate.setMonth(firstInstallmentDate.getMonth() + i);
    
    // Corrigir meses que não têm dia 28 (fevereiro)
    if (installmentDate.getDate() !== 28) {
      installmentDate.setDate(0);
      installmentDate.setDate(28);
    }
    
    const existingInstallment = purchaseGroup.find(exp => exp.installmentNumber === (i + 1));
    const hasPassedCurrentDate = installmentDate < currentDate;
    
    // Lógica corrigida:
    // - Se existe registro no banco: está paga
    // - Se não existe registro mas a data já passou há mais de 30 dias: considera paga (pagamento automático)
    // - Se não existe registro e a data passou recentemente: vencida
    // - Se a data ainda não chegou: pendente
    const daysSinceDue = hasPassedCurrentDate ? Math.floor((currentDate.getTime() - installmentDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const isPaid = !!existingInstallment || (hasPassedCurrentDate && daysSinceDue > 30);
    const isOverdue = hasPassedCurrentDate && !existingInstallment && daysSinceDue <= 30;
    const isPending = !hasPassedCurrentDate && !existingInstallment;
    
    if (isPaid) paidInstallments++;
    if (isOverdue) overdueInstallments++;
    if (isPending) pendingInstallments++;
    
    let status = 'A vencer';
    if (isPaid) status = 'Paga';
    else if (isOverdue) status = 'Vencida';
    
    installmentDetails.push({
      number: i + 1,
      date: installmentDate,
      isPaid,
      isOverdue,
      isPending,
      status,
      amount: monthlyAmount
    });
  }

  return (
    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
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
            <PurchaseEditDialog
              purchaseGroup={purchaseGroup}
              onUpdatePurchaseDate={onUpdatePurchaseDate}
            />
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
          As parcelas seguem a data de vencimento da fatura do cartão (dia 28). 
          Compra realizada em {purchaseDate.toLocaleDateString('pt-BR')}, 
          primeira parcela vence em {firstInstallmentDate.toLocaleDateString('pt-BR')}.
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
                  {detail.status}
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
};

export default PurchaseCard;

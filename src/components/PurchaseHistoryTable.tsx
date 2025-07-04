
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar, CreditCard } from 'lucide-react';
import { Expense } from '@/types/installments';
import { calculateFirstInstallmentDate } from '@/utils/dateUtils';

interface PurchaseHistoryTableProps {
  installmentPurchases: Expense[][];
}

const PurchaseHistoryTable: React.FC<PurchaseHistoryTableProps> = ({ installmentPurchases }) => {
  // Extrair informações das compras originais
  const purchaseHistory = installmentPurchases.map(purchaseGroup => {
    const sortedGroup = purchaseGroup.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstInstallment = sortedGroup[0];
    const totalInstallments = firstInstallment.totalInstallments || purchaseGroup.length;
    const originalAmount = firstInstallment.originalAmount || (firstInstallment.amount * totalInstallments);
    
    // CORREÇÃO DEFINITIVA: Usar a data cadastrada diretamente como data da compra
    const purchaseDateString = firstInstallment.date;
    
    // Calcular a primeira parcela corretamente
    const firstInstallmentDate = calculateFirstInstallmentDate(purchaseDateString);
    
    console.log('=== HISTORY TABLE - CORREÇÃO DEFINITIVA ===');
    console.log('Descrição:', firstInstallment.description);
    console.log('Data da compra (usando data cadastrada):', purchaseDateString);
    console.log('Primeira parcela calculada:', firstInstallmentDate.toISOString().split('T')[0]);
    
    return {
      purchaseDate: purchaseDateString,
      description: firstInstallment.description,
      originalAmount,
      totalInstallments,
      monthlyAmount: originalAmount / totalInstallments,
      category: firstInstallment.category,
      paymentMethod: firstInstallment.paymentMethod,
      firstInstallmentDate: firstInstallmentDate.toISOString().split('T')[0],
      paidInstallments: purchaseGroup.length,
      status: purchaseGroup.length === totalInstallments ? 'Completa' : 'Em andamento'
    };
  }).sort((a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime());

  if (purchaseHistory.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Nenhuma compra parcelada encontrada</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Histórico de Compras Parceladas
        </CardTitle>
        <p className="text-sm text-gray-600">
          📊 Visão geral de todas as suas compras parceladas com datas CORRETAS
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data da Compra</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor Total</TableHead>
                <TableHead>Parcelas</TableHead>
                <TableHead>Valor/Parcela</TableHead>
                <TableHead>1ª Parcela</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseHistory.map((purchase, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {new Date(purchase.purchaseDate).toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{purchase.description}</p>
                      <p className="text-xs text-gray-500">{purchase.category}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    R$ {purchase.originalAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {purchase.totalInstallments}x
                    </Badge>
                  </TableCell>
                  <TableCell>
                    R$ {purchase.monthlyAmount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-blue-500" />
                      {new Date(purchase.firstInstallmentDate).toLocaleDateString('pt-BR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={purchase.status === 'Completa' ? 'default' : 'secondary'}>
                      {purchase.status}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {purchase.paidInstallments}/{purchase.totalInstallments} pagas
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">💡 Sistema Corrigido:</h4>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• <strong>Data da Compra:</strong> Exatamente a data que você cadastrou</p>
            <p>• <strong>1ª Parcela:</strong> Vence no mesmo dia da compra, porém no MÊS SEGUINTE</p>
            <p>• <strong>Parcelas seguintes:</strong> Mantêm o mesmo dia nos próximos meses</p>
            <p>• <strong>Exemplo:</strong> Compra em 17/09 → 1ª parcela 17/10, 2ª parcela 17/11, etc.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseHistoryTable;

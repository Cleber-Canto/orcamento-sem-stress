
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';

interface FinancialSummaryCardsProps {
  totalIncome: number;
  monthlyIncome: number;
  totalExtraIncome: number;
  totalExpenses: number;
  remainingBalance: number;
}

const FinancialSummaryCards: React.FC<FinancialSummaryCardsProps> = ({
  totalIncome,
  monthlyIncome,
  totalExtraIncome,
  totalExpenses,
  remainingBalance
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-green-700">Renda Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-800">R$ {totalIncome.toFixed(2)}</div>
          {totalExtraIncome > 0 && (
            <div className="text-xs text-green-600 mt-1">
              Base: R$ {monthlyIncome.toFixed(2)} + Extra: R$ {totalExtraIncome.toFixed(2)}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-red-700">Gastos Totais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-800">R$ {totalExpenses.toFixed(2)}</div>
          <div className="text-xs text-red-600 mt-1">
            {totalIncome > 0 ? ((totalExpenses / totalIncome) * 100).toFixed(1) : '0'}% da renda
          </div>
        </CardContent>
      </Card>
      
      <Card className={`bg-gradient-to-br ${remainingBalance >= 0 ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-red-50 to-red-100 border-red-200'}`}>
        <CardHeader className="pb-2">
          <CardTitle className={`text-sm font-medium ${remainingBalance >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
            Saldo Restante
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${remainingBalance >= 0 ? 'text-blue-800' : 'text-red-800'}`}>
            R$ {remainingBalance.toFixed(2)}
          </div>
          <div className={`text-xs mt-1 ${remainingBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {remainingBalance >= 0 ? 'Sobrou dinheiro' : 'Gastou mais que ganhou'}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-purple-700">Taxa de Poupança</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-800">
            {totalIncome > 0 ? ((remainingBalance / totalIncome) * 100).toFixed(1) : '0.0'}%
          </div>
          <div className="text-xs text-purple-600 mt-1">
            {remainingBalance >= totalIncome * 0.2 ? '🎉 Excelente!' : 
             remainingBalance >= totalIncome * 0.1 ? '👍 Boa!' : '⚠️ Tente economizar mais'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialSummaryCards;

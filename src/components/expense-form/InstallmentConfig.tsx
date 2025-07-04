
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard } from 'lucide-react';
import { calculateFirstInstallmentDate, calculateAllInstallmentDates } from '@/utils/dateUtils';

interface InstallmentConfigProps {
  isInstallment: boolean;
  setIsInstallment: (value: boolean) => void;
  installments: string;
  setInstallments: (value: string) => void;
  amount: string;
  date: string;
}

const InstallmentConfig: React.FC<InstallmentConfigProps> = ({
  isInstallment, setIsInstallment, installments, setInstallments, amount, date
}) => {
  const calculateLastInstallmentDate = () => {
    if (!date || !installments) return '';
    
    console.log('=== CALCULANDO ÚLTIMA PARCELA NO FORMULÁRIO ===');
    console.log('📝 Data inserida no formulário:', date);
    console.log('📝 Número de parcelas:', installments);
    
    // Usar a nova função que calcula todas as parcelas
    const allDates = calculateAllInstallmentDates(date, parseInt(installments));
    const lastDate = allDates[allDates.length - 1];
    
    console.log('📝 Última parcela calculada:', lastDate.toLocaleDateString('pt-BR'));
    return lastDate.toLocaleDateString('pt-BR');
  };

  const getFirstInstallmentDate = () => {
    if (!date) return '';
    
    console.log('=== CALCULANDO PRIMEIRA PARCELA NO FORMULÁRIO ===');
    console.log('📝 Data da compra inserida:', date);
    
    // A primeira parcela vence no mês seguinte, mesmo dia
    const firstDate = calculateFirstInstallmentDate(date);
    
    console.log('📝 Primeira parcela calculada:', firstDate.toLocaleDateString('pt-BR'));
    return firstDate.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="installment" 
          checked={isInstallment}
          onCheckedChange={(checked) => setIsInstallment(checked as boolean)}
        />
        <Label htmlFor="installment" className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Compra Parcelada
        </Label>
      </div>
      
      {isInstallment && (
        <div className="ml-6 space-y-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-1">
              🔄 Como funciona o parcelamento:
            </p>
            <p className="text-xs text-blue-700">
              • A primeira parcela vence no mesmo dia da compra, mas no MÊS SEGUINTE<br/>
              • As demais parcelas mantêm o mesmo dia nos meses subsequentes<br/>
              • Exemplo: Compra em 26/05/2025 → 1ª parcela 26/06/2025, 2ª parcela 26/07/2025, etc.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="installments">Número de Parcelas</Label>
            <Select value={installments} onValueChange={setInstallments}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}x
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {amount && installments && date && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-800">
                💰 Resumo do Parcelamento:
              </p>
              <div className="text-sm text-green-700 mt-1">
                <p>• Valor total: R$ {parseFloat(amount).toFixed(2)}</p>
                <p>• Parcelas: {installments}x de R$ {(parseFloat(amount) / parseInt(installments)).toFixed(2)}</p>
                <p>• Data da compra: {new Date(date).toLocaleDateString('pt-BR')}</p>
                <p>• Primeira parcela: {getFirstInstallmentDate()}</p>
                <p>• Última parcela: {calculateLastInstallmentDate()}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InstallmentConfig;

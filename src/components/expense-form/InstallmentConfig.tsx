
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard } from 'lucide-react';

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
    
    // Usar a data EXATA inserida pelo usuário
    const purchaseDate = new Date(date + 'T00:00:00');
    console.log('Data inserida pelo usuário (InstallmentConfig):', date);
    console.log('Data processada:', purchaseDate.toLocaleDateString('pt-BR'));
    
    // Calcular a última parcela baseada na data inserida
    const lastInstallmentDate = new Date(
      purchaseDate.getFullYear(), 
      purchaseDate.getMonth() + parseInt(installments) - 1, 
      purchaseDate.getDate()
    );
    
    // Verificar se o dia existe no mês
    if (lastInstallmentDate.getDate() !== purchaseDate.getDate()) {
      lastInstallmentDate.setDate(0); // Último dia do mês anterior
    }
    
    console.log('Última parcela calculada:', lastInstallmentDate.toLocaleDateString('pt-BR'));
    return lastInstallmentDate.toLocaleDateString('pt-BR');
  };

  const getFirstInstallmentDate = () => {
    if (!date) return '';
    
    // A primeira parcela vence na data EXATA da compra
    const purchaseDate = new Date(date + 'T00:00:00');
    return purchaseDate.toLocaleDateString('pt-BR');
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
              • O valor será dividido igualmente entre as parcelas<br/>
              • Cada parcela será lançada nos próximos meses automaticamente<br/>
              • Para cartão de crédito, as datas de vencimento seguem o corte configurado
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

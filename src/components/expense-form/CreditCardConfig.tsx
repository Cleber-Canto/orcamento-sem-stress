
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays } from 'lucide-react';
import { calculateDueDate } from '@/utils/creditCardUtils';

interface CreditCardConfigProps {
  creditCardCutoff: string;
  setCreditCardCutoff: (value: string) => void;
  creditCardDueDay: string;
  setCreditCardDueDay: (value: string) => void;
  date: string;
}

const CreditCardConfig: React.FC<CreditCardConfigProps> = ({
  creditCardCutoff, setCreditCardCutoff, creditCardDueDay, setCreditCardDueDay, date
}) => {
  return (
    <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="h-5 w-5 text-purple-600" />
        <h4 className="font-medium text-purple-800">Configurações do Cartão de Crédito</h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cutoff">Dia do Corte</Label>
          <Select value={creditCardCutoff} onValueChange={setCreditCardCutoff}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  Dia {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDay">Dia do Vencimento</Label>
          <Select value={creditCardDueDay} onValueChange={setCreditCardDueDay}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  Dia {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {date && (
        <div className="p-3 bg-purple-100 rounded-lg">
          <p className="text-sm font-medium text-purple-800 mb-1">
            📅 Preview do Vencimento:
          </p>
          <p className="text-sm text-purple-700">
            Compra em {new Date(date).toLocaleDateString()} → 
            Vence em {new Date(calculateDueDate(date, parseInt(creditCardCutoff), parseInt(creditCardDueDay))).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default CreditCardConfig;

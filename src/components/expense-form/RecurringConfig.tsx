
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from 'lucide-react';

interface RecurringConfigProps {
  isRecurring: boolean;
  setIsRecurring: (value: boolean) => void;
  recurringFrequency: string;
  setRecurringFrequency: (value: string) => void;
}

const recurringOptions = [
  'Semanal', 'Mensal', 'Bimestral', 'Trimestral', 'Semestral', 'Anual'
];

const RecurringConfig: React.FC<RecurringConfigProps> = ({
  isRecurring, setIsRecurring, recurringFrequency, setRecurringFrequency
}) => {
  return (
    <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="recurring" 
          checked={isRecurring}
          onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
        />
        <Label htmlFor="recurring" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Gasto Recorrente (Débito Automático, Assinaturas, etc.)
        </Label>
      </div>
      
      {isRecurring && (
        <div className="ml-6 space-y-2">
          <Label htmlFor="frequency">Frequência</Label>
          <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {recurringOptions.map((freq) => (
                <SelectItem key={freq} value={freq}>
                  {freq}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default RecurringConfig;

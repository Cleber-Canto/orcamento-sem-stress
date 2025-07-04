
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarIcon, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DatePickerWithConfirmationProps {
  date: string;
  setDate: (value: string) => void;
}

const DatePickerWithConfirmation: React.FC<DatePickerWithConfirmationProps> = ({
  date,
  setDate
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    date ? new Date(date) : undefined
  );
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setSelectedDate(newDate);
      setIsConfirmed(false);
    }
  };

  const confirmDate = () => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setDate(formattedDate);
      setIsConfirmed(true);
      setIsOpen(false);
      
      console.log('=== DATA CONFIRMADA PELO USUÁRIO ===');
      console.log('📅 Data selecionada:', selectedDate.toLocaleDateString('pt-BR'));
      console.log('📅 Data formatada para sistema:', formattedDate);
      console.log('📅 Ano:', selectedDate.getFullYear(), 'Mês:', selectedDate.getMonth() + 1, 'Dia:', selectedDate.getDate());
    }
  };

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="date">Data da Compra *</Label>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
              isConfirmed && "border-green-500 bg-green-50"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? (
              <span className="flex items-center gap-2">
                {formatDateForDisplay(date)}
                {isConfirmed && <CheckCircle className="h-4 w-4 text-green-600" />}
              </span>
            ) : (
              <span>Selecione a data da compra</span>
            )}
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
              disabled={(date) => date > new Date() || date < new Date('2020-01-01')}
            />
            
            {selectedDate && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  📅 Data selecionada:
                </p>
                <p className="text-sm text-blue-700 mb-3">
                  {selectedDate.toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                
                <div className="text-xs text-blue-600 mb-3">
                  <p>• Esta será a data base para calcular as parcelas</p>
                  <p>• A primeira parcela vence no mesmo dia do mês seguinte</p>
                  <p>• Exemplo: Compra em {selectedDate.getDate()}/{selectedDate.getMonth() + 1} → 1ª parcela {selectedDate.getDate()}/{selectedDate.getMonth() + 2}</p>
                </div>
                
                <Button 
                  onClick={confirmDate}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirmar Data
                </Button>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      
      {isConfirmed && date && (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Data da compra confirmada!</span>
          </div>
          <p className="text-xs text-green-700 mt-1">
            {formatDateForDisplay(date)} - As parcelas serão calculadas a partir desta data
          </p>
        </div>
      )}
    </div>
  );
};

export default DatePickerWithConfirmation;

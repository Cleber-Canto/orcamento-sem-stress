
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { CalendarIcon, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { calcularPrimeiraParcela, formatoPersonalizado } from '@/utils/dateCalculations';

interface DatePickerWithConfirmationProps {
  date: string;
  setDate: (value: string) => void;
}

const DatePickerWithConfirmation: React.FC<DatePickerWithConfirmationProps> = ({
  date,
  setDate
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    date ? new Date(date + 'T00:00:00') : undefined
  );
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      console.log('=== DATA SELECIONADA NO CALENDÁRIO ===');
      console.log('📅 Data selecionada:', newDate);
      console.log('📅 Data formatada BR:', newDate.toLocaleDateString('pt-BR'));
      console.log('📅 Ano:', newDate.getFullYear(), 'Mês:', newDate.getMonth() + 1, 'Dia:', newDate.getDate());
      
      setSelectedDate(newDate);
      setIsConfirmed(false);
    }
  };

  const confirmDate = () => {
    if (selectedDate) {
      // Garantir que a data seja convertida corretamente para string YYYY-MM-DD
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      console.log('=== CONFIRMANDO DATA SELECIONADA ===');
      console.log('📅 Data original do calendário:', selectedDate);
      console.log('📅 Data formatada para sistema:', formattedDate);
      console.log('📅 Componentes: Ano:', year, 'Mês:', month, 'Dia:', day);
      
      setDate(formattedDate);
      setIsConfirmed(true);
      setIsOpen(false);
    }
  };

  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return '';
    console.log('=== FORMATANDO DATA PARA DISPLAY ===');
    console.log('📅 String recebida:', dateString);
    
    const date = new Date(dateString + 'T00:00:00');
    const formatted = date.toLocaleDateString('pt-BR');
    
    console.log('📅 Data parseada:', date);
    console.log('📅 Data formatada para display:', formatted);
    
    return formatted;
  };

  const getPreviewInfo = () => {
    if (!selectedDate) return null;
    
    console.log('=== CALCULANDO PREVIEW ===');
    console.log('📅 Data selecionada para preview:', selectedDate);
    
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const formattedDateString = `${year}-${month}-${day}`;
    
    console.log('📅 String formatada para cálculo:', formattedDateString);
    
    const primeiraParcela = calcularPrimeiraParcela(formattedDateString);
    
    console.log('📅 Primeira parcela calculada:', primeiraParcela.toLocaleDateString('pt-BR'));
    
    return {
      dataCompra: formatoPersonalizado(selectedDate),
      primeiraParcela: formatoPersonalizado(primeiraParcela)
    };
  };

  const previewInfo = getPreviewInfo();

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
            
            {selectedDate && previewInfo && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-800 mb-2">
                  📅 Preview do Vencimento:
                </p>
                <p className="text-sm text-blue-700 mb-3">
                  <strong>Compra em {previewInfo.dataCompra} → Primeira parcela vence em {previewInfo.primeiraParcela}</strong>
                </p>
                
                <div className="text-xs text-blue-600 mb-3">
                  <p>✅ <strong>Regra:</strong> A primeira parcela vence no mesmo dia, mas no MÊS SEGUINTE</p>
                  <p>• Compra em {selectedDate.getDate()}/{selectedDate.getMonth() + 1} → 1ª parcela {selectedDate.getDate()}/{selectedDate.getMonth() + 2}</p>
                  <p>• As demais parcelas seguem mensalmente no mesmo dia</p>
                </div>
                
                <Button 
                  onClick={confirmDate}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirmar Data da Compra
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
            {formatDateForDisplay(date)} - As parcelas serão calculadas corretamente a partir desta data
          </p>
        </div>
      )}
    </div>
  );
};

export default DatePickerWithConfirmation;

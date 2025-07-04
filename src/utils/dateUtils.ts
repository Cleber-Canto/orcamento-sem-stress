
import { parseISO, addMonths, setDate } from 'date-fns';

/**
 * Calcula a data da primeira parcela baseada na data da compra
 * A primeira parcela vence no mesmo dia da compra, mas no mês seguinte
 * @param purchaseDate Data da compra original (string no formato YYYY-MM-DD)
 * @returns Data da primeira parcela (mês seguinte, mesmo dia)
 */
export const calculateFirstInstallmentDate = (purchaseDate: string): Date => {
  console.log('=== NOVA LÓGICA: Primeira parcela no mês seguinte ===');
  console.log('Data da compra recebida:', purchaseDate);
  
  // Parse da data mantendo exatamente o que foi inserido
  const purchase = parseISO(purchaseDate);
  
  console.log('Data parseada:', purchase.toLocaleDateString('pt-BR'));
  console.log('Detalhes - Ano:', purchase.getFullYear(), 'Mês:', purchase.getMonth() + 1, 'Dia:', purchase.getDate());
  
  // A primeira parcela vence no mesmo dia, mas no MÊS SEGUINTE
  const firstInstallmentDate = addMonths(purchase, 1);
  
  console.log('PRIMEIRA PARCELA calculada para:', firstInstallmentDate.toLocaleDateString('pt-BR'));
  console.log('Detalhes primeira parcela - Ano:', firstInstallmentDate.getFullYear(), 'Mês:', firstInstallmentDate.getMonth() + 1, 'Dia:', firstInstallmentDate.getDate());
  
  return firstInstallmentDate;
};

/**
 * Calcula todas as datas de parcelas com base na data da compra
 * @param purchaseDate Data da compra (string no formato YYYY-MM-DD)
 * @param totalInstallments Número total de parcelas
 * @returns Array com as datas de todas as parcelas
 */
export const calculateAllInstallmentDates = (purchaseDate: string, totalInstallments: number): Date[] => {
  const firstDate = calculateFirstInstallmentDate(purchaseDate);
  const installmentDates: Date[] = [];
  
  for (let i = 0; i < totalInstallments; i++) {
    const installmentDate = addMonths(firstDate, i);
    installmentDates.push(installmentDate);
    console.log(`Parcela ${i + 1}/${totalInstallments}: ${installmentDate.toLocaleDateString('pt-BR')}`);
  }
  
  return installmentDates;
};

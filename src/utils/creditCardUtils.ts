
import { addMonths, setDate, isBefore, format, parseISO } from 'date-fns';

/**
 * Calcula a data de vencimento da fatura com base na data de compra e dia de corte
 * @param purchaseDate Data da compra (string ou Date)
 * @param cutoffDay Dia do corte do cartão (ex: 10)
 * @param dueDay Dia do vencimento da fatura (ex: 25)
 * @returns Data de vencimento como string formatada (yyyy-MM-dd)
 */
export const calculateDueDate = (
  purchaseDate: string | Date, 
  cutoffDay: number,
  dueDay: number = 25
): string => {
  const purchase = typeof purchaseDate === 'string' ? parseISO(purchaseDate) : purchaseDate;
  
  console.log('Calculando vencimento para compra:', purchase);
  console.log('Dia de corte:', cutoffDay, 'Dia de vencimento:', dueDay);
  
  const year = purchase.getFullYear();
  const month = purchase.getMonth();
  
  // Data de corte do mês atual
  const cutoffDate = setDate(new Date(year, month, 1), cutoffDay);
  
  // Se a compra foi antes ou no dia do corte, vence no próximo vencimento
  // Se foi depois do corte, vence no vencimento do mês seguinte
  const dueMonth = isBefore(purchase, cutoffDate) || purchase.getDate() === cutoffDay
    ? new Date(year, month, 1)  // Mesmo mês
    : addMonths(new Date(year, month, 1), 1);  // Próximo mês
  
  const dueDate = setDate(dueMonth, dueDay);
  
  console.log('Data de vencimento calculada:', dueDate);
  
  return format(dueDate, 'yyyy-MM-dd');
};

/**
 * Calcula todas as datas de vencimento para parcelas
 * @param purchaseDate Data da compra
 * @param installments Número de parcelas
 * @param cutoffDay Dia do corte
 * @param dueDay Dia do vencimento
 * @returns Array com todas as datas de vencimento
 */
export const calculateInstallmentDueDates = (
  purchaseDate: string | Date,
  installments: number,
  cutoffDay: number,
  dueDay: number = 25
): string[] => {
  const dueDates: string[] = [];
  
  for (let i = 0; i < installments; i++) {
    // Para cada parcela, calcular baseado na data da compra + i meses
    const purchase = typeof purchaseDate === 'string' ? parseISO(purchaseDate) : purchaseDate;
    const installmentPurchaseDate = addMonths(purchase, i);
    
    const dueDate = calculateDueDate(installmentPurchaseDate, cutoffDay, dueDay);
    dueDates.push(dueDate);
  }
  
  return dueDates;
};

/**
 * Verifica se uma compra já passou do corte do mês
 * @param purchaseDate Data da compra
 * @param cutoffDay Dia do corte
 * @returns boolean
 */
export const isAfterCutoff = (purchaseDate: string | Date, cutoffDay: number): boolean => {
  const purchase = typeof purchaseDate === 'string' ? parseISO(purchaseDate) : purchaseDate;
  const cutoffDate = setDate(new Date(purchase.getFullYear(), purchase.getMonth(), 1), cutoffDay);
  
  return !isBefore(purchase, cutoffDate) && purchase.getDate() !== cutoffDay;
};

/**
 * Agrupa despesas por mês de vencimento da fatura
 * @param expenses Array de despesas
 * @param cutoffDay Dia do corte
 * @param dueDay Dia do vencimento
 * @returns Objeto agrupado por mês de vencimento
 */
export const groupExpensesByBillingMonth = (
  expenses: any[],
  cutoffDay: number,
  dueDay: number = 25
) => {
  const grouped: { [key: string]: any[] } = {};
  
  expenses.forEach(expense => {
    if (expense.paymentMethod === 'Cartão de Crédito') {
      const dueDate = calculateDueDate(expense.date, cutoffDay, dueDay);
      const monthKey = format(parseISO(dueDate), 'yyyy-MM');
      
      if (!grouped[monthKey]) {
        grouped[monthKey] = [];
      }
      
      grouped[monthKey].push({
        ...expense,
        dueDate,
        billingMonth: monthKey
      });
    }
  });
  
  return grouped;
};

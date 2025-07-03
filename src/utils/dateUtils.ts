
import { addMonths, parseISO } from 'date-fns';

/**
 * Calcula a data da primeira parcela baseada na data da compra
 * A primeira parcela vence no mesmo dia da compra
 * @param purchaseDate Data da compra original
 * @returns Data da primeira parcela
 */
export const calculateFirstInstallmentDate = (purchaseDate: string): Date => {
  const purchase = parseISO(purchaseDate);
  
  // A primeira parcela vence no mesmo dia da compra (não no mês seguinte)
  return purchase;
};

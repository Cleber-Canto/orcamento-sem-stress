
import { parseISO } from 'date-fns';

/**
 * Calcula a data da primeira parcela baseada na data da compra
 * A primeira parcela vence no mesmo dia da compra
 * @param purchaseDate Data da compra original (string no formato YYYY-MM-DD)
 * @returns Data da primeira parcela (mesmo dia da compra)
 */
export const calculateFirstInstallmentDate = (purchaseDate: string): Date => {
  console.log('Calculando primeira parcela para data:', purchaseDate);
  
  // Garantir que a data seja parseada corretamente sem alterações
  const purchase = parseISO(purchaseDate);
  
  console.log('Data parseada:', purchase.toLocaleDateString('pt-BR'));
  console.log('Ano:', purchase.getFullYear(), 'Mês:', purchase.getMonth() + 1, 'Dia:', purchase.getDate());
  
  // A primeira parcela vence exatamente no mesmo dia da compra
  return purchase;
};

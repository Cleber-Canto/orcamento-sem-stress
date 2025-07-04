
import { parseISO } from 'date-fns';

/**
 * Calcula a data da primeira parcela baseada na data da compra
 * A primeira parcela vence no mesmo dia da compra
 * @param purchaseDate Data da compra original (string no formato YYYY-MM-DD)
 * @returns Data da primeira parcela (mesmo dia da compra)
 */
export const calculateFirstInstallmentDate = (purchaseDate: string): Date => {
  console.log('=== DATE UTILS - PRIMEIRA PARCELA ===');
  console.log('Data recebida:', purchaseDate);
  
  // Parse correto da data mantendo o timezone local
  const purchase = new Date(purchaseDate + 'T00:00:00');
  
  console.log('Data parseada:', purchase.toLocaleDateString('pt-BR'));
  console.log('Detalhes - Ano:', purchase.getFullYear(), 'Mês:', purchase.getMonth() + 1, 'Dia:', purchase.getDate());
  
  // A primeira parcela vence exatamente no mesmo dia da compra
  console.log('RETORNANDO a mesma data da compra para primeira parcela');
  return purchase;
};

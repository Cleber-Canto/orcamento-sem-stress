// src/utils/parcelas.ts
import { addMonths, setDate, getDate } from 'date-fns';

/**
 * Gera o cronograma de parcelas de uma compra no cartão de crédito.
 * A primeira parcela vence no mesmo dia da compra, no mês seguinte.
 * Exemplo: compra em 15/06/2025 → primeira parcela 15/07/2025
 */
export function gerarParcelasCartao(
  valorTotal: number,
  dataCompra: Date,
  parcelas: number
) {
  const valorParcela = Number((valorTotal / parcelas).toFixed(2));
  const diaCompra = getDate(dataCompra);

  // Primeira parcela: mês seguinte, no mesmo dia
  const primeiraParcela = setDate(addMonths(dataCompra, 1), diaCompra);

  return Array.from({ length: parcelas }, (_, index) => {
    const vencimento = addMonths(primeiraParcela, index);
    return {
      date: vencimento.toISOString().split('T')[0], // yyyy-MM-dd
      amount: valorParcela,
      installmentNumber: index + 1,
      totalInstallments: parcelas,
    };
  });
}

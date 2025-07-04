
import { parseISO, addMonths, setDate } from 'date-fns';

/**
 * Calcula a data da primeira parcela baseada na data da compra
 * A primeira parcela vence no mesmo dia da compra, mas no mês seguinte
 * @param purchaseDate Data da compra original (string no formato YYYY-MM-DD)
 * @returns Data da primeira parcela (mês seguinte, mesmo dia)
 */
export const calculateFirstInstallmentDate = (purchaseDate: string): Date => {
  console.log('=== CALCULANDO PRIMEIRA PARCELA ===');
  console.log('📅 Data da compra recebida (string):', purchaseDate);
  
  // Parse da data mantendo exatamente o que foi inserido
  const purchase = parseISO(purchaseDate);
  
  console.log('📅 Data parseada:', purchase);
  console.log('📅 Data parseada formatada:', purchase.toLocaleDateString('pt-BR'));
  console.log('📅 Ano:', purchase.getFullYear(), 'Mês:', purchase.getMonth() + 1, 'Dia:', purchase.getDate());
  
  // A primeira parcela vence no mesmo dia, mas no MÊS SEGUINTE
  const firstInstallmentDate = addMonths(purchase, 1);
  
  console.log('✅ PRIMEIRA PARCELA calculada:', firstInstallmentDate);
  console.log('✅ PRIMEIRA PARCELA formatada:', firstInstallmentDate.toLocaleDateString('pt-BR'));
  console.log('✅ Ano primeira:', firstInstallmentDate.getFullYear(), 'Mês primeira:', firstInstallmentDate.getMonth() + 1, 'Dia primeira:', firstInstallmentDate.getDate());
  
  // Verificação se a lógica está correta
  const expectedMonth = purchase.getMonth() + 2; // +2 porque getMonth() é 0-based
  const actualMonth = firstInstallmentDate.getMonth() + 1;
  console.log('🔍 Verificação: Mês esperado:', expectedMonth, 'Mês calculado:', actualMonth);
  
  return firstInstallmentDate;
};

/**
 * Calcula todas as datas de parcelas com base na data da compra
 * @param purchaseDate Data da compra (string no formato YYYY-MM-DD)
 * @param totalInstallments Número total de parcelas
 * @returns Array com as datas de todas as parcelas
 */
export const calculateAllInstallmentDates = (purchaseDate: string, totalInstallments: number): Date[] => {
  console.log('=== CALCULANDO TODAS AS PARCELAS ===');
  console.log('📊 Data da compra:', purchaseDate);
  console.log('📊 Total de parcelas:', totalInstallments);
  
  const firstDate = calculateFirstInstallmentDate(purchaseDate);
  const installmentDates: Date[] = [];
  
  console.log('📊 Primeira parcela base:', firstDate.toLocaleDateString('pt-BR'));
  
  for (let i = 0; i < totalInstallments; i++) {
    const installmentDate = addMonths(firstDate, i);
    installmentDates.push(installmentDate);
    console.log(`📊 Parcela ${i + 1}/${totalInstallments}: ${installmentDate.toLocaleDateString('pt-BR')} (${installmentDate.getDate()}/${installmentDate.getMonth() + 1}/${installmentDate.getFullYear()})`);
  }
  
  console.log('📊 RESUMO DAS PARCELAS:');
  installmentDates.forEach((date, index) => {
    console.log(`   ${index + 1}ª parcela: ${date.toLocaleDateString('pt-BR')}`);
  });
  
  return installmentDates;
};

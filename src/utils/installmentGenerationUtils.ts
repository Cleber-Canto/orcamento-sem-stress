
import { Expense, EnhancedInstallment } from '@/types/installments';
import { calculateAllInstallmentDates } from './dateUtils';

// Gerar cronograma completo de todas as parcelas seguindo a nova lógica CORRIGIDA
export const generateAllInstallments = (installmentGroups: { [key: string]: Expense[] }) => {
  const allInstallments: EnhancedInstallment[] = [];
  const currentDate = new Date();
  
  console.log('=== NOVA LÓGICA CORRIGIDA: Gerando cronograma ===');
  console.log('Data atual para verificação:', currentDate);
  console.log('Gerando cronograma para grupos:', Object.keys(installmentGroups));
  
  Object.values(installmentGroups).forEach(group => {
    if (group.length === 0) return;
    
    console.log('Processando grupo com', group.length, 'parcelas cadastradas');
    
    // Ordenar o grupo por data para pegar a primeira parcela (mais antiga)
    const sortedGroup = group.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstInstallment = sortedGroup[0];
    
    // Determinar o total de parcelas e valor original
    const totalInstallments = firstInstallment.totalInstallments || 
                             Math.max(...group.map(g => g.installmentNumber || 1)) ||
                             group.length;
    
    const originalAmount = firstInstallment.originalAmount || 
                          (firstInstallment.amount * totalInstallments);
    
    const monthlyAmount = Number((originalAmount / totalInstallments).toFixed(2));
    
    // CORREÇÃO: Calcular a data da compra original (1 mês antes da primeira parcela cadastrada)
    const firstRegisteredDate = new Date(firstInstallment.date + 'T00:00:00');
    const originalPurchaseDate = new Date(firstRegisteredDate);
    originalPurchaseDate.setMonth(originalPurchaseDate.getMonth() - 1);
    const purchaseDateString = originalPurchaseDate.toISOString().split('T')[0];
    
    console.log('Dados do grupo CORRIGIDOS:', {
      description: firstInstallment.description,
      totalInstallments,
      originalAmount,
      monthlyAmount,
      firstInstallmentRegistered: firstInstallment.date,
      originalPurchaseDate: purchaseDateString
    });
    
    // Calcular todas as datas usando a data ORIGINAL da compra
    const allInstallmentDates = calculateAllInstallmentDates(purchaseDateString, totalInstallments);
    
    // Gerar todas as parcelas do cronograma
    for (let i = 0; i < totalInstallments; i++) {
      const installmentDate = allInstallmentDates[i];
      
      // Verificar se esta parcela já foi registrada
      const existingInstallment = group.find(exp => exp.installmentNumber === (i + 1));
      const hasPassedCurrentDate = installmentDate < currentDate;
      
      // Lógica de status:
      // - Se existe registro no banco: está paga
      // - Se não existe registro mas é muito antiga (mais de 6 meses): considera paga automaticamente
      // - Se não existe registro e passou há pouco tempo: vencida  
      // - Se a data ainda não chegou: pendente
      const monthsSinceDue = hasPassedCurrentDate ? 
        (currentDate.getFullYear() - installmentDate.getFullYear()) * 12 + 
        (currentDate.getMonth() - installmentDate.getMonth()) : 0;
      
      const isPaid = !!existingInstallment || (hasPassedCurrentDate && monthsSinceDue > 6);
      
      console.log(`Parcela ${i + 1}/${totalInstallments} - Data CORRETA: ${installmentDate.toISOString().split('T')[0]} - Paga: ${isPaid} - Existe registro: ${!!existingInstallment} - Meses vencidos: ${monthsSinceDue}`);
      
      allInstallments.push({
        ...firstInstallment,
        installmentNumber: i + 1,
        amount: monthlyAmount,
        date: installmentDate.toISOString().split('T')[0],
        isPaid: isPaid,
        id: Date.now() + Math.random() + i // Gerar ID único numérico
      });
    }
  });
  
  console.log('Total de parcelas geradas CORRIGIDAS:', allInstallments.length);
  console.log('Parcelas pagas:', allInstallments.filter(p => p.isPaid).length);
  console.log('Parcelas pendentes:', allInstallments.filter(p => !p.isPaid).length);
  
  return allInstallments;
};

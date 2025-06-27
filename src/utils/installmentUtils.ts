
import { Expense, EnhancedInstallment } from '@/types/installments';

// Função para calcular a data da primeira parcela baseada na data da compra
export const calculateFirstInstallmentDate = (purchaseDate: string) => {
  const purchase = new Date(purchaseDate);
  
  console.log('Data da compra original:', purchase);
  
  // A primeira parcela será no mês seguinte, mantendo o mesmo dia
  const firstInstallmentDate = new Date(purchase);
  firstInstallmentDate.setMonth(firstInstallmentDate.getMonth() + 1);
  
  console.log('Primeira parcela calculada para:', firstInstallmentDate);
  
  return firstInstallmentDate;
};

// Agrupar compras parceladas por descrição e valor original
export const groupInstallmentsByPurchase = (expenses: Expense[]) => {
  console.log('Iniciando agrupamento. Total de despesas:', expenses.length);
  
  const installmentExpenses = expenses.filter(expense => {
    console.log('Verificando despesa:', expense.description, 'isInstallment:', expense.isInstallment);
    return expense.isInstallment === true;
  });
  
  console.log('Despesas parceladas encontradas:', installmentExpenses.length);
  console.log('Despesas parceladas:', installmentExpenses);
  
  const grouped: { [key: string]: Expense[] } = {};
  
  installmentExpenses.forEach(expense => {
    // Criar chave única baseada na descrição e valor original
    const key = `${expense.description}-${expense.originalAmount || expense.amount}`;
    console.log('Criando chave para agrupamento:', key);
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(expense);
  });
  
  console.log('Compras agrupadas por chave:', grouped);
  return grouped;
};

// Gerar cronograma completo de todas as parcelas seguindo mês a mês
export const generateAllInstallments = (installmentGroups: { [key: string]: Expense[] }) => {
  const allInstallments: EnhancedInstallment[] = [];
  const currentDate = new Date();
  
  console.log('Data atual para verificação:', currentDate);
  console.log('Gerando cronograma para grupos:', Object.keys(installmentGroups));
  
  Object.values(installmentGroups).forEach(group => {
    if (group.length === 0) return;
    
    console.log('Processando grupo com', group.length, 'parcelas');
    
    // Ordenar o grupo por data para pegar a primeira parcela (mais antiga)
    const sortedGroup = group.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstInstallment = sortedGroup[0];
    const totalInstallments = firstInstallment.totalInstallments || group.length;
    const originalAmount = firstInstallment.originalAmount || (firstInstallment.amount * totalInstallments);
    const monthlyAmount = originalAmount / totalInstallments;
    
    console.log('Primeira parcela do grupo:', firstInstallment);
    console.log('Total de parcelas:', totalInstallments);
    console.log('Valor original:', originalAmount);
    console.log('Valor mensal:', monthlyAmount);
    
    // Usar a data da compra como base
    const purchaseDate = new Date(firstInstallment.date);
    
    for (let i = 0; i < totalInstallments; i++) {
      // Calcular a data de cada parcela: mês seguinte + i meses
      const installmentDate = new Date(purchaseDate);
      installmentDate.setMonth(purchaseDate.getMonth() + 1 + i);
      
      // Manter o mesmo dia do mês da compra
      // Se o dia não existir no mês de destino, usar o último dia do mês
      const targetDay = purchaseDate.getDate();
      const lastDayOfMonth = new Date(installmentDate.getFullYear(), installmentDate.getMonth() + 1, 0).getDate();
      
      if (targetDay > lastDayOfMonth) {
        installmentDate.setDate(lastDayOfMonth);
      } else {
        installmentDate.setDate(targetDay);
      }
      
      // Verificar se esta parcela já foi paga (existe na lista de despesas) OU se já passou da data atual
      const existingInstallment = group.find(exp => exp.installmentNumber === (i + 1));
      const hasPassedCurrentDate = installmentDate <= currentDate;
      const isPaid = !!existingInstallment || hasPassedCurrentDate;
      
      console.log(`Parcela ${i + 1}/${totalInstallments} - Data: ${installmentDate.toISOString().split('T')[0]} - Paga: ${isPaid} (Existe: ${!!existingInstallment}, Passou da data: ${hasPassedCurrentDate})`);
      
      allInstallments.push({
        ...firstInstallment,
        installmentNumber: i + 1,
        amount: monthlyAmount,
        date: installmentDate.toISOString().split('T')[0],
        isPaid: isPaid,
        id: existingInstallment?.id || firstInstallment.id + i
      });
    }
  });
  
  console.log('Total de parcelas geradas:', allInstallments.length);
  console.log('Parcelas pagas automaticamente por data:', allInstallments.filter(p => p.isPaid).length);
  console.log('Parcelas pendentes:', allInstallments.filter(p => !p.isPaid).length);
  
  return allInstallments;
};


import { Expense, EnhancedInstallment } from '@/types/installments';

// Função para calcular a data da primeira parcela baseada na data da fatura do cartão
export const calculateFirstInstallmentDate = (purchaseDate: string, cardDueDay: number = 28) => {
  const purchase = new Date(purchaseDate);
  
  console.log('Data da compra original:', purchase);
  
  // A primeira parcela será no próximo vencimento da fatura após a compra
  const firstInstallmentDate = new Date(purchase);
  firstInstallmentDate.setMonth(firstInstallmentDate.getMonth() + 1);
  firstInstallmentDate.setDate(cardDueDay); // Dia da fatura (padrão: 28)
  
  console.log('Primeira parcela calculada para:', firstInstallmentDate);
  
  return firstInstallmentDate;
};

// Agrupar compras parceladas por descrição e valor original
export const groupInstallmentsByPurchase = (expenses: Expense[]) => {
  console.log('Iniciando agrupamento. Total de despesas:', expenses.length);
  
  // Filtrar apenas despesas parceladas
  const installmentExpenses = expenses.filter(expense => {
    const isInstallment = expense.isInstallment === true || 
                         (expense.installmentNumber && expense.installmentNumber > 0) ||
                         (expense.totalInstallments && expense.totalInstallments > 1);
    console.log('Verificando despesa:', expense.description, 'isInstallment:', isInstallment);
    return isInstallment;
  });
  
  console.log('Despesas parceladas encontradas:', installmentExpenses.length);
  console.log('Despesas parceladas:', installmentExpenses);
  
  const grouped: { [key: string]: Expense[] } = {};
  
  installmentExpenses.forEach(expense => {
    // Criar chave única baseada na descrição, valor original e data base
    const originalAmount = expense.originalAmount || expense.amount;
    const baseDate = expense.date.substring(0, 7); // YYYY-MM para agrupar por mês base
    const key = `${expense.description}-${originalAmount}-${baseDate}`;
    console.log('Criando chave para agrupamento:', key);
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(expense);
  });
  
  console.log('Compras agrupadas por chave:', grouped);
  return grouped;
};

// Gerar cronograma completo de todas as parcelas seguindo a data da fatura
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
    
    // Determinar o total de parcelas e valor original
    const totalInstallments = firstInstallment.totalInstallments || 
                             Math.max(...group.map(g => g.installmentNumber || 1)) ||
                             group.length;
    
    const originalAmount = firstInstallment.originalAmount || 
                          (firstInstallment.amount * totalInstallments);
    
    const monthlyAmount = Number((originalAmount / totalInstallments).toFixed(2));
    
    console.log('Dados do grupo:', {
      description: firstInstallment.description,
      totalInstallments,
      originalAmount,
      monthlyAmount
    });
    
    // Usar a data da compra como base para calcular as parcelas
    const purchaseDate = new Date(firstInstallment.date);
    
    // Gerar todas as parcelas do cronograma seguindo a data da fatura (dia 28 por padrão)
    for (let i = 0; i < totalInstallments; i++) {
      // Calcular a data de cada parcela: primeira parcela no mês seguinte da compra, sempre no dia 28
      const installmentDate = new Date(purchaseDate);
      installmentDate.setMonth(purchaseDate.getMonth() + i + 1);
      installmentDate.setDate(28); // Vencimento da fatura sempre no dia 28
      
      // Corrigir meses que não têm dia 28 (caso específico de fevereiro)
      if (installmentDate.getDate() !== 28) {
        installmentDate.setDate(0); // Vai para o último dia do mês anterior
        installmentDate.setDate(28); // Tenta novamente
      }
      
      // Verificar se esta parcela já foi registrada
      const existingInstallment = group.find(exp => exp.installmentNumber === (i + 1));
      const hasPassedCurrentDate = installmentDate < currentDate;
      
      // Lógica corrigida:
      // - Uma parcela está paga apenas se existe um registro desta parcela no banco de dados
      // - Não marcar automaticamente como paga só porque a data passou
      const isPaid = !!existingInstallment;
      
      console.log(`Parcela ${i + 1}/${totalInstallments} - Data: ${installmentDate.toISOString().split('T')[0]} - Paga: ${isPaid} - Existe registro: ${!!existingInstallment}`);
      
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
  
  console.log('Total de parcelas geradas:', allInstallments.length);
  console.log('Parcelas pagas:', allInstallments.filter(p => p.isPaid).length);
  console.log('Parcelas pendentes:', allInstallments.filter(p => !p.isPaid).length);
  
  return allInstallments;
};

// Função para calcular o total pendente de parcelas
export const calculatePendingInstallmentsTotal = (installments: EnhancedInstallment[]) => {
  return installments
    .filter(inst => !inst.isPaid)
    .reduce((sum, inst) => sum + inst.amount, 0);
};

// Função para calcular estatísticas de parcelas
export const calculateInstallmentStats = (installments: EnhancedInstallment[]) => {
  const totalInstallments = installments.length;
  const paidInstallments = installments.filter(inst => inst.isPaid).length;
  const pendingInstallments = totalInstallments - paidInstallments;
  
  const totalAmount = installments.reduce((sum, inst) => sum + inst.amount, 0);
  const paidAmount = installments.filter(inst => inst.isPaid).reduce((sum, inst) => sum + inst.amount, 0);
  const pendingAmount = totalAmount - paidAmount;
  
  return {
    totalInstallments,
    paidInstallments,
    pendingInstallments,
    totalAmount,
    paidAmount,
    pendingAmount,
    completionPercentage: totalInstallments > 0 ? (paidInstallments / totalInstallments) * 100 : 0
  };
};

// Função para gerar relatório detalhado de parcelas (como o exemplo solicitado)
export const generateInstallmentReport = (installments: EnhancedInstallment[], purchaseDate: string) => {
  const purchase = new Date(purchaseDate);
  const today = new Date();
  
  const paidInstallments = installments.filter(inst => inst.isPaid);
  const pendingInstallments = installments.filter(inst => !inst.isPaid);
  const overdueInstallments = pendingInstallments.filter(inst => new Date(inst.date) < today);
  const upcomingInstallments = pendingInstallments.filter(inst => new Date(inst.date) >= today);
  
  return {
    purchaseInfo: {
      date: purchase.toLocaleDateString('pt-BR'),
      totalInstallments: installments.length,
      description: installments[0]?.description || 'Compra'
    },
    paidInstallments: paidInstallments.map(inst => ({
      number: inst.installmentNumber,
      amount: inst.amount,
      dueDate: new Date(inst.date).toLocaleDateString('pt-BR'),
      status: 'Paga'
    })),
    overdueInstallments: overdueInstallments.map(inst => ({
      number: inst.installmentNumber,
      amount: inst.amount,
      dueDate: new Date(inst.date).toLocaleDateString('pt-BR'),
      status: 'Vencida'
    })),
    upcomingInstallments: upcomingInstallments.map(inst => ({
      number: inst.installmentNumber,
      amount: inst.amount,
      dueDate: new Date(inst.date).toLocaleDateString('pt-BR'),
      status: 'A vencer'
    }))
  };
};

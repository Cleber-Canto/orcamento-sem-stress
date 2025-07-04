
import { calculateDueDate, calculateInstallmentDueDates } from '@/utils/creditCardUtils';

interface BaseExpense {
  description: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: string;
  isInstallment: boolean;
  installments: number;
  isRecurring: boolean;
  recurringFrequency: string;
  notes: string;
  creditCardCutoff?: number;
  creditCardDueDay?: number;
}

interface ProcessorParams {
  baseExpense: BaseExpense;
  isInstallment: boolean;
  installments: string;
  amount: string;
  paymentMethod: string;
  creditCardCutoff: string;
  creditCardDueDay: string;
  date: string;
  description: string;
  onAddExpense: (expense: any) => void;
}

export const processCreditCardExpense = ({
  baseExpense,
  isInstallment,
  installments,
  amount,
  creditCardCutoff,
  creditCardDueDay,
  date,
  description,
  onAddExpense
}: ProcessorParams) => {
  const cutoff = parseInt(creditCardCutoff);
  const dueDay = parseInt(creditCardDueDay);
  
  if (isInstallment && parseInt(installments) > 1) {
    const installmentAmount = parseFloat(amount) / parseInt(installments);
    const originalAmount = parseFloat(amount);
    
    console.log('=== CORREÇÃO CARTÃO DE CRÉDITO PARCELADO ===');
    console.log('Data base inserida:', date);
    
    // Parse da data original uma única vez
    const baseDate = new Date(date);
    console.log('Data base parseada:', baseDate.toLocaleDateString('pt-BR'));
    
    const dueDates = calculateInstallmentDueDates(date, parseInt(installments), cutoff, dueDay);
    
    for (let i = 0; i < parseInt(installments); i++) {
      // Calcular cada parcela mantendo o mesmo dia nos meses seguintes
      const installmentDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, baseDate.getDate());
      
      // Verificar se o dia existe no mês
      if (installmentDate.getDate() !== baseDate.getDate()) {
        installmentDate.setDate(0); // Último dia do mês anterior
      }
      
      console.log(`Criando parcela ${i + 1}:`, {
        dataOriginal: date,
        dataCalculada: installmentDate.toISOString().split('T')[0],
        dia: installmentDate.getDate(),
        mes: installmentDate.getMonth() + 1,
        ano: installmentDate.getFullYear()
      });
      
      const installmentExpense = {
        ...baseExpense,
        description: `${description}`,
        amount: installmentAmount,
        date: installmentDate.toISOString().split('T')[0],
        installmentNumber: i + 1,
        totalInstallments: parseInt(installments),
        originalAmount: originalAmount,
        isInstallment: true,
        dueDate: dueDates[i],
        billingInfo: {
          cutoffDay: cutoff,
          dueDay: dueDay,
          billingMonth: dueDates[i].substring(0, 7)
        }
      };
      
      onAddExpense(installmentExpense);
    }
    
    return {
      title: "Compra parcelada no cartão cadastrada!",
      description: `${description} em ${installments}x de R$ ${installmentAmount.toFixed(2)} - Data base: ${baseDate.toLocaleDateString('pt-BR')}`,
    };
  } else {
    const dueDate = calculateDueDate(date, cutoff, dueDay);
    
    const creditCardExpense = {
      ...baseExpense,
      dueDate,
      billingInfo: {
        cutoffDay: cutoff,
        dueDay: dueDay,
        billingMonth: dueDate.substring(0, 7)
      }
    };
    
    onAddExpense(creditCardExpense);
    
    return {
      title: "Compra no cartão cadastrada!",
      description: `${description} - Vencimento: ${new Date(dueDate).toLocaleDateString('pt-BR')}`,
    };
  }
};

export const processOtherPaymentMethods = ({
  baseExpense,
  isInstallment,
  installments,
  amount,
  date,
  description,
  onAddExpense
}: ProcessorParams) => {
  if (isInstallment && parseInt(installments) > 1) {
    const installmentAmount = parseFloat(amount) / parseInt(installments);
    const originalAmount = parseFloat(amount);
    
    console.log('=== CORREÇÃO OUTROS MÉTODOS PARCELADO ===');
    console.log('Data base inserida:', date);
    
    // Parse da data original uma única vez
    const baseDate = new Date(date);
    console.log('Data base parseada:', baseDate.toLocaleDateString('pt-BR'));
    
    for (let i = 0; i < parseInt(installments); i++) {
      // Calcular cada parcela mantendo o mesmo dia nos meses seguintes
      const installmentDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, baseDate.getDate());
      
      // Verificar se o dia existe no mês
      if (installmentDate.getDate() !== baseDate.getDate()) {
        installmentDate.setDate(0); // Último dia do mês anterior
      }
      
      console.log(`Criando parcela ${i + 1} para outros métodos:`, {
        dataOriginal: date,
        dataCalculada: installmentDate.toISOString().split('T')[0],
        dia: installmentDate.getDate(),
        mes: installmentDate.getMonth() + 1,
        ano: installmentDate.getFullYear()
      });
      
      const installmentExpense = {
        ...baseExpense,
        description: `${description}`,
        amount: installmentAmount,
        date: installmentDate.toISOString().split('T')[0],
        installmentNumber: i + 1,
        totalInstallments: parseInt(installments),
        originalAmount: originalAmount,
        isInstallment: true
      };
      
      onAddExpense(installmentExpense);
    }
    
    return {
      title: "Compra parcelada cadastrada!",
      description: `${description} em ${installments}x de R$ ${installmentAmount.toFixed(2)} - Data base: ${baseDate.toLocaleDateString('pt-BR')}`,
    };
  } else {
    onAddExpense(baseExpense);
    
    return {
      title: "Despesa adicionada!",
      description: `${description} - R$ ${amount}`,
    };
  }
};

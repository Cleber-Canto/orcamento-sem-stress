// ✅ Interface de Objetivo Financeiro
export interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  type: 'save' | 'limit';
}

// ✅ Interface de Receita
export interface Income {
  id: number;
  description: string;
  amount: number;
  type: 'salary' | 'extra' | 'investment' | 'freelance' | 'bonus';
  date: string;
  isRecurring: boolean;
}

// ✅ Interface de Despesa
export interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string; // Data da compra/lançamento (ex: '2025-05-20')
  description: string;
  paymentMethod?: 'PIX' | 'Boleto' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Débito Automático';

  // Parcelamento
  isInstallment?: boolean;             // Indica se é uma compra parcelada
  installmentNumber?: number;          // Número da parcela atual (ex: 1)
  totalInstallments?: number;          // Total de parcelas (ex: 4)

  // Vencimento real da parcela
  dueDate?: string;                    // Data de vencimento (ex: '2025-06-21')

  // Informações de cobrança da fatura
  billingInfo?: {
    cutoffDay: number;                 // Dia do corte do cartão (ex: 29)
    dueDay: number;                    // Dia do vencimento da fatura (ex: 4)
    billingMonth: string;              // Mês da fatura (ex: '2025-06')
  };

  // Recorrência
  isRecurring?: boolean;
  recurringFrequency?: 'monthly' | 'weekly' | 'yearly';

  // Campo opcional para observações
  notes?: string;

  // Extra: se quiser guardar todas as parcelas associadas
  installments?: Expense[];

  // Evita duplicidade no cronograma
  originalExpenseId?: number; // ID da despesa original, se for uma parcela derivada
}

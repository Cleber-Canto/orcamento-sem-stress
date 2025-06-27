
export interface Expense {
  id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod?: string;
  isInstallment?: boolean;
  installments?: number;
  installmentNumber?: number;
  totalInstallments?: number;
  originalAmount?: number;
}

export interface InstallmentsSectionProps {
  expenses: Expense[];
  onDeleteExpense: (id: number) => void;
}

export interface EnhancedInstallment extends Expense {
  isPaid: boolean;
}

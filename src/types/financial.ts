
export interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  type: 'save' | 'limit';
}

export interface Income {
  id: number;
  description: string;
  amount: number;
  type: 'salary' | 'extra' | 'investment' | 'freelance' | 'bonus';
  date: string;
  isRecurring: boolean;
}

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
  isRecurring?: boolean;
  recurringFrequency?: string;
  notes?: string;
  dueDate?: string;
  billingInfo?: {
    cutoffDay: number;
    dueDay: number;
    billingMonth: string;
  };
}

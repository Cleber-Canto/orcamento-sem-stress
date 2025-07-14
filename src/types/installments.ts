
import { Expense } from './financial';

export type { Expense } from './financial';

export interface InstallmentsSectionProps {
  expenses: Expense[];
  onDeleteExpense: (id: number) => void;
}

export interface EnhancedInstallment extends Expense {
  isPaid: boolean;
}

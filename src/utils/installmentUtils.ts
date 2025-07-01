
// Main installment utilities - re-exports all functions for backward compatibility
export { calculateFirstInstallmentDate } from './dateUtils';
export { groupInstallmentsByPurchase } from './groupingUtils';
export { generateAllInstallments } from './installmentGenerationUtils';
export { 
  calculatePendingInstallmentsTotal, 
  calculateInstallmentStats 
} from './calculationUtils';
export { generateInstallmentReport } from './reportUtils';


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import BasicExpenseFields from './expense-form/BasicExpenseFields';
import CreditCardConfig from './expense-form/CreditCardConfig';
import InstallmentConfig from './expense-form/InstallmentConfig';
import RecurringConfig from './expense-form/RecurringConfig';
import NotesField from './expense-form/NotesField';
import SubmitButton from './expense-form/SubmitButton';
import { useExpenseFormState } from './expense-form/FormState';
import { validateForm } from './expense-form/FormValidation';
import { processCreditCardExpense, processOtherPaymentMethods } from './expense-form/ExpenseProcessor';

interface ExpenseFormProps {
  onAddExpense: (expense: any) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
  const {
    description, setDescription,
    amount, setAmount,
    category, setCategory,
    date, setDate,
    paymentMethod, setPaymentMethod,
    isInstallment, setIsInstallment,
    installments, setInstallments,
    isRecurring, setIsRecurring,
    recurringFrequency, setRecurringFrequency,
    notes, setNotes,
    creditCardCutoff, setCreditCardCutoff,
    creditCardDueDay, setCreditCardDueDay,
    showCreditCardConfig, setShowCreditCardConfig,
    resetForm
  } = useExpenseFormState();
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateForm(description, amount, category, paymentMethod);
    if (!validation.isValid) {
      toast(validation.error!);
      return;
    }

    console.log('=== FORMULÁRIO DE DESPESA ===');
    console.log('Data inserida pelo usuário:', date);
    console.log('Descrição:', description);
    console.log('Parcelas:', isInstallment ? installments : '1');

    const baseExpense = {
      description,
      amount: parseFloat(amount),
      category,
      date,
      paymentMethod,
      isInstallment,
      installments: isInstallment ? parseInt(installments) : 1,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : '',
      notes,
      creditCardCutoff: paymentMethod === 'Cartão de Crédito' ? parseInt(creditCardCutoff) : undefined,
      creditCardDueDay: paymentMethod === 'Cartão de Crédito' ? parseInt(creditCardDueDay) : undefined,
    };

    let toastMessage;

    if (paymentMethod === 'Cartão de Crédito') {
      toastMessage = processCreditCardExpense({
        baseExpense,
        isInstallment,
        installments,
        amount,
        paymentMethod,
        creditCardCutoff,
        creditCardDueDay,
        date,
        description,
        onAddExpense
      });
    } else {
      toastMessage = processOtherPaymentMethods({
        baseExpense,
        isInstallment,
        installments,
        amount,
        paymentMethod,
        creditCardCutoff,
        creditCardDueDay,
        date,
        description,
        onAddExpense
      });
    }

    toast(toastMessage);
    resetForm();
  };

  // Mostrar configurações do cartão quando selecionado
  React.useEffect(() => {
    setShowCreditCardConfig(paymentMethod === 'Cartão de Crédito');
  }, [paymentMethod, setShowCreditCardConfig]);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Cadastrar Nova Despesa
        </CardTitle>
        <p className="text-sm text-gray-600">
          💡 <strong>Dica:</strong> A data que você escolher será usada como base para calcular todas as parcelas.
          <br />
          <strong>Exemplo:</strong> Data 20/05/2025 → Parcelas em 20/05, 20/06, 20/07, etc.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <BasicExpenseFields
            description={description}
            setDescription={setDescription}
            amount={amount}
            setAmount={setAmount}
            category={category}
            setCategory={setCategory}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            date={date}
            setDate={setDate}
          />

          {showCreditCardConfig && (
            <CreditCardConfig
              creditCardCutoff={creditCardCutoff}
              setCreditCardCutoff={setCreditCardCutoff}
              creditCardDueDay={creditCardDueDay}
              setCreditCardDueDay={setCreditCardDueDay}
              date={date}
            />
          )}

          <InstallmentConfig
            isInstallment={isInstallment}
            setIsInstallment={setIsInstallment}
            installments={installments}
            setInstallments={setInstallments}
            amount={amount}
            date={date}
          />

          <RecurringConfig
            isRecurring={isRecurring}
            setIsRecurring={setIsRecurring}
            recurringFrequency={recurringFrequency}
            setRecurringFrequency={setRecurringFrequency}
          />

          <NotesField notes={notes} setNotes={setNotes} />

          <SubmitButton isInstallment={isInstallment} installments={installments} />
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;

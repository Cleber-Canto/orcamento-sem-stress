
import { useState } from 'react';

export const useExpenseFormState = () => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isInstallment, setIsInstallment] = useState(false);
  const [installments, setInstallments] = useState('1');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState('');
  const [notes, setNotes] = useState('');
  const [creditCardCutoff, setCreditCardCutoff] = useState('10');
  const [creditCardDueDay, setCreditCardDueDay] = useState('25');
  const [showCreditCardConfig, setShowCreditCardConfig] = useState(false);

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setCategory('');
    setDate(new Date().toISOString().split('T')[0]);
    setPaymentMethod('');
    setIsInstallment(false);
    setInstallments('1');
    setIsRecurring(false);
    setRecurringFrequency('');
    setNotes('');
    setShowCreditCardConfig(false);
  };

  return {
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
  };
};

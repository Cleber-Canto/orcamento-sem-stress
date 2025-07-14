/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Calendar, AlertCircle } from 'lucide-react';
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
import { confirmarDataCompra } from '@/utils/dateCalculations';

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

    // Confirmar e validar a data antes de processar
    if (date) {
      const dataConfirmada = confirmarDataCompra(date);
      
      if (!dataConfirmada.isDataValida) {
        toast({
          title: "Data inválida",
          description: "A data da compra não pode ser no futuro.",
          variant: "destructive"
        });
        return;
      }
      
      console.log('=== PROCESSANDO DESPESA COM DATA CONFIRMADA ===');
      console.log('📅 Data da compra confirmada:', dataConfirmada.dataCompraFormatada);
      console.log('📅 Primeira parcela será em:', dataConfirmada.primeiraParcelaFormatada);
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

  // Mostrar informações da data quando selecionada
  const getDateInfo = () => {
    if (!date) return null;
    
    const dataInfo = confirmarDataCompra(date);
    return dataInfo;
  };

  const dateInfo = getDateInfo();

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Cadastrar Nova Despesa
        </CardTitle>
        
        <div className="space-y-2">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Como funciona o cálculo das datas:</span>
            </div>
            <div className="text-xs text-blue-700">
              <p>• Selecione a data EXATA em que a compra foi realizada</p>
              <p>• A primeira parcela vence no mesmo dia, mas no MÊS SEGUINTE</p>
              <p>• As demais parcelas seguem mensalmente no mesmo dia</p>
            </div>
          </div>
          
          {dateInfo && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-800 mb-1">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Resumo da Data Selecionada:</span>
              </div>
              <div className="text-xs text-green-700">
                <p>• Data da compra: {dateInfo.dataCompraFormatada}</p>
                <p>• Primeira parcela: {dateInfo.primeiraParcelaFormatada}</p>
                <p>• Dias até primeira parcela: {dateInfo.diasAteVencimento} dias</p>
              </div>
            </div>
          )}
        </div>
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

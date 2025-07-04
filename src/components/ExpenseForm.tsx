
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { calculateDueDate, calculateInstallmentDueDates } from '@/utils/creditCardUtils';

import BasicExpenseFields from './expense-form/BasicExpenseFields';
import CreditCardConfig from './expense-form/CreditCardConfig';
import InstallmentConfig from './expense-form/InstallmentConfig';
import RecurringConfig from './expense-form/RecurringConfig';

interface ExpenseFormProps {
  onAddExpense: (expense: any) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense }) => {
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
  
  // Configurações do cartão de crédito
  const [creditCardCutoff, setCreditCardCutoff] = useState('10');
  const [creditCardDueDay, setCreditCardDueDay] = useState('25');
  const [showCreditCardConfig, setShowCreditCardConfig] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !amount || !category || !paymentMethod) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
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
      date, // Manter a data exata inserida pelo usuário
      paymentMethod,
      isInstallment,
      installments: isInstallment ? parseInt(installments) : 1,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : '',
      notes,
      creditCardCutoff: paymentMethod === 'Cartão de Crédito' ? parseInt(creditCardCutoff) : undefined,
      creditCardDueDay: paymentMethod === 'Cartão de Crédito' ? parseInt(creditCardDueDay) : undefined,
    };

    // Se for cartão de crédito, calcular data de vencimento
    if (paymentMethod === 'Cartão de Crédito') {
      const cutoff = parseInt(creditCardCutoff);
      const dueDay = parseInt(creditCardDueDay);
      
      if (isInstallment && parseInt(installments) > 1) {
        const installmentAmount = parseFloat(amount) / parseInt(installments);
        const originalAmount = parseFloat(amount);
        
        // Calcular todas as datas de vencimento
        const dueDates = calculateInstallmentDueDates(date, parseInt(installments), cutoff, dueDay);
        
        for (let i = 0; i < parseInt(installments); i++) {
          // Usar a data original como base e adicionar meses
          const baseDate = new Date(date);
          const installmentDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, baseDate.getDate());
          
          console.log(`Criando parcela ${i + 1}:`, {
            dataOriginal: date,
            dataCalculada: installmentDate.toISOString().split('T')[0],
            mes: installmentDate.getMonth() + 1,
            ano: installmentDate.getFullYear()
          });
          
          const installmentExpense = {
            ...baseExpense,
            description: `${description}`,
            amount: installmentAmount,
            date: installmentDate.toISOString().split('T')[0], // Preservar formato YYYY-MM-DD
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
        
        toast({
          title: "Compra parcelada no cartão cadastrada!",
          description: `${description} em ${installments}x de R$ ${installmentAmount.toFixed(2)} - Data base: ${new Date(date).toLocaleDateString('pt-BR')}`,
        });
      } else {
        // Compra à vista no cartão
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
        
        toast({
          title: "Compra no cartão cadastrada!",
          description: `${description} - Vencimento: ${new Date(dueDate).toLocaleDateString('pt-BR')}`,
        });
      }
    } else {
      // Outros métodos de pagamento
      if (isInstallment && parseInt(installments) > 1) {
        const installmentAmount = parseFloat(amount) / parseInt(installments);
        const originalAmount = parseFloat(amount);
        
        for (let i = 0; i < parseInt(installments); i++) {
          // Usar a data original como base e adicionar meses sequencialmente
          const baseDate = new Date(date);
          const installmentDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + i, baseDate.getDate());
          
          console.log(`Criando parcela ${i + 1} para outros métodos:`, {
            dataOriginal: date,
            dataCalculada: installmentDate.toISOString().split('T')[0]
          });
          
          const installmentExpense = {
            ...baseExpense,
            description: `${description}`,
            amount: installmentAmount,
            date: installmentDate.toISOString().split('T')[0], // Manter formato correto
            installmentNumber: i + 1,
            totalInstallments: parseInt(installments),
            originalAmount: originalAmount,
            isInstallment: true
          };
          
          onAddExpense(installmentExpense);
        }
        
        toast({
          title: "Compra parcelada cadastrada!",
          description: `${description} em ${installments}x de R$ ${installmentAmount.toFixed(2)} - Data base: ${new Date(date).toLocaleDateString('pt-BR')}`,
        });
      } else {
        onAddExpense(baseExpense);
        
        toast({
          title: "Despesa adicionada!",
          description: `${description} - R$ ${amount}`,
        });
      }
    }

    // Reset form
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

  // Mostrar configurações do cartão quando selecionado
  React.useEffect(() => {
    setShowCreditCardConfig(paymentMethod === 'Cartão de Crédito');
  }, [paymentMethod]);

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

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              placeholder="Informações adicionais (opcional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" size="lg">
            <PlusCircle className="h-4 w-4 mr-2" />
            {isInstallment ? `Adicionar ${installments} Parcelas` : 'Adicionar Despesa'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;

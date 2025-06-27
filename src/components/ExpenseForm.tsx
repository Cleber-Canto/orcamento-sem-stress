
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, CreditCard, Calendar, Repeat, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  const categories = [
    'Alimentação',
    'Transporte',
    'Mercado',
    'Lazer',
    'Contas Básicas',
    'Saúde',
    'Educação',
    'Roupas',
    'Casa',
    'Empréstimos',
    'Impostos',
    'Seguros',
    'Investimentos',
    'Débito Automático',
    'Assinatura/Mensalidade',
    'Combustível',
    'Farmácia',
    'Academia',
    'Streaming',
    'Telefone/Internet',
    'Outros'
  ];

  const paymentMethods = [
    'Dinheiro',
    'Cartão de Débito',
    'Cartão de Crédito',
    'PIX',
    'Transferência',
    'Boleto',
    'Débito Automático',
    'Financiamento'
  ];

  const recurringOptions = [
    'Semanal',
    'Mensal',
    'Bimestral',
    'Trimestral',
    'Semestral',
    'Anual'
  ];

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
    };

    // Se for parcelado, criar múltiplas despesas
    if (isInstallment && parseInt(installments) > 1) {
      const installmentAmount = parseFloat(amount) / parseInt(installments);
      
      for (let i = 0; i < parseInt(installments); i++) {
        const installmentDate = new Date(date);
        installmentDate.setMonth(installmentDate.getMonth() + i);
        
        const installmentExpense = {
          ...baseExpense,
          description: `${description} (${i + 1}/${installments})`,
          amount: installmentAmount,
          date: installmentDate.toISOString().split('T')[0],
          installmentNumber: i + 1,
          totalInstallments: parseInt(installments)
        };
        
        onAddExpense(installmentExpense);
      }
      
      toast({
        title: "Despesa parcelada adicionada!",
        description: `${description} em ${installments}x de R$ ${installmentAmount.toFixed(2)}`,
      });
    } else {
      onAddExpense(baseExpense);
      
      toast({
        title: "Despesa adicionada!",
        description: `${description} - R$ ${amount}`,
      });
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
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Cadastrar Nova Despesa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Input
                id="description"
                type="text"
                placeholder="Ex: Almoço no restaurante"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Valor Total (R$) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Forma de Pagamento *</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Como pagou?" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      <div className="flex items-center gap-2">
                        {method === 'Cartão de Crédito' && <CreditCard className="h-4 w-4" />}
                        {method === 'Débito Automático' && <Repeat className="h-4 w-4" />}
                        {method}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data da Compra</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Opções de Parcelamento */}
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="installment" 
                checked={isInstallment}
                onCheckedChange={(checked) => setIsInstallment(checked as boolean)}
              />
              <Label htmlFor="installment" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Compra Parcelada
              </Label>
            </div>
            
            {isInstallment && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="installments">Número de Parcelas</Label>
                <Select value={installments} onValueChange={setInstallments}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}x
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {amount && installments && (
                  <p className="text-sm text-blue-600">
                    Valor por parcela: R$ {(parseFloat(amount) / parseInt(installments)).toFixed(2)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Opções de Recorrência */}
          <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="recurring" 
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
              />
              <Label htmlFor="recurring" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Gasto Recorrente (Débito Automático, Assinaturas, etc.)
              </Label>
            </div>
            
            {isRecurring && (
              <div className="ml-6 space-y-2">
                <Label htmlFor="frequency">Frequência</Label>
                <Select value={recurringFrequency} onValueChange={setRecurringFrequency}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {recurringOptions.map((freq) => (
                      <SelectItem key={freq} value={freq}>
                        {freq}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Observações */}
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

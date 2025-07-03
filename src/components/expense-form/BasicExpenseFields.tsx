
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BasicExpenseFieldsProps {
  description: string;
  setDescription: (value: string) => void;
  amount: string;
  setAmount: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
}

const categories = [
  'Alimentação', 'Transporte', 'Mercado', 'Lazer', 'Contas Básicas',
  'Saúde', 'Educação', 'Roupas', 'Casa', 'Empréstimos', 'Impostos',
  'Seguros', 'Investimentos', 'Débito Automático', 'Assinatura/Mensalidade',
  'Combustível', 'Farmácia', 'Academia', 'Streaming', 'Telefone/Internet', 'Outros'
];

const paymentMethods = [
  'Dinheiro', 'Cartão de Débito', 'Cartão de Crédito', 'PIX',
  'Transferência', 'Boleto', 'Débito Automático', 'Financiamento'
];

const BasicExpenseFields: React.FC<BasicExpenseFieldsProps> = ({
  description, setDescription, amount, setAmount, category, setCategory,
  paymentMethod, setPaymentMethod, date, setDate
}) => {
  return (
    <>
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
                  {method}
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
    </>
  );
};

export default BasicExpenseFields;

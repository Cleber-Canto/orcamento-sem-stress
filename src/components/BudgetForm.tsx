
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BudgetCategory {
  id: number;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  month: string;
  priority: 'essential' | 'important' | 'optional';
}

interface BudgetFormProps {
  onAddCategory: (category: Omit<BudgetCategory, 'id' | 'spentAmount'>) => void;
  selectedMonth: string;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onAddCategory, selectedMonth }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    category: '',
    budgetAmount: 0,
    priority: 'important' as 'essential' | 'important' | 'optional'
  });

  const availableCategories = [
    'Alimentação', 'Transporte', 'Mercado', 'Saúde', 'Educação', 'Lazer',
    'Roupas', 'Casa', 'Débito Automático', 'Impostos', 'Investimentos', 'Outros'
  ];

  const handleAddCategory = () => {
    if (!newCategory.category || newCategory.budgetAmount <= 0) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos corretamente",
        variant: "destructive"
      });
      return;
    }

    onAddCategory({
      category: newCategory.category,
      budgetAmount: newCategory.budgetAmount,
      month: selectedMonth,
      priority: newCategory.priority
    });

    setNewCategory({ category: '', budgetAmount: 0, priority: 'important' });
    setIsOpen(false);

    toast({
      title: "Orçamento adicionado",
      description: `Meta para ${newCategory.category}: R$ ${newCategory.budgetAmount.toFixed(2)}`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Categoria
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Categoria de Orçamento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={newCategory.category} onValueChange={(value) => setNewCategory({...newCategory, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="budget-amount">Valor do Orçamento (R$)</Label>
            <Input
              id="budget-amount"
              type="number"
              step="0.01"
              value={newCategory.budgetAmount}
              onChange={(e) => setNewCategory({...newCategory, budgetAmount: parseFloat(e.target.value) || 0})}
              placeholder="0.00"
            />
          </div>

          <div>
            <Label htmlFor="priority">Prioridade</Label>
            <Select value={newCategory.priority} onValueChange={(value: 'essential' | 'important' | 'optional') => setNewCategory({...newCategory, priority: value})}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="essential">🔴 Essencial</SelectItem>
                <SelectItem value="important">🟡 Importante</SelectItem>
                <SelectItem value="optional">🟢 Opcional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCategory}>
              Adicionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetForm;

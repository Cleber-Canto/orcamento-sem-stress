
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Income {
  id: string;
  description: string;
  amount: number;
  type: 'salary' | 'extra' | 'investment' | 'freelance' | 'bonus';
  date: string;
  isRecurring: boolean;
}

interface IncomeSectionProps {
  monthlyIncome: number;
  setMonthlyIncome: (income: number) => void;
  incomes: Income[];
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>;
  onAddIncome: (income: Omit<Income, 'id'>) => void;
  onDeleteIncome: (incomeId: string) => void;
}

const IncomeSection: React.FC<IncomeSectionProps> = ({ 
  monthlyIncome, 
  setMonthlyIncome, 
  incomes, 
  setIncomes,
  onAddIncome,
  onDeleteIncome
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingSalary, setEditingSalary] = useState(false);
  const [newSalary, setNewSalary] = useState(monthlyIncome.toString());
  const [newIncome, setNewIncome] = useState({
    description: '',
    amount: '',
    type: 'extra' as 'salary' | 'extra' | 'investment' | 'freelance' | 'bonus',
    isRecurring: false
  });
  const { toast } = useToast();

  const incomeTypes = [
    { value: 'salary', label: '💼 Salário', icon: '💼' },
    { value: 'extra', label: '💰 Renda Extra', icon: '💰' },
    { value: 'freelance', label: '👨‍💻 Freelance', icon: '👨‍💻' },
    { value: 'investment', label: '📈 Investimentos', icon: '📈' },
    { value: 'bonus', label: '🎁 Bônus', icon: '🎁' }
  ];

  const handleUpdateSalary = () => {
    const salary = parseFloat(newSalary);
    if (salary < 0) {
      toast({
        title: "Valor inválido",
        description: "O salário não pode ser negativo.",
        variant: "destructive",
      });
      return;
    }
    
    setMonthlyIncome(salary);
    setEditingSalary(false);
    toast({
      title: "Salário atualizado!",
      description: `Novo salário: R$ ${salary.toFixed(2)}`,
    });
  };

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newIncome.description || !newIncome.amount) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha descrição e valor.",
        variant: "destructive",
      });
      return;
    }

    onAddIncome({
      description: newIncome.description,
      amount: parseFloat(newIncome.amount),
      type: newIncome.type,
      date: new Date().toISOString().split('T')[0],
      isRecurring: newIncome.isRecurring
    });

    setNewIncome({ description: '', amount: '', type: 'extra', isRecurring: false });
    setShowForm(false);
  };

  const handleDeleteIncome = (id: string) => {
    onDeleteIncome(id);
  };

  const totalExtraIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalIncome = monthlyIncome + totalExtraIncome;

  const getTypeIcon = (type: string) => {
    const typeData = incomeTypes.find(t => t.value === type);
    return typeData?.icon || '💰';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Controle de Renda</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Renda
        </Button>
      </div>

      {/* Resumo de Renda */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Salário Base
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              {editingSalary ? (
                <div className="flex gap-2 w-full">
                  <Input
                    type="number"
                    step="0.01"
                    value={newSalary}
                    onChange={(e) => setNewSalary(e.target.value)}
                    className="flex-1"
                  />
                  <Button size="sm" onClick={handleUpdateSalary}>✓</Button>
                  <Button size="sm" variant="outline" onClick={() => setEditingSalary(false)}>✕</Button>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-green-800">
                    R$ {monthlyIncome.toFixed(2)}
                  </div>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => setEditingSalary(true)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Rendas Extras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">R$ {totalExtraIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Renda Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">R$ {totalIncome.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Formulário para Nova Renda */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Adicionar Nova Renda</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddIncome} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="incomeDescription">Descrição</Label>
                  <Input
                    id="incomeDescription"
                    placeholder="Ex: Freelance de design"
                    value={newIncome.description}
                    onChange={(e) => setNewIncome({...newIncome, description: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incomeAmount">Valor (R$)</Label>
                  <Input
                    id="incomeAmount"
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={newIncome.amount}
                    onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="incomeType">Tipo de Renda</Label>
                <Select value={newIncome.type} onValueChange={(value: any) => setNewIncome({...newIncome, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {incomeTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Adicionar Renda</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Rendas Extras */}
      {incomes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suas Rendas Extras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {incomes.map((income) => (
                <div key={income.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2">
                      <span>{getTypeIcon(income.type)}</span>
                      {income.description}
                    </div>
                    <div className="text-sm text-gray-600">
                      {incomeTypes.find(t => t.value === income.type)?.label} • {new Date(income.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-green-600">
                      +R$ {income.amount.toFixed(2)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteIncome(income.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default IncomeSection;

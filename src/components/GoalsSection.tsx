
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  type: 'save' | 'limit';
}

interface GoalsSectionProps {
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
}

const GoalsSection: React.FC<GoalsSectionProps> = ({ goals, setGoals }) => {
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    type: 'save' as 'save' | 'limit'
  });
  const { toast } = useToast();

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGoal.name || !newGoal.target) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const goal: Goal = {
      id: Date.now(),
      name: newGoal.name,
      target: parseFloat(newGoal.target),
      current: 0,
      type: newGoal.type
    };

    setGoals([...goals, goal]);
    setNewGoal({ name: '', target: '', type: 'save' });
    setShowForm(false);

    toast({
      title: "Meta criada!",
      description: `Meta "${newGoal.name}" adicionada com sucesso.`,
    });
  };

  const handleDeleteGoal = (id: number) => {
    setGoals(goals.filter(goal => goal.id !== id));
    toast({
      title: "Meta removida",
      description: "Meta deletada com sucesso.",
    });
  };

  const updateGoalProgress = (id: number, newValue: number) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, current: newValue } : goal
    ));
  };

  const getProgressColor = (goal: Goal) => {
    const percentage = (goal.current / goal.target) * 100;
    if (goal.type === 'save') {
      return percentage >= 100 ? 'bg-green-500' : 'bg-blue-500';
    } else {
      return percentage >= 80 ? 'bg-red-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-green-500';
    }
  };

  const getStatusMessage = (goal: Goal) => {
    const percentage = (goal.current / goal.target) * 100;
    if (goal.type === 'save') {
      if (percentage >= 100) return '🎉 Meta alcançada!';
      if (percentage >= 80) return '🚀 Quase lá!';
      return '💪 Continue assim!';
    } else {
      if (percentage >= 100) return '⚠️ Limite ultrapassado!';
      if (percentage >= 80) return '🔥 Atenção ao limite!';
      return '✅ Dentro do limite';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Suas Metas Financeiras</h2>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Meta
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Nova Meta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goalName">Nome da Meta</Label>
                <Input
                  id="goalName"
                  placeholder="Ex: Reserva de Emergência"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goalTarget">Valor Alvo (R$)</Label>
                <Input
                  id="goalTarget"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={newGoal.target}
                  onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goalType">Tipo de Meta</Label>
                <Select value={newGoal.type} onValueChange={(value: 'save' | 'limit') => setNewGoal({...newGoal, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="save">💰 Poupança (economizar)</SelectItem>
                    <SelectItem value="limit">🚫 Limite (não ultrapassar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Criar Meta</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {goal.name}
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {goal.type === 'save' ? '💰 Meta de Poupança' : '🚫 Limite de Gastos'}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progresso</span>
                  <span className="text-sm text-gray-600">
                    R$ {goal.current.toFixed(2)} / R$ {goal.target.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(goal)}`}
                    style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {((goal.current / goal.target) * 100).toFixed(1)}% concluído
                  </span>
                  <span className="text-xs font-medium">
                    {getStatusMessage(goal)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`update-${goal.id}`}>Atualizar Valor Atual</Label>
                <div className="flex gap-2">
                  <Input
                    id={`update-${goal.id}`}
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      updateGoalProgress(goal.id, value);
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Valor atualizado!",
                        description: `Meta "${goal.name}" foi atualizada.`,
                      });
                    }}
                  >
                    Atualizar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {goals.length === 0 && !showForm && (
        <Card className="text-center py-12">
          <CardContent>
            <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma meta definida</h3>
            <p className="text-gray-600 mb-4">
              Crie suas primeiras metas financeiras para ter mais controle sobre seu dinheiro.
            </p>
            <Button onClick={() => setShowForm(true)}>
              Criar Primeira Meta
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoalsSection;

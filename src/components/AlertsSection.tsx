
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from 'lucide-react';

interface AlertsSectionProps {
  expenses: Array<{
    id: number;
    category: string;
    amount: number;
    date: string;
    description: string;
  }>;
  goals: Array<{
    id: number;
    name: string;
    target: number;
    current: number;
    type: 'save' | 'limit';
  }>;
  monthlyIncome: number;
}

const AlertsSection: React.FC<AlertsSectionProps> = ({ expenses, goals, monthlyIncome }) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBalance = monthlyIncome - totalExpenses;
  const expensePercentage = (totalExpenses / monthlyIncome) * 100;

  // Calcular gastos por categoria
  const categoryExpenses = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Gerar alertas
  const alerts = [];

  // Alerta de saldo
  if (remainingBalance < 0) {
    alerts.push({
      type: 'error',
      icon: <AlertTriangle className="h-4 w-4" />,
      title: '🚨 Saldo Negativo',
      description: `Você já gastou R$ ${Math.abs(remainingBalance).toFixed(2)} a mais que sua renda mensal. É hora de revisar seus gastos!`
    });
  } else if (expensePercentage > 80) {
    alerts.push({
      type: 'warning',
      icon: <AlertTriangle className="h-4 w-4" />,
      title: '⚠️ Atenção aos Gastos',
      description: `Você já usou ${expensePercentage.toFixed(1)}% da sua renda mensal. Cuidado para não extrapolar!`
    });
  } else if (expensePercentage < 60) {
    alerts.push({
      type: 'success',
      icon: <CheckCircle className="h-4 w-4" />,
      title: '✅ Parabéns!',
      description: `Você está gastando apenas ${expensePercentage.toFixed(1)}% da sua renda. Que tal aproveitar para poupar mais?`
    });
  }

  // Alertas de metas
  goals.forEach(goal => {
    const percentage = (goal.current / goal.target) * 100;
    
    if (goal.type === 'limit') {
      if (percentage >= 100) {
        alerts.push({
          type: 'error',
          icon: <AlertTriangle className="h-4 w-4" />,
          title: '🚫 Limite Ultrapassado',
          description: `Sua meta "${goal.name}" ultrapassou o limite de R$ ${goal.target.toFixed(2)}. Atual: R$ ${goal.current.toFixed(2)}`
        });
      } else if (percentage >= 80) {
        alerts.push({
          type: 'warning',
          icon: <AlertTriangle className="h-4 w-4" />,
          title: '🔥 Próximo do Limite',
          description: `Atenção! Você já usou ${percentage.toFixed(1)}% da sua meta "${goal.name}". Restam apenas R$ ${(goal.target - goal.current).toFixed(2)}.`
        });
      }
    } else if (goal.type === 'save') {
      if (percentage >= 100) {
        alerts.push({
          type: 'success',
          icon: <CheckCircle className="h-4 w-4" />,
          title: '🎉 Meta Alcançada!',
          description: `Parabéns! Você conseguiu economizar R$ ${goal.target.toFixed(2)} para "${goal.name}".`
        });
      } else if (percentage >= 80) {
        alerts.push({
          type: 'info',
          icon: <TrendingUp className="h-4 w-4" />,
          title: '🚀 Quase Lá!',
          description: `Você já economizou ${percentage.toFixed(1)}% da sua meta "${goal.name}". Faltam apenas R$ ${(goal.target - goal.current).toFixed(2)}!`
        });
      }
    }
  });

  // Alertas de categorias com gastos altos
  Object.entries(categoryExpenses).forEach(([category, amount]) => {
    const categoryPercentage = (amount / monthlyIncome) * 100;
    
    if (categoryPercentage > 30) {
      alerts.push({
        type: 'warning',
        icon: <TrendingDown className="h-4 w-4" />,
        title: '📊 Categoria em Destaque',
        description: `Seus gastos com "${category}" representam ${categoryPercentage.toFixed(1)}% da sua renda (R$ ${amount.toFixed(2)}). Considere revisar essa categoria.`
      });
    }
  });

  // Dicas financeiras
  const tips = [
    {
      title: '💡 Dica: Regra 50-30-20',
      description: 'Distribua sua renda: 50% necessidades, 30% desejos, 20% poupança/investimentos.',
      type: 'info'
    },
    {
      title: '🎯 Dica: Controle Diário',
      description: 'Registre seus gastos diariamente para ter mais consciência financeira.',
      type: 'info'
    },
    {
      title: '📈 Dica: Reserva de Emergência',
      description: 'Mantenha uma reserva equivalente a 6 meses dos seus gastos mensais.',
      type: 'info'
    }
  ];

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'error': return 'destructive';
      case 'warning': return 'default';
      case 'success': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas Financeiros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">Tudo em ordem!</h3>
              <p className="text-gray-600">
                Não há alertas no momento. Continue assim!
              </p>
            </div>
          ) : (
            alerts.map((alert, index) => (
              <Alert key={index} variant={getAlertVariant(alert.type)} className="border-l-4">
                <div className="flex items-start gap-3">
                  {alert.icon}
                  <div>
                    <h4 className="font-semibold">{alert.title}</h4>
                    <AlertDescription>{alert.description}</AlertDescription>
                  </div>
                </div>
              </Alert>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resumo Financeiro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800">Status do Orçamento</h4>
              <p className="text-sm text-blue-600 mt-1">
                {expensePercentage.toFixed(1)}% da renda utilizada
              </p>
              <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(expensePercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800">Maior Categoria</h4>
              <p className="text-sm text-green-600 mt-1">
                {Object.entries(categoryExpenses).length > 0 ? 
                  Object.entries(categoryExpenses)
                    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Nenhuma' 
                  : 'Nenhuma'
                }
              </p>
              <p className="text-xs text-green-500 mt-1">
                R$ {Object.entries(categoryExpenses).length > 0 ? 
                  Object.entries(categoryExpenses)
                    .sort(([,a], [,b]) => b - a)[0]?.[1]?.toFixed(2) || '0.00'
                  : '0.00'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dicas Financeiras</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tips.map((tip, index) => (
            <Alert key={index} className="border-l-4 border-l-blue-500 bg-blue-50">
              <div className="flex items-start">
                <div>
                  <h4 className="font-semibold text-blue-800">{tip.title}</h4>
                  <AlertDescription className="text-blue-700">{tip.description}</AlertDescription>
                </div>
              </div>
            </Alert>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertsSection;

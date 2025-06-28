
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TrendingUp, Target, AlertTriangle } from 'lucide-react';

interface BudgetCategory {
  id: number;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  month: string;
  priority: 'essential' | 'important' | 'optional';
}

interface BudgetPieChartProps {
  budgetCategories: BudgetCategory[];
  monthlyIncome: number;
}

const BudgetPieChart: React.FC<BudgetPieChartProps> = ({ budgetCategories, monthlyIncome }) => {
  // Preparar dados para o gráfico de pizza
  const pieData = budgetCategories
    .filter(budget => budget.budgetAmount > 0)
    .map(budget => {
      const usagePercentage = budget.budgetAmount > 0 ? (budget.spentAmount / budget.budgetAmount) * 100 : 0;
      const status = usagePercentage > 100 ? 'overbudget' : 
                   usagePercentage > 80 ? 'warning' : 'safe';
      
      return {
        name: budget.category,
        value: budget.budgetAmount,
        spent: budget.spentAmount,
        remaining: Math.max(0, budget.budgetAmount - budget.spentAmount),
        usagePercentage,
        priority: budget.priority,
        status,
        color: status === 'overbudget' ? '#ef4444' : 
               status === 'warning' ? '#f59e0b' : '#10b981'
      };
    });

  // Cores para diferentes categorias
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'];

  // Estatísticas gerais
  const totalBudget = budgetCategories.reduce((sum, budget) => sum + budget.budgetAmount, 0);
  const totalSpent = budgetCategories.reduce((sum, budget) => sum + budget.spentAmount, 0);
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - totalSpent) / monthlyIncome) * 100 : 0;

  // Tooltip customizado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">Orçamento: R$ {data.value.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Gasto: R$ {data.spent.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Restante: R$ {data.remaining.toFixed(2)}</p>
          <p className={`text-sm font-medium ${
            data.status === 'overbudget' ? 'text-red-600' :
            data.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
          }`}>
            {data.usagePercentage.toFixed(1)}% utilizado
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Resumo de Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Utilização do Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800">{budgetUtilization.toFixed(1)}%</div>
            <div className="text-xs text-blue-600 mt-1">
              R$ {totalSpent.toFixed(2)} de R$ {totalBudget.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Taxa de Poupança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800">{savingsRate.toFixed(1)}%</div>
            <div className="text-xs text-green-600 mt-1">
              R$ {(monthlyIncome - totalSpent).toFixed(2)} economizados
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Categorias em Alerta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800">
              {pieData.filter(d => d.status !== 'safe').length}
            </div>
            <div className="text-xs text-purple-600 mt-1">
              de {pieData.length} categorias
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Pizza Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Distribuição do Orçamento - Modelo Pizza
          </CardTitle>
          <p className="text-sm text-gray-600">
            Visualize como seu orçamento está distribuído entre as categorias
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Gráfico */}
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, usagePercentage }) => 
                      `${name}: ${usagePercentage.toFixed(0)}%`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke={entry.status === 'overbudget' ? '#dc2626' : 'transparent'}
                        strokeWidth={entry.status === 'overbudget' ? 3 : 0}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legenda Detalhada */}
            <div className="w-full lg:w-80 space-y-3">
              <h4 className="font-medium text-lg mb-4">Status das Categorias</h4>
              {pieData.map((item, index) => (
                <div 
                  key={item.name} 
                  className={`p-3 rounded-lg border-l-4 ${
                    item.status === 'overbudget' ? 'bg-red-50 border-red-400' :
                    item.status === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                    'bg-green-50 border-green-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium text-sm">{item.name}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-200">
                        {item.priority === 'essential' ? '🔴' :
                         item.priority === 'important' ? '🟡' : '🟢'}
                      </span>
                    </div>
                    <span className={`text-xs font-medium ${
                      item.status === 'overbudget' ? 'text-red-600' :
                      item.status === 'warning' ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {item.usagePercentage.toFixed(0)}%
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Orçamento:</span>
                      <span>R$ {item.value.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gasto:</span>
                      <span>R$ {item.spent.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Restante:</span>
                      <span className={item.remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                        R$ {item.remaining.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {/* Barra de progresso */}
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        item.status === 'overbudget' ? 'bg-red-500' :
                        item.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, item.usagePercentage)}%` }}
                    />
                  </div>
                </div>
              ))}
              
              {pieData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Adicione categorias de orçamento para ver o gráfico</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dicas de Melhoria */}
      {pieData.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800 text-lg">
              💡 Como Melhorar seu Controle Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-blue-700">
              <h4 className="font-medium mb-2">Baseado na sua análise:</h4>
              <ul className="space-y-1 list-disc list-inside">
                {savingsRate < 10 && (
                  <li>Sua taxa de poupança está baixa ({savingsRate.toFixed(1)}%). Tente economizar pelo menos 20% da renda.</li>
                )}
                {pieData.filter(d => d.status === 'overbudget').length > 0 && (
                  <li>Você tem {pieData.filter(d => d.status === 'overbudget').length} categoria(s) acima do orçamento. Revise esses gastos.</li>
                )}
                {pieData.filter(d => d.priority === 'optional' && d.usagePercentage > 80).length > 0 && (
                  <li>Considere reduzir gastos opcionais que estão consumindo muito do orçamento.</li>
                )}
                <li>Monitore semanalmente suas categorias em alerta (amarelo e vermelho).</li>
                <li>Priorize gastos essenciais e mantenha os opcionais abaixo de 30% do orçamento total.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetPieChart;

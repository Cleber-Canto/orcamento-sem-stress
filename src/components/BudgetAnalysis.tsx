import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Target, AlertCircle, PieChart as PieChartIcon } from 'lucide-react';

interface BudgetCategory {
  id: number;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  month: string;
  priority: 'essential' | 'important' | 'optional';
}

interface BudgetAnalysisProps {
  budgetCategories: BudgetCategory[];
  monthlyIncome: number;
  selectedMonth: string;
}

const BudgetAnalysis: React.FC<BudgetAnalysisProps> = ({ 
  budgetCategories, 
  monthlyIncome, 
  selectedMonth 
}) => {
  // Dados para gráfico de pizza - prioridade no orçamento
  const pieData = budgetCategories
    .filter(budget => budget.budgetAmount > 0)
    .map(budget => ({
      name: budget.category,
      value: budget.budgetAmount,
      spent: budget.spentAmount,
      color: budget.spentAmount > budget.budgetAmount ? '#ef4444' : 
             budget.spentAmount > budget.budgetAmount * 0.8 ? '#f59e0b' : '#10b981',
      priority: budget.priority
    }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

  // Dados para gráfico de barras
  const chartData = budgetCategories.map(budget => ({
    category: budget.category.substring(0, 10),
    orçamento: budget.budgetAmount,
    gasto: budget.spentAmount,
    diferença: budget.budgetAmount - budget.spentAmount
  }));

  // Estatísticas por prioridade
  const getStatsByPriority = (priority: 'essential' | 'important' | 'optional') => {
    const categories = budgetCategories.filter(b => b.priority === priority);
    const totalBudget = categories.reduce((sum, b) => sum + b.budgetAmount, 0);
    const totalSpent = categories.reduce((sum, b) => sum + b.spentAmount, 0);
    return { totalBudget, totalSpent, categories: categories.length };
  };

  const essentialStats = getStatsByPriority('essential');
  const importantStats = getStatsByPriority('important');
  const optionalStats = getStatsByPriority('optional');

  // Recomendações inteligentes
  const getRecommendations = () => {
    const recommendations = [];
    
    const totalSpent = budgetCategories.reduce((sum, b) => sum + b.spentAmount, 0);
    const savingsRate = ((monthlyIncome - totalSpent) / monthlyIncome) * 100;
    
    if (savingsRate < 10) {
      recommendations.push({
        type: 'warning',
        title: 'Taxa de Poupança Baixa',
        description: `Você está poupando apenas ${savingsRate.toFixed(1)}% da renda. Recomenda-se pelo menos 20%.`,
        action: 'Revise gastos opcionais e importantes'
      });
    }

    const overdraftCategories = budgetCategories.filter(b => b.spentAmount > b.budgetAmount);
    if (overdraftCategories.length > 0) {
      recommendations.push({
        type: 'error',
        title: 'Orçamentos Estourados',
        description: `${overdraftCategories.length} categoria(s) estão acima do orçamento.`,
        action: 'Reduza gastos nessas categorias no próximo mês'
      });
    }

    if (optionalStats.totalSpent > essentialStats.totalSpent) {
      recommendations.push({
        type: 'info',
        title: 'Gastos Opcionais Altos',
        description: 'Você está gastando mais com itens opcionais do que essenciais.',
        action: 'Considere rebalancear suas prioridades'
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="space-y-6">
      {/* Gráfico de Pizza Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5" />
            Distribuição do Orçamento por Categoria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => 
                      `${name}: R$ ${value.toFixed(0)} (${(percent * 100).toFixed(0)}%)`
                    }
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `R$ ${Number(value).toFixed(2)}`,
                      `Orçamento: ${name}`,
                      `Gasto: R$ ${props.payload.spent.toFixed(2)}`
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* Legenda detalhada */}
            <div className="w-full lg:w-80 space-y-3">
              <h4 className="font-medium text-lg mb-4">Status por Categoria</h4>
              {pieData.map((item, index) => {
                const percentage = item.value > 0 ? (item.spent / item.value) * 100 : 0;
                return (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          {item.priority === 'essential' ? '🔴 Essencial' :
                           item.priority === 'important' ? '🟡 Importante' : '🟢 Opcional'}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">R$ {item.spent.toFixed(0)}</div>
                      <div className={`text-xs ${percentage > 100 ? 'text-red-600' : 
                                                percentage > 80 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {percentage.toFixed(0)}% usado
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos Comparativos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Análise Comparativa Mensal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-4">Orçamento vs Gastos</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                  <Bar dataKey="orçamento" fill="#3b82f6" name="Orçamento" />
                  <Bar dataKey="gasto" fill="#ef4444" name="Gasto" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div>
              <h4 className="font-medium mb-4">Gastos por Prioridade</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Essenciais', value: essentialStats.totalSpent, fill: '#ef4444' },
                      { name: 'Importantes', value: importantStats.totalSpent, fill: '#f59e0b' },
                      { name: 'Opcionais', value: optionalStats.totalSpent, fill: '#10b981' }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  />
                  <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Análise por Prioridade */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Análise por Prioridade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <h4 className="font-medium text-red-700">Essenciais</h4>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-red-800">
                  R$ {essentialStats.totalSpent.toFixed(2)}
                </div>
                <div className="text-sm text-red-600">
                  {essentialStats.categories} categoria(s)
                </div>
                <Progress 
                  value={essentialStats.totalBudget > 0 ? (essentialStats.totalSpent / essentialStats.totalBudget) * 100 : 0} 
                  className="h-2"
                />
                <div className="text-xs text-red-500">
                  {essentialStats.totalBudget > 0 ? 
                    `${((essentialStats.totalSpent / essentialStats.totalBudget) * 100).toFixed(1)}% do orçamento` :
                    'Sem orçamento definido'
                  }
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <h4 className="font-medium text-yellow-700">Importantes</h4>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-yellow-800">
                  R$ {importantStats.totalSpent.toFixed(2)}
                </div>
                <div className="text-sm text-yellow-600">
                  {importantStats.categories} categoria(s)
                </div>
                <Progress 
                  value={importantStats.totalBudget > 0 ? (importantStats.totalSpent / importantStats.totalBudget) * 100 : 0} 
                  className="h-2"
                />
                <div className="text-xs text-yellow-500">
                  {importantStats.totalBudget > 0 ? 
                    `${((importantStats.totalSpent / importantStats.totalBudget) * 100).toFixed(1)}% do orçamento` :
                    'Sem orçamento definido'
                  }
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h4 className="font-medium text-green-700">Opcionais</h4>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-green-800">
                  R$ {optionalStats.totalSpent.toFixed(2)}
                </div>
                <div className="text-sm text-green-600">
                  {optionalStats.categories} categoria(s)
                </div>
                <Progress 
                  value={optionalStats.totalBudget > 0 ? (optionalStats.totalSpent / optionalStats.totalBudget) * 100 : 0} 
                  className="h-2"
                />
                <div className="text-xs text-green-500">
                  {optionalStats.totalBudget > 0 ? 
                    `${((optionalStats.totalSpent / optionalStats.totalBudget) * 100).toFixed(1)}% do orçamento` :
                    'Sem orçamento definido'
                  }
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recomendações */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recomendações Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    rec.type === 'error' ? 'bg-red-50 border-red-200' :
                    rec.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-blue-50 border-blue-200'
                  }`}
                >
                  <h4 className={`font-medium mb-2 ${
                    rec.type === 'error' ? 'text-red-700' :
                    rec.type === 'warning' ? 'text-yellow-700' :
                    'text-blue-700'
                  }`}>
                    {rec.title}
                  </h4>
                  <p className={`text-sm mb-2 ${
                    rec.type === 'error' ? 'text-red-600' :
                    rec.type === 'warning' ? 'text-yellow-600' :
                    'text-blue-600'
                  }`}>
                    {rec.description}
                  </p>
                  <p className={`text-xs font-medium ${
                    rec.type === 'error' ? 'text-red-700' :
                    rec.type === 'warning' ? 'text-yellow-700' :
                    'text-blue-700'
                  }`}>
                    💡 {rec.action}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetAnalysis;

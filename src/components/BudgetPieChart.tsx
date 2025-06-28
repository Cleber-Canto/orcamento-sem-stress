
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { TrendingUp, Target, AlertTriangle, PieChart as PieChartIcon, BarChart3, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
  const [viewMode, setViewMode] = useState<'pie' | 'bar'>('pie');
  const [showDetails, setShowDetails] = useState(true);

  // Preparar dados para os gráficos
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

  // Dados para gráfico de barras
  const barData = pieData.map(item => ({
    category: item.name.substring(0, 8) + (item.name.length > 8 ? '...' : ''),
    orçamento: item.value,
    gasto: item.spent,
    restante: item.remaining
  }));

  // Cores vibrantes para o gráfico
  const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316',
    '#ec4899', '#6366f1', '#14b8a6', '#f43f5e'
  ];

  // Estatísticas gerais
  const totalBudget = budgetCategories.reduce((sum, budget) => sum + budget.budgetAmount, 0);
  const totalSpent = budgetCategories.reduce((sum, budget) => sum + budget.spentAmount, 0);
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - totalSpent) / monthlyIncome) * 100 : 0;

  // Tooltip customizado melhorado
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xl border-l-4 border-l-blue-500">
          <p className="font-bold text-gray-900 text-lg mb-2">{data.name}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-700">💰 Orçamento: <span className="font-semibold">R$ {data.value.toFixed(2)}</span></p>
            <p className="text-sm text-gray-700">💸 Gasto: <span className="font-semibold">R$ {data.spent.toFixed(2)}</span></p>
            <p className="text-sm text-gray-700">💵 Restante: <span className="font-semibold">R$ {data.remaining.toFixed(2)}</span></p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={data.status === 'overbudget' ? 'destructive' : 
                            data.status === 'warning' ? 'secondary' : 'default'}>
                {data.usagePercentage.toFixed(1)}% utilizado
              </Badge>
              <Badge variant="outline">
                {data.priority === 'essential' ? '🔴 Essencial' :
                 data.priority === 'important' ? '🟡 Importante' : '🟢 Opcional'}
              </Badge>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Renderizar labels customizados
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Não mostrar labels muito pequenos
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (pieData.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <PieChartIcon className="h-16 w-16 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum orçamento definido</h3>
          <p className="text-gray-500 text-center max-w-md">
            Adicione categorias de orçamento para visualizar seus gastos no gráfico de pizza
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Resumo de Performance Melhorado */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Utilização Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">{budgetUtilization.toFixed(1)}%</div>
            <div className="text-xs text-blue-600 mt-1">
              R$ {totalSpent.toFixed(2)} de R$ {totalBudget.toFixed(2)}
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, budgetUtilization)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Taxa de Poupança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">{savingsRate.toFixed(1)}%</div>
            <div className="text-xs text-green-600 mt-1">
              R$ {(monthlyIncome - totalSpent).toFixed(2)} poupados
            </div>
            <div className="w-full bg-green-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, savingsRate))}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alertas Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-800">
              {pieData.filter(d => d.status !== 'safe').length}
            </div>
            <div className="text-xs text-purple-600 mt-1">
              de {pieData.length} categorias
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Categorias Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-800">{pieData.length}</div>
            <div className="text-xs text-orange-600 mt-1">
              categorias monitoradas
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico Principal Melhorado */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              <CardTitle>Distribuição Inteligente do Orçamento</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={showDetails ? "default" : "outline"}
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {showDetails ? 'Ocultar' : 'Mostrar'} Detalhes
              </Button>
              <Button
                variant={viewMode === 'pie' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('pie')}
              >
                <PieChartIcon className="h-4 w-4 mr-1" />
                Pizza
              </Button>
              <Button
                variant={viewMode === 'bar' ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode('bar')}
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Barras
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Visualize como seu orçamento está distribuído e otimizado
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Gráfico */}
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={450}>
                {viewMode === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={140}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="#fff"
                      strokeWidth={2}
                    >
                      {pieData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          stroke={entry.status === 'overbudget' ? '#dc2626' : 'transparent'}
                          strokeWidth={entry.status === 'overbudget' ? 4 : 0}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
                    />
                  </PieChart>
                ) : (
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${Number(value).toFixed(2)}`} />
                    <Bar dataKey="orçamento" fill="#3b82f6" name="Orçamento" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="gasto" fill="#ef4444" name="Gasto" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="restante" fill="#10b981" name="Restante" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
            
            {/* Legenda Detalhada */}
            {showDetails && (
              <div className="w-full lg:w-96 space-y-3">
                <h4 className="font-medium text-lg mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Status das Categorias
                </h4>
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {pieData.map((item, index) => (
                    <div 
                      key={item.name} 
                      className={`p-4 rounded-xl border-l-4 transition-all duration-200 hover:shadow-md ${
                        item.status === 'overbudget' ? 'bg-red-50 border-red-400 hover:bg-red-100' :
                        item.status === 'warning' ? 'bg-yellow-50 border-yellow-400 hover:bg-yellow-100' :
                        'bg-green-50 border-green-400 hover:bg-green-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full shadow-sm"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <div>
                            <span className="font-medium text-sm">{item.name}</span>
                            <div className="flex items-center gap-1 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {item.priority === 'essential' ? '🔴 Essencial' :
                                 item.priority === 'important' ? '🟡 Importante' : '🟢 Opcional'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Badge variant={
                          item.status === 'overbudget' ? 'destructive' :
                          item.status === 'warning' ? 'secondary' : 'default'
                        }>
                          {item.usagePercentage.toFixed(0)}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-3">
                        <div>
                          <span className="block text-gray-500">Orçamento</span>
                          <span className="font-semibold">R$ {item.value.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500">Gasto</span>
                          <span className="font-semibold">R$ {item.spent.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="block text-gray-500">Restante</span>
                          <span className={`font-semibold ${item.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            R$ {item.remaining.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Barra de progresso melhorada */}
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-3 rounded-full transition-all duration-500 ${
                            item.status === 'overbudget' ? 'bg-red-500' :
                            item.status === 'warning' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(100, item.usagePercentage)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dicas Inteligentes Melhoradas */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800 text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            💡 Insights Financeiros Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium mb-2 text-blue-800">📊 Análise Atual</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                {savingsRate < 10 && (
                  <li>• Taxa de poupança baixa ({savingsRate.toFixed(1)}%). Meta: pelo menos 20%</li>
                )}
                {pieData.filter(d => d.status === 'overbudget').length > 0 && (
                  <li>• {pieData.filter(d => d.status === 'overbudget').length} categoria(s) acima do orçamento</li>
                )}
                {budgetUtilization > 90 && (
                  <li>• Orçamento quase esgotado ({budgetUtilization.toFixed(1)}%)</li>
                )}
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium mb-2 text-blue-800">🎯 Recomendações</h4>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Monitore categorias em amarelo e vermelho semanalmente</li>
                <li>• Priorize gastos essenciais (máx. 60% do orçamento)</li>
                <li>• Mantenha gastos opcionais abaixo de 20% do total</li>
                {pieData.some(d => d.priority === 'optional' && d.usagePercentage > 80) && (
                  <li>• Reduza gastos opcionais que estão altos</li>
                )}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetPieChart;

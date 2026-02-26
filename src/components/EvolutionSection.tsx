import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Expense, Income } from '@/types/financial';

interface EvolutionSectionProps {
  expenses: Expense[];
  incomes: Income[];
}

const EvolutionSection: React.FC<EvolutionSectionProps> = ({ expenses, incomes }) => {
  const [monthsToShow, setMonthsToShow] = useState('6');

  const monthlyData = useMemo(() => {
    const now = new Date();
    const count = parseInt(monthsToShow);
    const data: { month: string; label: string; income: number; expenses: number; balance: number }[] = [];

    for (let i = count - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i);
      const year = date.getFullYear();
      const month = date.getMonth();
      const key = `${year}-${String(month + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });

      const monthIncome = incomes
        .filter(inc => {
          const d = new Date(inc.date);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .reduce((sum, inc) => sum + inc.amount, 0);

      // Also count recurring incomes
      const recurringIncome = incomes
        .filter(inc => inc.isRecurring)
        .reduce((sum, inc) => sum + inc.amount, 0);

      const totalMonthIncome = monthIncome > 0 ? monthIncome : recurringIncome;

      const monthExpenses = expenses
        .filter(exp => {
          const d = new Date(exp.date);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .reduce((sum, exp) => sum + exp.amount, 0);

      data.push({
        month: key,
        label,
        income: totalMonthIncome,
        expenses: monthExpenses,
        balance: totalMonthIncome - monthExpenses
      });
    }

    return data;
  }, [expenses, incomes, monthsToShow]);

  const currentMonth = monthlyData[monthlyData.length - 1];
  const previousMonth = monthlyData.length >= 2 ? monthlyData[monthlyData.length - 2] : null;

  const incomeChange = previousMonth && previousMonth.income > 0
    ? ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100
    : 0;

  const expenseChange = previousMonth && previousMonth.expenses > 0
    ? ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100
    : 0;

  const cumulativeData = useMemo(() => {
    let accumulated = 0;
    return monthlyData.map(d => {
      accumulated += d.balance;
      return { ...d, accumulated };
    });
  }, [monthlyData]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold">Evolução Financeira</h2>
        <div>
          <Label>Período</Label>
          <Select value={monthsToShow} onValueChange={setMonthsToShow}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 meses</SelectItem>
              <SelectItem value="6">6 meses</SelectItem>
              <SelectItem value="12">12 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Comparação mês atual vs anterior */}
      {previousMonth && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 flex items-center gap-2">
                Renda
                {incomeChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-green-800">R$ {currentMonth.income.toFixed(2)}</div>
              <div className={`text-xs mt-1 ${incomeChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(1)}% vs mês anterior
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-700 flex items-center gap-2">
                Despesas
                {expenseChange <= 0 ? <TrendingDown className="h-4 w-4 text-green-600" /> : <TrendingUp className="h-4 w-4 text-red-600" />}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold text-red-800">R$ {currentMonth.expenses.toFixed(2)}</div>
              <div className={`text-xs mt-1 ${expenseChange <= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {expenseChange >= 0 ? '+' : ''}{expenseChange.toFixed(1)}% vs mês anterior
              </div>
            </CardContent>
          </Card>

          <Card className={`bg-gradient-to-br ${currentMonth.balance >= 0 ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-orange-50 to-orange-100 border-orange-200'}`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-medium ${currentMonth.balance >= 0 ? 'text-blue-700' : 'text-orange-700'} flex items-center gap-2`}>
                Saldo <ArrowRight className="h-4 w-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${currentMonth.balance >= 0 ? 'text-blue-800' : 'text-orange-800'}`}>
                R$ {currentMonth.balance.toFixed(2)}
              </div>
              <div className="text-xs mt-1 text-muted-foreground">
                Mês atual
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráfico Receita vs Despesa */}
      <Card>
        <CardHeader>
          <CardTitle>Receita vs Despesa por Mês</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="income" name="Receita" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Despesas" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Gráfico Saldo Acumulado */}
      <Card>
        <CardHeader>
          <CardTitle>Saldo Acumulado</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={cumulativeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
              <Legend />
              <Line type="monotone" dataKey="accumulated" name="Saldo Acumulado" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
              <Line type="monotone" dataKey="balance" name="Saldo Mensal" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4' }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvolutionSection;

import React, { useState } from 'react';
import NavigationTabs from './NavigationTabs';
import TabContentRenderer from './TabContentRenderer';
import UserHeader from './UserHeader';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useSupabaseFinancialData } from '@/hooks/useSupabaseFinancialData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const FinancialDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  const { user, isLoading: authLoading, signIn, signUp, resetPassword, signOut } = useSupabaseAuth();
  const { 
    expenses, 
    goals, 
    incomes, 
    monthlyIncome, 
    totalExtraIncome, 
    totalIncome, 
    totalExpenses, 
    remainingBalance,
    isLoading: dataLoading,
    addExpense,
    deleteExpense,
    setGoals,
    setMonthlyIncome,
    setIncomes
  } = useSupabaseFinancialData(user?.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (authMode === 'login') {
      await signIn(email, password);
    } else if (authMode === 'register') {
      await signUp(email, password, name);
    } else if (authMode === 'forgot') {
      await resetPassword(email);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {authMode === 'login' && 'Login'}
              {authMode === 'register' && 'Cadastro'}
              {authMode === 'forgot' && 'Recuperar Senha'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              {authMode !== 'forgot' && (
                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <Button type="submit" className="w-full">
                {authMode === 'login' && 'Entrar'}
                {authMode === 'register' && 'Cadastrar'}
                {authMode === 'forgot' && 'Enviar Email'}
              </Button>
            </form>
            
            <div className="mt-4 text-center space-y-2">
              {authMode === 'login' && (
                <>
                  <button
                    onClick={() => setAuthMode('register')}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Não tem conta? Cadastre-se
                  </button>
                  <br />
                  <button
                    onClick={() => setAuthMode('forgot')}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Esqueceu a senha?
                  </button>
                </>
              )}
              
              {authMode === 'register' && (
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Já tem conta? Faça login
                </button>
              )}
              
              {authMode === 'forgot' && (
                <button
                  onClick={() => setAuthMode('login')}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Voltar ao login
                </button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <UserHeader 
          user={{ 
            name: user?.user_metadata?.name || 'Usuário', 
            email: user?.email || '' 
          }} 
          onLogout={signOut} 
        />
        
        <div className="mt-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Bem-vindo, {user?.user_metadata?.name || 'Usuário'}!
          </h1>
          
          <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="mt-6">
            <TabContentRenderer
              activeTab={activeTab}
              expenses={expenses}
              goals={goals}
              incomes={incomes}
              monthlyIncome={monthlyIncome}
              totalIncome={totalIncome}
              totalExtraIncome={totalExtraIncome}
              totalExpenses={totalExpenses}
              remainingBalance={remainingBalance}
              onAddExpense={addExpense}
              onDeleteExpense={deleteExpense}
              onSetGoals={setGoals}
              onSetMonthlyIncome={setMonthlyIncome}
              onSetIncomes={setIncomes}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialDashboard;
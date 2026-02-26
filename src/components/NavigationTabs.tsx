
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, TrendingUp, AlertTriangle, Target, BookOpen, Wallet, CreditCard, FileText, BarChart3 } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
    { id: 'income', label: 'Renda', icon: Wallet },
    { id: 'add', label: 'Adicionar Gasto', icon: PlusCircle },
    { id: 'budget', label: 'Orçamento', icon: Target },
    { id: 'installments', label: 'Parcelas', icon: CreditCard },
    { id: 'charts', label: 'Gráficos', icon: TrendingUp },
    { id: 'goals', label: 'Metas', icon: Target },
    { id: 'alerts', label: 'Alertas', icon: AlertTriangle },
    { id: 'evolution', label: 'Evolução', icon: BarChart3 },
    { id: 'report', label: 'Relatório', icon: FileText },
    { id: 'education', label: 'Educação', icon: BookOpen },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        return (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'default' : 'outline'}
            onClick={() => onTabChange(tab.id)}
            className="flex items-center gap-2"
          >
            <IconComponent className="h-4 w-4" />
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
};

export default NavigationTabs;

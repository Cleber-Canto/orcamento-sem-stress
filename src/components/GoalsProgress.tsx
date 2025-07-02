
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

interface Goal {
  id: number;
  name: string;
  target: number;
  current: number;
  type: 'save' | 'limit';
}

interface GoalsProgressProps {
  goals: Goal[];
}

const GoalsProgress: React.FC<GoalsProgressProps> = ({ goals }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Suas Metas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{goal.name}</span>
                <span className="text-sm text-gray-600">
                  R$ {goal.current.toFixed(2)} / R$ {goal.target.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${goal.type === 'save' ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500">
                {((goal.current / goal.target) * 100).toFixed(1)}% concluído
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalsProgress;

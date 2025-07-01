
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Check, 
  Star, 
  Zap, 
  Shield, 
  BarChart3,
  PiggyBank,
  Target,
  CreditCard,
  Users,
  Smartphone,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SubscriptionSection: React.FC = () => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      description: 'Perfeito para começar',
      color: 'border-gray-200',
      buttonColor: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      features: [
        'Controle básico de gastos',
        'Até 50 transações/mês',
        'Relatórios simples',
        'Suporte por email'
      ],
      limitations: [
        'Sem sincronização banco',
        'Sem alertas avançados',
        'Sem consultoria'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'R$ 19,90',
      period: '/mês',
      description: 'Mais popular',
      color: 'border-blue-500 ring-2 ring-blue-200',
      buttonColor: 'bg-blue-600 text-white hover:bg-blue-700',
      popular: true,
      features: [
        'Transações ilimitadas',
        'Controle de parcelas avançado',
        'Metas e orçamento inteligente',
        'Relatórios detalhados',
        'Alertas personalizados',
        'Sincronização bancária',
        'Suporte prioritário',
        'Educação financeira'
      ]
    },
    {
      id: 'family',
      name: 'Família',
      price: 'R$ 29,90',
      period: '/mês',
      description: 'Para toda a família',
      color: 'border-purple-500',
      buttonColor: 'bg-purple-600 text-white hover:bg-purple-700',
      features: [
        'Tudo do Premium',
        'Até 5 usuários',
        'Controle familiar',
        'Metas compartilhadas',
        'Relatórios familiares',
        'App móvel premium',
        'Consultoria financeira'
      ]
    }
  ];

  const benefits = [
    {
      icon: <BarChart3 className="h-6 w-6 text-blue-600" />,
      title: 'Relatórios Avançados',
      description: 'Análises detalhadas dos seus gastos com gráficos interativos'
    },
    {
      icon: <PiggyBank className="h-6 w-6 text-green-600" />,
      title: 'Metas Inteligentes',
      description: 'Defina objetivos e receba orientações para alcançá-los'
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      title: 'Segurança Máxima',
      description: 'Seus dados protegidos com criptografia bancária'
    },
    {
      icon: <Smartphone className="h-6 w-6 text-orange-600" />,
      title: 'App Mobile',
      description: 'Controle suas finanças em qualquer lugar'
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    
    if (planId === 'free') {
      toast({
        title: "Plano Gratuito Ativo",
        description: "Você já está usando o plano gratuito!",
      });
      return;
    }

    toast({
      title: "Redirecionando para pagamento",
      description: `Processando assinatura do plano ${plans.find(p => p.id === planId)?.name}...`,
    });

    // Aqui seria integrado com o Stripe ou outro gateway de pagamento
    setTimeout(() => {
      toast({
        title: "Em desenvolvimento",
        description: "A integração de pagamentos será implementada em breve!",
      });
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Escolha seu Plano</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Potencialize seu controle financeiro com recursos avançados e educação financeira personalizada
        </p>
      </div>

      {/* Planos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.color} ${plan.popular ? 'transform scale-105' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Mais Popular
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className="space-y-2">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="space-y-1">
                  <div className="text-3xl font-bold">{plan.price}</div>
                  <div className="text-sm text-gray-600">{plan.period}</div>
                </div>
                <p className="text-sm text-gray-600">{plan.description}</p>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button 
                className={`w-full ${plan.buttonColor}`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.id === 'free' ? 'Plano Atual' : 'Assinar Agora'}
              </Button>

              <div className="space-y-3">
                <h4 className="font-medium text-sm">Recursos inclusos:</h4>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {plan.limitations && (
                  <div className="pt-2 border-t">
                    <h4 className="font-medium text-sm text-gray-500 mb-2">Limitações:</h4>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-500">
                          <span className="text-gray-400">•</span>
                          {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefícios */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center">Por que assinar?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">{benefit.title}</h4>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Garantia */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <Shield className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold">Garantia de 30 dias</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Não ficou satisfeito? Cancele a qualquer momento nos primeiros 30 dias 
              e receba 100% do seu dinheiro de volta.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-center">Perguntas Frequentes</h3>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Posso cancelar a qualquer momento?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Sim! Não há fidelidade. Você pode cancelar sua assinatura a qualquer momento 
                e continuar usando até o final do período pago.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Meus dados ficam seguros?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Absolutamente! Usamos criptografia de nível bancário e nunca compartilhamos 
                seus dados pessoais com terceiros. Sua privacidade é nossa prioridade.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Posso mudar de plano depois?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. 
                Ajustaremos a cobrança proporcionalmente.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSection;

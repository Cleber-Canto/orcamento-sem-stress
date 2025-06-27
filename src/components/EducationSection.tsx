
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronRight, ChevronDown, ExternalLink } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const EducationSection = () => {
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const educationContent = [
    {
      id: 'budget',
      title: '💰 Como Montar um Orçamento',
      icon: '💰',
      summary: 'Aprenda a organizar suas finanças de forma simples e efetiva',
      content: [
        {
          subtitle: 'O que é um orçamento?',
          text: 'Um orçamento é um plano que mostra quanto dinheiro você ganha e como pretende gastá-lo durante um período específico (geralmente um mês).'
        },
        {
          subtitle: 'Passo a passo:',
          text: '1. Liste toda sua renda mensal\n2. Anote todos os gastos fixos (aluguel, contas, etc.)\n3. Defina valores para gastos variáveis (alimentação, lazer)\n4. Reserve uma quantia para poupança\n5. Acompanhe e ajuste conforme necessário'
        },
        {
          subtitle: 'Regra 50-30-20:',
          text: '• 50% para necessidades básicas\n• 30% para desejos e lazer\n• 20% para poupança e investimentos'
        }
      ]
    },
    {
      id: 'emergency',
      title: '🚨 Reserva de Emergência',
      icon: '🚨',
      summary: 'Entenda a importância e como criar sua reserva de segurança',
      content: [
        {
          subtitle: 'Por que ter uma reserva?',
          text: 'A reserva de emergência é fundamental para situações imprevistas como desemprego, problemas de saúde ou despesas urgentes inesperadas.'
        },
        {
          subtitle: 'Quanto guardar?',
          text: 'O ideal é ter entre 3 a 6 meses dos seus gastos mensais guardados. Se você gasta R$ 2.000 por mês, sua reserva deve ter entre R$ 6.000 e R$ 12.000.'
        },
        {
          subtitle: 'Onde guardar?',
          text: 'A reserva deve estar em investimentos de alta liquidez e baixo risco, como poupança, CDB ou fundos DI. O importante é poder resgatar rapidamente quando necessário.'
        }
      ]
    },
    {
      id: 'debt',
      title: '🎯 Como Sair das Dívidas',
      icon: '🎯',
      summary: 'Estratégias práticas para quitar suas dívidas e retomar o controle',
      content: [
        {
          subtitle: '1. Organize suas dívidas',
          text: 'Liste todas as dívidas com: valor total, valor da parcela, taxa de juros e prazo. Isso te dará uma visão clara da situação.'
        },
        {
          subtitle: '2. Priorize as dívidas',
          text: 'Quite primeiro as dívidas com juros mais altos (cartão de crédito, crediário). Isso economiza dinheiro a longo prazo.'
        },
        {
          subtitle: '3. Negocie as dívidas',
          text: 'Entre em contato com os credores para negociar desconto à vista ou parcelamento com juros menores. Muitas vezes é possível conseguir condições melhores.'
        },
        {
          subtitle: '4. Corte gastos desnecessários',
          text: 'Identifique onde pode economizar temporariamente: streaming, delivery, compras por impulso. Todo dinheiro economizado vai para quitar dívidas.'
        },
        {
          subtitle: '5. Considere renda extra',
          text: 'Freelances, vendas online, trabalhos extras nos finais de semana podem acelerar o pagamento das dívidas.'
        }
      ]
    },
    {
      id: 'saving',
      title: '🏦 Primeiros Passos para Poupar',
      icon: '🏦',
      summary: 'Desenvolva o hábito de poupar, mesmo com pouco dinheiro',
      content: [
        {
          subtitle: 'Comece pequeno',
          text: 'Não precisa poupar muito no início. Mesmo R$ 50 por mês já é um excelente começo. O importante é criar o hábito.'
        },
        {
          subtitle: 'Automatize a poupança',
          text: 'Configure transferências automáticas para a poupança logo após receber o salário. Assim você "paga a si mesmo" primeiro.'
        },
        {
          subtitle: 'Desafio das moedas',
          text: 'Guarde todas as moedas que receber de troco. Ao final do mês, deposite na poupança. É surpreendente quanto acumula!'
        },
        {
          subtitle: 'Corte um gasto pequeno',
          text: 'Identifique um gasto pequeno e recorrente (como aquele café diário) e redirecione esse valor para a poupança.'
        }
      ]
    },
    {
      id: 'mindset',
      title: '🧠 Mentalidade Financeira',
      icon: '🧠',
      summary: 'Desenvolva uma relação saudável com o dinheiro',
      content: [
        {
          subtitle: 'Entenda seus gatilhos',
          text: 'Identifique o que te leva a gastar impulsivamente: estresse, tédio, promoções. Conhecendo seus gatilhos, você pode controlá-los melhor.'
        },
        {
          subtitle: 'Estabeleça objetivos claros',
          text: 'Tenha metas específicas e com prazo: "Quero economizar R$ 1.000 em 6 meses para trocar de celular". Objetivos claros motivam mais.'
        },
        {
          subtitle: 'Celebre pequenas vitórias',
          text: 'Reconheça e comemore cada progresso, mesmo que pequeno. Pagou uma dívida? Economizou o valor da meta do mês? Celebre!'
        },
        {
          subtitle: 'Aprenda continuamente',
          text: 'Dedique 15 minutos por semana para aprender sobre finanças. Leia artigos, assista vídeos, ouça podcasts. Conhecimento é poder.'
        }
      ]
    }
  ];

  const quickTips = [
    {
      title: '💡 Dica Rápida: Regra das 24 horas',
      description: 'Antes de fazer uma compra não planejada acima de R$ 100, espere 24 horas. Muitas vezes a vontade passa!'
    },
    {
      title: '📱 Dica Rápida: Apps úteis',
      description: 'Use aplicativos para comparar preços, encontrar cupons de desconto e controlar gastos no dia a dia.'
    },
    {
      title: '🎯 Dica Rápida: Metas SMART',
      description: 'Suas metas devem ser Específicas, Mensuráveis, Atingíveis, Relevantes e com Tempo definido.'
    },
    {
      title: '🏪 Dica Rápida: Lista de compras',
      description: 'Sempre vá ao mercado com lista e, se possível, com um valor limite em mente. Isso evita compras por impulso.'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Educação Financeira
          </CardTitle>
          <p className="text-sm text-gray-600">
            Aprenda conceitos fundamentais para ter mais controle sobre suas finanças
          </p>
        </CardHeader>
      </Card>

      {/* Dicas Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">⚡ Dicas Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickTips.map((tip, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-800 mb-2">{tip.title}</h4>
                <p className="text-sm text-blue-700">{tip.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conteúdo Educativo Expandível */}
      <div className="space-y-4">
        {educationContent.map((section) => (
          <Card key={section.id}>
            <Collapsible open={openSections.includes(section.id)}>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-2xl">{section.icon}</span>
                        {section.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{section.summary}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleSection(section.id)}
                    >
                      {openSections.includes(section.id) ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </Button>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  {section.content.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <h4 className="font-semibold text-gray-800">{item.subtitle}</h4>
                      <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Recursos Externos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="h-5 w-5" />
            Recursos Recomendados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">📚 Livros Recomendados</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• "Pai Rico, Pai Pobre" - Robert Kiyosaki</li>
                <li>• "O Homem Mais Rico da Babilônia" - George S. Clason</li>
                <li>• "Me Poupe!" - Nathalia Arcuri</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">🎥 Canais do YouTube</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Me Poupe! - Nathalia Arcuri</li>
                <li>• Primo Rico</li>
                <li>• Manual do Homem Moderno</li>
              </ul>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">📱 Apps Úteis</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Organizze - Controle financeiro</li>
                <li>• GuiaBolso - Gestão de gastos</li>
                <li>• Mobills - Planejamento financeiro</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationSection;

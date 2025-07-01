
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Youtube, 
  DollarSign, 
  TrendingUp, 
  PiggyBank,
  Target,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const FinancialEducationSection: React.FC = () => {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  const markLessonComplete = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      setCompletedLessons([...completedLessons, lessonId]);
    }
  };

  const educationalContent = {
    basics: [
      {
        id: 'budget-basics',
        title: 'Orçamento Pessoal - Primeiros Passos',
        description: 'Aprenda a criar e manter um orçamento eficiente',
        content: 'Um orçamento é a base de uma vida financeira saudável. Comece listando todas suas receitas e despesas. A regra 50-30-20 é um ótimo ponto de partida: 50% para necessidades, 30% para desejos e 20% para poupança.',
        tips: [
          'Anote todos os gastos por pelo menos 30 dias',
          'Separe gastos essenciais dos supérfluos',
          'Defina metas realistas e específicas',
          'Revise seu orçamento mensalmente'
        ]
      },
      {
        id: 'emergency-fund',
        title: 'Reserva de Emergência',
        description: 'Por que ter e como construir sua reserva',
        content: 'A reserva de emergência deve cobrir de 3 a 6 meses dos seus gastos essenciais. É sua proteção contra imprevistos como desemprego, problemas de saúde ou reparos urgentes.',
        tips: [
          'Comece com R$ 1.000 como meta inicial',
          'Guarde em investimentos líquidos (poupança, CDB)',
          'Automatize a poupança - separe primeiro, gaste depois',
          'Só use em emergências reais'
        ]
      }
    ],
    intermediate: [
      {
        id: 'debt-management',
        title: 'Gestão de Dívidas',
        description: 'Estratégias para quitar e evitar dívidas',
        content: 'Dívidas com juros altos consomem seu dinheiro. Priorize quitá-las usando a estratégia da bola de neve (menor valor primeiro) ou avalanche (maior juros primeiro).',
        tips: [
          'Liste todas as dívidas com valores e juros',
          'Negocie descontos à vista sempre que possível',
          'Evite o cartão de crédito rotativo',
          'Considere portabilidade para taxas menores'
        ]
      },
      {
        id: 'investments-101',
        title: 'Investimentos para Iniciantes',
        description: 'Primeiros passos no mundo dos investimentos',
        content: 'Investir é fazer seu dinheiro trabalhar para você. Comece conhecendo seu perfil de risco e diversifique seus investimentos entre renda fixa e variável.',
        tips: [
          'Comece pela renda fixa (CDB, Tesouro Direto)',
          'Estude antes de investir em ações',
          'Diversifique seus investimentos',
          'Pense no longo prazo'
        ]
      }
    ]
  };

  const recommendedChannels = [
    {
      name: 'Primo Rico',
      description: 'Educação financeira e investimentos',
      url: 'https://www.youtube.com/@PrimoRico',
      topics: ['Investimentos', 'Renda Passiva', 'Planejamento Financeiro']
    },
    {
      name: 'Me Poupe!',
      description: 'Finanças pessoais com Nathália Arcuri',
      url: 'https://www.youtube.com/@MePoupeOficial',
      topics: ['Orçamento', 'Poupança', 'Economia Doméstica']
    },
    {
      name: 'Gustavo Cerbasi',
      description: 'Planejamento financeiro e comportamento',
      url: 'https://www.youtube.com/@GustavoCerbasi',
      topics: ['Planejamento', 'Comportamento', 'Aposentadoria']
    }
  ];

  const recommendedBooks = [
    {
      title: 'Pai Rico, Pai Pobre',
      author: 'Robert Kiyosaki',
      description: 'Clássico sobre mentalidade financeira e ativos vs passivos',
      keyLessons: ['Diferença entre ativos e passivos', 'Importância da educação financeira', 'Mentalidade empreendedora']
    },
    {
      title: 'O Homem Mais Rico da Babilônia',
      author: 'George S. Clason',
      description: 'Princípios fundamentais de economia e poupança',
      keyLessons: ['Pague-se primeiro', 'Faça seu dinheiro trabalhar', 'Controle seus gastos']
    },
    {
      title: 'Casais Inteligentes Enriquecem Juntos',
      author: 'Gustavo Cerbasi',
      description: 'Planejamento financeiro para casais',
      keyLessons: ['Comunicação financeira', 'Objetivos em comum', 'Divisão de responsabilidades']
    },
    {
      title: 'Do Mil ao Milhão',
      author: 'Thiago Nigro (Primo Rico)',
      description: 'Estratégias práticas para construir patrimônio',
      keyLessons: ['Poupar vs Investir', 'Renda extra', 'Mindset de crescimento']
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Educação Financeira</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle className="h-4 w-4 text-green-500" />
          {completedLessons.length} lições concluídas
        </div>
      </div>

      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lessons">Lições</TabsTrigger>
          <TabsTrigger value="channels">Canais</TabsTrigger>
          <TabsTrigger value="books">Livros</TabsTrigger>
          <TabsTrigger value="tools">Ferramentas</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-4">
          <div className="grid gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Fundamentos
              </h3>
              <div className="grid gap-3">
                {educationalContent.basics.map((lesson) => (
                  <Card key={lesson.id} className={`${completedLessons.includes(lesson.id) ? 'border-green-200 bg-green-50' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{lesson.title}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                        </div>
                        {completedLessons.includes(lesson.id) && (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{lesson.content}</p>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Dicas práticas:</h4>
                        <ul className="text-sm space-y-1">
                          {lesson.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-500 text-xs">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {!completedLessons.includes(lesson.id) && (
                        <Button 
                          size="sm" 
                          className="mt-4"
                          onClick={() => markLessonComplete(lesson.id)}
                        >
                          Marcar como Concluída
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Intermediário
              </h3>
              <div className="grid gap-3">
                {educationalContent.intermediate.map((lesson) => (
                  <Card key={lesson.id} className={`${completedLessons.includes(lesson.id) ? 'border-green-200 bg-green-50' : ''}`}>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{lesson.title}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                        </div>
                        {completedLessons.includes(lesson.id) && (
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4">{lesson.content}</p>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Dicas práticas:</h4>
                        <ul className="text-sm space-y-1">
                          {lesson.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-blue-500 text-xs">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {!completedLessons.includes(lesson.id) && (
                        <Button 
                          size="sm" 
                          className="mt-4"
                          onClick={() => markLessonComplete(lesson.id)}
                        >
                          Marcar como Concluída
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="channels" className="space-y-4">
          <div className="grid gap-4">
            {recommendedChannels.map((channel, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Youtube className="h-5 w-5 text-red-500" />
                        {channel.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{channel.description}</p>
                    </div>
                    <Button size="sm" variant="outline" asChild>
                      <a href={channel.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Visitar
                      </a>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {channel.topics.map((topic, topicIndex) => (
                      <span 
                        key={topicIndex}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="books" className="space-y-4">
          <div className="grid gap-4">
            {recommendedBooks.map((book, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    {book.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">por {book.author}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{book.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Principais lições:</h4>
                    <ul className="text-sm space-y-1">
                      {book.keyLessons.map((lesson, lessonIndex) => (
                        <li key={lessonIndex} className="flex items-start gap-2">
                          <span className="text-green-500 text-xs">•</span>
                          {lesson}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Calculadora de Objetivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Use esta seção de "Metas" do seu controle financeiro para definir e acompanhar seus objetivos.
                </p>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Como usar:</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Defina valores e prazos específicos</li>
                    <li>• Calcule quanto poupar mensalmente</li>
                    <li>• Acompanhe o progresso visualmente</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-green-600" />
                  Controle de Orçamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Use a seção "Orçamento" para definir limites por categoria e controlar seus gastos.
                </p>
                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Dicas de uso:</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Comece com a regra 50-30-20</li>
                    <li>• Monitore alertas de limite</li>
                    <li>• Ajuste mensalmente conforme necessário</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  Controle de Parcelas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Acompanhe todas suas compras parceladas e compromissos futuros.
                </p>
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Benefícios:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Evita o endividamento excessivo</li>
                    <li>• Planeja o fluxo de caixa futuro</li>
                    <li>• Controla compromissos do cartão</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialEducationSection;

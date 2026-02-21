import React, { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Loader2 } from 'lucide-react';
import { Expense, Income, Goal } from '@/types/financial';
import { jsPDF } from 'jspdf';

interface ReportSectionProps {
  expenses: Expense[];
  incomes: Income[];
  goals: Goal[];
  monthlyIncome: number;
  totalIncome: number;
  totalExpenses: number;
  remainingBalance: number;
}

const ReportSection: React.FC<ReportSectionProps> = ({
  expenses,
  incomes,
  goals,
  monthlyIncome,
  totalIncome,
  totalExpenses,
  remainingBalance,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const formatCurrency = (value: number) =>
    `R$ ${value.toFixed(2).replace('.', ',')}`;

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Relatório Financeiro', pageWidth / 2, y, { align: 'center' });
      y += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, y, { align: 'center' });
      y += 15;

      // Summary
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Resumo Financeiro', 14, y);
      y += 8;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const summaryItems = [
        ['Renda Total:', formatCurrency(totalIncome)],
        ['Salário Base:', formatCurrency(monthlyIncome)],
        ['Total de Despesas:', formatCurrency(totalExpenses)],
        ['Saldo Restante:', formatCurrency(remainingBalance)],
      ];

      summaryItems.forEach(([label, value]) => {
        doc.text(label, 14, y);
        doc.text(value, 120, y);
        y += 7;
      });
      y += 5;

      // Expenses by category
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Despesas por Categoria', 14, y);
      y += 8;

      const categoryTotals: Record<string, number> = {};
      expenses.forEach((exp) => {
        categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
      });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1])
        .forEach(([category, total]) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          doc.text(category, 14, y);
          doc.text(formatCurrency(total), 120, y);
          y += 6;
        });
      y += 5;

      // Recent expenses
      if (y > 240) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Últimas Despesas', 14, y);
      y += 8;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Data', 14, y);
      doc.text('Descrição', 45, y);
      doc.text('Categoria', 110, y);
      doc.text('Valor', 160, y);
      y += 6;

      doc.setFont('helvetica', 'normal');
      expenses.slice(0, 30).forEach((exp) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        doc.text(new Date(exp.date).toLocaleDateString('pt-BR'), 14, y);
        doc.text(exp.description.substring(0, 30), 45, y);
        doc.text(exp.category.substring(0, 20), 110, y);
        doc.text(formatCurrency(exp.amount), 160, y);
        y += 5;
      });
      y += 5;

      // Incomes
      if (incomes.length > 0) {
        if (y > 240) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Rendas', 14, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        incomes.forEach((income) => {
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
          doc.text(income.description, 14, y);
          doc.text(income.type, 100, y);
          doc.text(formatCurrency(income.amount), 150, y);
          y += 6;
        });
        y += 5;
      }

      // Goals
      if (goals.length > 0) {
        if (y > 240) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Metas', 14, y);
        y += 8;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        goals.forEach((goal) => {
          if (y > 280) {
            doc.addPage();
            y = 20;
          }
          const progress = goal.target > 0 ? ((goal.current / goal.target) * 100).toFixed(1) : '0';
          doc.text(goal.name, 14, y);
          doc.text(`${formatCurrency(goal.current)} / ${formatCurrency(goal.target)} (${progress}%)`, 80, y);
          y += 6;
        });
      }

      doc.save(`relatorio-financeiro-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Relatório Financeiro</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gerar Relatório em PDF
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Gere um relatório completo com resumo financeiro, despesas por categoria, 
            últimas transações, rendas e metas.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <div className="font-semibold text-green-700">Renda Total</div>
              <div className="text-green-800 font-bold">{formatCurrency(totalIncome)}</div>
            </div>
            <div className="p-3 bg-red-50 rounded-lg text-center">
              <div className="font-semibold text-red-700">Despesas</div>
              <div className="text-red-800 font-bold">{formatCurrency(totalExpenses)}</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <div className="font-semibold text-blue-700">Saldo</div>
              <div className="text-blue-800 font-bold">{formatCurrency(remainingBalance)}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <div className="font-semibold text-purple-700">Transações</div>
              <div className="text-purple-800 font-bold">{expenses.length}</div>
            </div>
          </div>

          <Button
            onClick={generatePDF}
            disabled={isGenerating}
            className="w-full md:w-auto"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Baixar Relatório PDF
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportSection;


/**
 * Calcula a data de vencimento baseada na data atual
 * @param dataAtual Data atual ou data da compra
 * @returns Data de vencimento (30 dias após a data atual)
 */
export function calcularDataVencimento(dataAtual: Date): Date {
  console.log('=== CALCULANDO DATA DE VENCIMENTO ===');
  console.log('📅 Data atual recebida:', dataAtual.toLocaleDateString('pt-BR'));
  
  const dataVencimento = new Date(dataAtual);
  dataVencimento.setDate(dataVencimento.getDate() + 30);
  
  console.log('📅 Data de vencimento calculada:', dataVencimento.toLocaleDateString('pt-BR'));
  return dataVencimento;
}

/**
 * Formata uma data para o padrão brasileiro DD/MM/AAAA
 * @param data Data a ser formatada
 * @returns String formatada no padrão DD/MM/AAAA
 */
export const formatoPersonalizado = (data: Date): string => {
  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

/**
 * Calcula a primeira parcela que vence no mês seguinte, mesmo dia
 * @param dataCompra Data da compra (string YYYY-MM-DD)
 * @returns Data da primeira parcela
 */
export const calcularPrimeiraParcela = (dataCompra: string): Date => {
  console.log('=== CALCULANDO PRIMEIRA PARCELA CORRETA ===');
  console.log('📅 Data da compra string:', dataCompra);
  
  const dataCompraObj = new Date(dataCompra + 'T00:00:00');
  console.log('📅 Data da compra parseada:', dataCompraObj.toLocaleDateString('pt-BR'));
  console.log('📅 Componentes da compra: Dia', dataCompraObj.getDate(), 'Mês', dataCompraObj.getMonth() + 1, 'Ano', dataCompraObj.getFullYear());
  
  // A primeira parcela vence no MESMO DIA do MÊS SEGUINTE
  const primeiraParcela = new Date(dataCompraObj);
  primeiraParcela.setMonth(primeiraParcela.getMonth() + 1);
  
  console.log('📅 Primeira parcela calculada:', primeiraParcela.toLocaleDateString('pt-BR'));
  console.log('📅 Componentes da 1ª parcela: Dia', primeiraParcela.getDate(), 'Mês', primeiraParcela.getMonth() + 1, 'Ano', primeiraParcela.getFullYear());
  console.log('📅 VERIFICAÇÃO FINAL: Compra em', dataCompraObj.getDate() + '/' + (dataCompraObj.getMonth() + 1), '→ Primeira parcela', primeiraParcela.getDate() + '/' + (primeiraParcela.getMonth() + 1));
  
  return primeiraParcela;
};

/**
 * Valida e confirma uma data de compra
 * @param dataCompra String da data de compra no formato YYYY-MM-DD
 * @returns Objeto com informações da data validada
 */
export const confirmarDataCompra = (dataCompra: string) => {
  console.log('=== CONFIRMANDO DATA DA COMPRA ===');
  console.log('📅 Data da compra string:', dataCompra);
  
  const data = new Date(dataCompra + 'T00:00:00');
  const hoje = new Date();
  
  console.log('📅 Data parseada:', data.toLocaleDateString('pt-BR'));
  console.log('📅 Data atual:', hoje.toLocaleDateString('pt-BR'));
  
  // Usar a nova função que calcula corretamente
  const primeiraParcelaData = calcularPrimeiraParcela(dataCompra);
  
  console.log('📅 CONFIRMAÇÃO: Primeira parcela será em:', primeiraParcelaData.toLocaleDateString('pt-BR'));
  
  return {
    dataCompra: data,
    dataCompraFormatada: formatoPersonalizado(data),
    primeiraParcelaData,
    primeiraParcelaFormatada: formatoPersonalizado(primeiraParcelaData),
    isDataValida: data <= hoje,
    diasAteVencimento: Math.ceil((primeiraParcelaData.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
  };
};

// Exemplo de uso das funções
export const exemploUso = () => {
  const hoje = new Date();
  const vencimento = calcularDataVencimento(hoje);

  console.log("Data atual:", hoje.toLocaleDateString());
  console.log("Data de vencimento:", vencimento.toLocaleDateString());
  console.log("Data de vencimento formatada:", formatoPersonalizado(vencimento));
};

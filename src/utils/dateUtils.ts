
// Função para calcular a data da primeira parcela baseada na data da compra
export const calculateFirstInstallmentDate = (purchaseDate: string) => {
  const purchase = new Date(purchaseDate);
  
  console.log('Data da compra original:', purchase);
  
  // A primeira parcela vence no mês seguinte, mantendo o mesmo dia
  const firstInstallmentDate = new Date(purchase);
  firstInstallmentDate.setMonth(firstInstallmentDate.getMonth() + 1);
  
  console.log('Primeira parcela calculada para:', firstInstallmentDate);
  
  return firstInstallmentDate;
};

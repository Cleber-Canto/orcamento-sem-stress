
export const validateForm = (description: string, amount: string, category: string, paymentMethod: string) => {
  if (!description || !amount || !category || !paymentMethod) {
    return {
      isValid: false,
      error: {
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive" as const,
      }
    };
  }

  return { isValid: true };
};

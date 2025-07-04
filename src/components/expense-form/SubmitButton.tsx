
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

interface SubmitButtonProps {
  isInstallment: boolean;
  installments: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ isInstallment, installments }) => {
  return (
    <Button type="submit" className="w-full" size="lg">
      <PlusCircle className="h-4 w-4 mr-2" />
      {isInstallment ? `Adicionar ${installments} Parcelas` : 'Adicionar Despesa'}
    </Button>
  );
};

export default SubmitButton;

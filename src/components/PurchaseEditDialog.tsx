
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Edit3 } from 'lucide-react';
import { Expense } from '@/types/installments';

interface PurchaseEditDialogProps {
  purchaseGroup: Expense[];
  onUpdatePurchaseDate?: (purchaseGroup: Expense[], newDate: string) => void;
}

const PurchaseEditDialog: React.FC<PurchaseEditDialogProps> = ({ 
  purchaseGroup, 
  onUpdatePurchaseDate 
}) => {
  const [newPurchaseDate, setNewPurchaseDate] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleEditDate = () => {
    const firstInstallment = purchaseGroup[0];
    const purchaseDate = new Date(firstInstallment.date);
    
    setNewPurchaseDate(purchaseDate.toISOString().split('T')[0]);
    setIsOpen(true);
  };

  const handleSaveDate = () => {
    if (onUpdatePurchaseDate && newPurchaseDate) {
      onUpdatePurchaseDate(purchaseGroup, newPurchaseDate);
      setIsOpen(false);
      setNewPurchaseDate('');
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    setNewPurchaseDate('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEditDate}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <Edit3 className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Data da Compra</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="purchase-date">Data da Compra</Label>
            <Input
              id="purchase-date"
              type="date"
              value={newPurchaseDate}
              onChange={(e) => setNewPurchaseDate(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSaveDate}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseEditDialog;

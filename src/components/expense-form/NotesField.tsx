
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NotesFieldProps {
  notes: string;
  setNotes: (value: string) => void;
}

const NotesField: React.FC<NotesFieldProps> = ({ notes, setNotes }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="notes">Observações</Label>
      <Textarea
        id="notes"
        placeholder="Informações adicionais (opcional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
      />
    </div>
  );
};

export default NotesField;

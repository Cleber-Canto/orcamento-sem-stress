import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Camera, ImageIcon, X, ZoomIn } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

interface ReceiptAttachmentProps {
  receiptImage: string;
  setReceiptImage: (value: string) => void;
}

const ReceiptAttachment: React.FC<ReceiptAttachmentProps> = ({
  receiptImage,
  setReceiptImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = (height * MAX_SIZE) / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = (width * MAX_SIZE) / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
          setReceiptImage(compressedBase64);
        }
        setIsProcessing(false);
      };
      img.onerror = () => setIsProcessing(false);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => setIsProcessing(false);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const removeImage = () => {
    setReceiptImage('');
  };

  return (
    <div className="space-y-3">
      <Label>Foto do Comprovante (opcional)</Label>

      {!receiptImage ? (
        <div className="flex gap-2">
          {/* Camera button - shows native camera on mobile */}
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-20 flex-col gap-1 border-dashed border-2"
            onClick={() => cameraInputRef.current?.click()}
            disabled={isProcessing}
          >
            <Camera className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Tirar Foto</span>
          </Button>

          {/* Gallery button */}
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-20 flex-col gap-1 border-dashed border-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
          >
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Galeria</span>
          </Button>

          {/* Hidden inputs */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="relative rounded-lg border overflow-hidden bg-muted">
          <img
            src={receiptImage}
            alt="Comprovante anexado"
            className="w-full max-h-48 object-contain"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="h-7 w-7 rounded-full shadow"
                >
                  <ZoomIn className="h-4 w-4" />
                  <span className="sr-only">Ampliar imagem</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl p-2">
                <img
                  src={receiptImage}
                  alt="Comprovante ampliado"
                  className="w-full object-contain rounded"
                />
              </DialogContent>
            </Dialog>

            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="h-7 w-7 rounded-full shadow"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remover imagem</span>
            </Button>
          </div>
          <div className="p-2 text-center">
            <span className="text-xs text-muted-foreground">
              Comprovante anexado
            </span>
          </div>
        </div>
      )}

      {isProcessing && (
        <p className="text-xs text-muted-foreground text-center animate-pulse">
          Processando imagem...
        </p>
      )}
    </div>
  );
};

export default ReceiptAttachment;

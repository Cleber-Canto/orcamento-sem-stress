
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ForgotPasswordFormProps {
  onResetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onResetPassword, onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await onResetPassword(email.trim());
      
      if (result.success) {
        toast({
          title: "✅ Email enviado!",
          description: result.message,
        });
        setEmail('');
      } else {
        setErrors({ email: result.message });
        toast({
          title: "❌ Erro na recuperação",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro na recuperação:', error);
      toast({
        title: "❌ Erro inesperado",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Esqueceu sua senha?
        </h3>
        <p className="text-sm text-gray-600">
          Digite seu email para receber as instruções de recuperação
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reset-email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email Cadastrado
        </Label>
        <Input
          id="reset-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({...errors, email: ''});
          }}
          placeholder="Digite seu email"
          disabled={isLoading}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.email}
          </p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Mail className="h-4 w-4 mr-2" />
            Enviar Instruções
          </>
        )}
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={onBackToLogin}
        disabled={isLoading}
        className="w-full flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao Login
      </Button>

      <div className="text-center pt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
        💡 <strong>Dica:</strong> Verifique sua caixa de entrada e spam
      </div>
    </form>
  );
};

export default ForgotPasswordForm;

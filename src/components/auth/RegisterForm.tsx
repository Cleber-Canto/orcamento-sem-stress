
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, User, Mail, Lock, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RegisterFormProps {
  onRegister: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister, onSwitchToLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Campos inválidos",
        description: "Por favor, corrija os erros no formulário.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setErrors({});
    
    try {
      console.log('🔄 Tentando cadastrar usuário:', email);
      const result = await onRegister(name.trim(), email.trim(), password);
      
      if (result.success) {
        setRegistrationSuccess(true);
        toast({
          title: "✅ Conta criada com sucesso!",
          description: result.message,
        });
        // Limpar formulário
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setErrors({ email: result.message });
        toast({
          title: "❌ Erro no cadastro",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      toast({
        title: "❌ Erro inesperado",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Se cadastro foi bem-sucedido, mostrar mensagem de sucesso
  if (registrationSuccess) {
    return (
      <div className="space-y-6 text-center">
        <div className="bg-green-50 p-6 rounded-lg border border-green-200">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Conta criada com sucesso!
          </h3>
          <p className="text-green-700 text-sm mb-4">
            Sua conta foi criada. Agora você pode fazer login no sistema.
          </p>
        </div>

        <Button
          onClick={onSwitchToLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
        >
          Fazer Login Agora
        </Button>

        <div className="text-center pt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
          🎉 Bem-vindo ao FinanceApp! Use suas credenciais para entrar.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Nome Completo
        </Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors({...errors, name: ''});
          }}
          placeholder="Digite seu nome completo"
          disabled={isLoading}
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.name}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          Email
        </Label>
        <Input
          id="email"
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

      <div className="space-y-2">
        <Label htmlFor="password" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Senha
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors({...errors, password: ''});
          }}
          placeholder="Mínimo 6 caracteres"
          disabled={isLoading}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.password}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Confirmar Senha
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
          }}
          placeholder="Digite a senha novamente"
          disabled={isLoading}
          className={errors.confirmPassword ? 'border-red-500' : ''}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.confirmPassword}
          </p>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3" 
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Criando conta...
          </>
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-2" />
            Criar Conta
          </>
        )}
      </Button>

      <div className="text-center pt-2">
        <Button
          type="button"
          variant="link"
          onClick={onSwitchToLogin}
          disabled={isLoading}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Já tem conta? Fazer login
        </Button>
      </div>

      <div className="text-center pt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
        🔒 Seus dados ficam salvos localmente no navegador
      </div>
    </form>
  );
};

export default RegisterForm;

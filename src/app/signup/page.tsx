
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { Loader2, UserPlus, Zap } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não conferem.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      await initiateEmailSignUp(auth, email, password);
      router.push('/');
    } catch (err: any) {
      setError(getFriendlyAuthErrorMessage(err.code));
      setIsLoading(false);
    }
  };

  const getFriendlyAuthErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'Este e-mail já está em uso.';
      case 'auth/invalid-email':
        return 'O formato do e-mail é inválido.';
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres.';
      default:
        return 'Ocorreu um erro ao criar a conta. Tente novamente.';
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="absolute top-8 left-8 text-2xl font-headline font-bold text-primary flex items-center">
         <Zap className="w-6 h-6 mr-2 text-primary/80 fill-accent" />
         Painel de Liderança Técnica
       </div>
      <Card className="w-full max-w-sm shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Criar Conta</CardTitle>
          <CardDescription>Crie uma conta para gerenciar suas tarefas.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignUp}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail (Matrícula)</Label>
              <Input
                id="email"
                type="email"
                placeholder="seunome@empresa.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repita a senha"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Cadastrar
                </>
              )}
            </Button>
             <p className="text-xs text-muted-foreground">
                Já tem uma conta?{' '}
                <Link href="/login" className="underline text-primary hover:text-primary/80">
                    Faça login
                </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { Loader2, LogIn, Zap } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      await initiateEmailSignIn(auth, email, password);
      router.push('/');
    } catch (err: any) {
      setError(getFriendlyAuthErrorMessage(err.code));
      setIsLoading(false);
    }
  };

  const getFriendlyAuthErrorMessage = (errorCode: string) => {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'E-mail ou senha inválidos.';
      case 'auth/invalid-email':
        return 'O formato do e-mail é inválido.';
      default:
        return 'Ocorreu um erro ao tentar fazer login. Tente novamente.';
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
          <CardTitle className="text-2xl font-headline">Login</CardTitle>
          <CardDescription>Acesse seu painel de gerenciamento de tarefas.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignIn}>
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
                placeholder="********"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  Entrando...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 h-4 w-4" />
                  Entrar
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
                Não tem uma conta?{' '}
                <Link href="/signup" className="underline text-primary hover:text-primary/80">
                    Cadastre-se
                </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}

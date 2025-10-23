'use client';
import { LogOut, Zap } from 'lucide-react';
import { useAuth } from '../auth-provider';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Header = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user) {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour < 12) {
        setGreeting('Bom dia');
      } else if (currentHour >= 12 && currentHour < 18) {
        setGreeting('Boa tarde');
      } else {
        setGreeting('Boa noite');
      }

      // Use display name if available, otherwise parse email
      setUserName(user.displayName || user.email?.split('@')[0] || 'Usuário');
    }
  }, [user]);

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/login');
  };

  return (
    <header className="flex justify-between items-start">
      <div>
        <h1 className="text-4xl font-headline font-bold text-primary flex items-center">
          <Zap className="w-8 h-8 mr-3 text-primary/80 fill-accent" />
          Painel de Liderança Técnica
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">
          Gerenciamento de Tarefas com IA (Dados Persistidos via Firestore).
        </p>
      </div>
      {user && (
        <div className="text-right">
          <p className="text-muted-foreground text-sm capitalize">
            Olá {userName}, {greeting}!
          </p>
          <Button variant="ghost" onClick={handleSignOut} className="mt-1">
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;

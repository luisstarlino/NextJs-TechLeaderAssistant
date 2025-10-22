
'use client';
import { LogOut, Zap } from 'lucide-react';
import { useAuth } from '../auth-provider';
import { getAuth, signOut } from 'firebase/auth';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
    router.push('/login');
  };

  return (
    <header className="flex justify-between items-center">
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
        <Button variant="ghost" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sair
        </Button>
      )}
    </header>
  );
};

export default Header;

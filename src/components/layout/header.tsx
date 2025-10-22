
import { Zap } from 'lucide-react';

const Header = () => {
  return (
    <header>
      <h1 className="text-4xl font-headline font-bold text-primary flex items-center">
        <Zap className="w-8 h-8 mr-3 text-primary/80 fill-accent" />
        Painel de Liderança Técnica
      </h1>
      <p className="text-muted-foreground mt-1 text-lg">
        Gerenciamento de Tarefas com IA (Dados Persistidos via Firestore).
      </p>
    </header>
  );
};

export default Header;

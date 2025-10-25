
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Loader2, Zap } from 'lucide-react';
import { useMemoFirebase, useFirestore } from '@/firebase';
import type { Task } from '@/lib/types';
import { handlePrompt } from '@/app/actions';
import MarkdownRenderer from '@/components/chat/markdown-renderer';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function MindMapPage() {
  const { user } = useAuth();
  const db = useFirestore();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [mindMap, setMindMap] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, `users/${user.uid}/tasks`), orderBy('Última Atualização', 'desc'));
  }, [db, user]);

  useEffect(() => {
    if (!tasksQuery) return;
    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const fetchedTasks: Task[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        'Última Atualização': doc.data()['Última Atualização']?.toDate().toLocaleDateString('pt-BR') || 'N/A',
      })) as Task[];
      setTasks(fetchedTasks);
    }, (err) => {
      const path = (tasksQuery as any)._query.path.canonicalString();
      const contextualError = new FirestorePermissionError({
        operation: 'list',
        path: path,
      });
      errorEmitter.emit('permission-error', contextualError);
      setError("Falha ao carregar tarefas. Verifique as permissões.");
    });
    return () => unsubscribe();
  }, [tasksQuery]);

  const generateMindMap = async () => {
    if (!user || tasks.length === 0) return;

    setIsLoading(true);
    setError(null);
    setMindMap(null);

    const result = await handlePrompt("Gere um mapa mental detalhado das minhas tarefas.", tasks, user.uid);

    if (result.type === 'error') {
      setError(result.content);
    } else {
      setMindMap(result.content);
    }

    setIsLoading(false);
  };

  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <BrainCircuit className="w-6 h-6" />
          Mind Map de Tarefas
        </CardTitle>
        <CardDescription>
          Clique no botão para gerar uma visualização em mapa mental de suas tarefas usando IA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center mb-6">
          <Button onClick={generateMindMap} disabled={isLoading || tasks.length === 0}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Gerando Mind Map...
              </>
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" />
                Gerar Mapa Mental com IA
              </>
            )}
          </Button>
        </div>

        <div className="prose prose-sm max-w-none text-foreground border-2 border-dashed rounded-lg p-6 min-h-[50vh]">
          {error && (
             <div className="text-destructive font-semibold">
                <p>Erro ao gerar o mapa mental:</p>
                <p>{error}</p>
             </div>
          )}
          {mindMap ? (
            <MarkdownRenderer content={mindMap} />
          ) : (
             !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground italic">
                    <p>O mapa mental das suas tarefas aparecerá aqui.</p>
                </div>
             )
          )}
           {isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                    <p>Analisando tarefas e construindo visualização...</p>
                </div>
           )}
        </div>
      </CardContent>
    </Card>
  );
}

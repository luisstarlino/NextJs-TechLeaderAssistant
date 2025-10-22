
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '@/components/auth-provider';
import Header from '@/components/layout/header';
import ChatPanel from '@/components/chat/chat-panel';
import TaskDashboard from '@/components/tasks/task-dashboard';
import { handlePrompt } from './actions';
import type { Task } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useMemoFirebase, useFirestore } from '@/firebase';
import { addTask, updateTask, deleteTask } from '@/lib/firestore-service';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const { user, isAuthReady } = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assistantOutput, setAssistantOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthReady && !user) {
      router.push('/login');
    }
  }, [isAuthReady, user, router]);

  const tasksQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, `users/${user.uid}/tasks`), orderBy('Última Atualização', 'desc'));
  }, [db, user]);


  useEffect(() => {
    if (!tasksQuery || !db) {
      setTasks([]);
      return;
    }

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const fetchedTasks: Task[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        'Última Atualização': doc.data()['Última Atualização']?.toDate().toLocaleDateString('pt-BR') || 'N/A',
      })) as Task[];
      setTasks(fetchedTasks);
      setError(null);
    }, 
    (err) => {
      const path = (tasksQuery as any)._query.path.canonicalString();
      const contextualError = new FirestorePermissionError({
        operation: 'list',
        path: path,
      });
      errorEmitter.emit('permission-error', contextualError);
      setError("Falha ao sincronizar tarefas. Verifique as permissões do Firestore.");
    });

    return () => unsubscribe();
  }, [tasksQuery, db]);

  const submitPrompt = useCallback(async (prompt: string) => {
    if (!prompt.trim() || !user || !db) return;

    setIsLoading(true);
    setError(null);
    setAssistantOutput(null);

    const result = await handlePrompt(prompt, tasks, user.uid);
    
    if (result.type === 'error') {
      setError(result.content);
    } else if (result.type === 'create' && result.task) {
        addTask(db, user.uid, result.task);
        setAssistantOutput(result.content);
        toast({ title: "Tarefa Criada", description: `A tarefa "${result.task.Tarefa}" foi adicionada.` });
    } else if (result.type === 'update' && result.task) {
        const taskToUpdate = tasks.find(t => t.id === result.task.taskId);
        if (taskToUpdate) {
            updateTask(db, user.uid, result.task.taskId, { Status: result.task.newStatus });
            setAssistantOutput(result.content);
            toast({ title: "Status Atualizado", description: `Status da tarefa "${taskToUpdate.Tarefa}" foi atualizado.` });
        }
    } else { // analysis
      setAssistantOutput(result.content);
    }

    setIsLoading(false);
  }, [tasks, user, db, toast]);

  const handleUpdateTask = useCallback((taskId: string, updatedData: Partial<Task>) => {
    if (!user || !db) return;
    updateTask(db, user.uid, taskId, updatedData);
    toast({ title: "Tarefa Atualizada", description: "Os detalhes da tarefa foram salvos." });
  }, [user, db, toast]);

  const handleDeleteTask = useCallback((taskId: string) => {
    if (!user || !db) return;
    deleteTask(db, user.uid, taskId);
    toast({
        variant: "destructive",
        title: "Tarefa Excluída",
        description: "A tarefa foi removida permanentemente.",
    });
  }, [user, db, toast]);

  if (!isAuthReady || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 lg:p-6">
      <div className="mx-auto max-w-screen-2xl">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-1">
            <ChatPanel
              assistantOutput={assistantOutput}
              error={error}
              isLoading={isLoading}
              isAuthReady={!!isAuthReady}
              onSubmit={submitPrompt}
            />
          </div>
          <div className="lg:col-span-2">
            <TaskDashboard 
              tasks={tasks} 
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

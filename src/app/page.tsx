
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { useAuth } from '@/components/auth-provider';
import Header from '@/components/layout/header';
import ChatPanel from '@/components/chat/chat-panel';
import TaskDashboard from '@/components/tasks/task-dashboard';
import { handlePrompt } from './actions';
import type { Task } from '@/lib/types';
import { db } from '@/lib/firebase';

export default function Home() {
  const { user, isAuthReady } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [assistantOutput, setAssistantOutput] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db || !isAuthReady || !user) {
      setTasks([]);
      return;
    };

    const userId = user.uid;
    const tasksCollectionRef = collection(db, `users/${userId}/tasks`);
    const q = query(tasksCollectionRef, orderBy('Última Atualização', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks: Task[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore Timestamp to string for client-side rendering
        'Última Atualização': doc.data()['Última Atualização']?.toDate().toLocaleDateString('pt-BR') || 'N/A',
      })) as Task[];
      setTasks(fetchedTasks);
    }, (err) => {
      console.error("Erro no listener do Firestore:", err);
      setError("Falha ao sincronizar tarefas em tempo real.");
    });

    return () => unsubscribe();
  }, [db, isAuthReady, user]);

  const submitPrompt = useCallback(async (prompt: string) => {
    if (!prompt.trim() || !user) return;

    setIsLoading(true);
    setError(null);
    setAssistantOutput(null);

    const result = await handlePrompt(prompt, tasks, user.uid);
    
    if (result.type === 'error') {
      setError(result.content);
    } else {
      setAssistantOutput(result.content);
    }

    setIsLoading(false);
  }, [tasks, user]);

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
            <TaskDashboard tasks={tasks} />
          </div>
        </div>
      </div>
    </main>
  );
}

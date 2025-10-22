
'use server';

import { createTaskFromNaturalLanguage } from '@/ai/flows/create-tasks-from-natural-language';
import { generateTaskAnalysis } from '@/ai/flows/generate-task-analysis';
import { updateTaskStatus as updateTaskStatusFlow } from '@/ai/flows/update-task-status';
import { db } from '@/lib/firebase';
import type { Task } from '@/lib/types';
import { collection, addDoc, doc, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore';

// Helper to add a new task to Firestore
async function addTask(taskData: Omit<Task, 'id'>, userId: string): Promise<boolean> {
  if (!userId) return false;
  try {
    const tasksCollectionRef = collection(db, `artifacts/tech-leader-assistant/users/${userId}/tasks`);
    const { 'Última Atualização': _, ...dataToAdd } = taskData;
    await addDoc(tasksCollectionRef, {
        ...dataToAdd,
        'Última Atualização': serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error adding task to Firestore:', error);
    return false;
  }
}

// Helper to update an existing task in Firestore
async function updateTask(taskId: string, newStatus: string, userId: string): Promise<boolean> {
  if (!userId || !taskId) return false;
  try {
    const taskDocRef = doc(db, `artifacts/tech-leader-assistant/users/${userId}/tasks`, taskId);
    await updateDoc(taskDocRef, {
      Status: newStatus,
      'Última Atualização': serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error('Error updating task in Firestore:', error);
    return false;
  }
}

// Main server action to handle user prompts
export async function handlePrompt(
  prompt: string,
  tasks: Task[],
  userId: string
): Promise<{ type: 'analysis' | 'update' | 'error'; content: string }> {
  const lowerCasePrompt = prompt.toLowerCase();

  try {
    // 1. Handle Task Creation
    if (lowerCasePrompt.startsWith('nova tarefa:')) {
      const result = await createTaskFromNaturalLanguage({
        naturalLanguageDescription: prompt,
        currentTasks: tasks.map(t => ({ id: t.id, Tarefa: t.Tarefa, Status: t.Status, Projeto: t.Projeto })),
      });
      
      const success = await addTask(result, userId);
      if (success) {
        return { type: 'update', content: `✅ Tarefa **${result.Tarefa}** adicionada com sucesso!` };
      } else {
        return { type: 'error', content: '❌ Falha ao gravar a nova tarefa no banco de dados.' };
      }
    }

    // 2. Handle Task Status Update
    const updateMatch = lowerCasePrompt.match(/^atualize status de (.+?) para (.+)$/);
    if (updateMatch) {
      const taskNameQuery = updateMatch[1].trim();
      const newStatus = updateMatch[2].trim();

      const taskToUpdate = tasks.find(t => t.Tarefa.toLowerCase().includes(taskNameQuery));

      if (!taskToUpdate || !taskToUpdate.id) {
        return { type: 'error', content: `❌ Tarefa "${taskNameQuery}" não encontrada.` };
      }

      const flowResult = await updateTaskStatusFlow({
        taskId: taskToUpdate.id,
        newStatus: newStatus,
        taskDescription: taskToUpdate.Tarefa,
      });

      const success = await updateTask(taskToUpdate.id, flowResult.newStatus, userId);
      if (success) {
        return { type: 'update', content: `✅ Status de **${taskToUpdate.Tarefa}** atualizado para **${flowResult.newStatus}**.` };
      } else {
        return { type: 'error', content: '❌ Falha ao atualizar a tarefa no banco de dados.' };
      }
    }

    // 3. Handle General Analysis
    const analysisResult = await generateTaskAnalysis({
      taskList: tasks,
      userPrompt: prompt,
    });
    return { type: 'analysis', content: analysisResult.analysisResult };

  } catch (error: any) {
    console.error('Error handling prompt:', error);
    return { type: 'error', content: `🚨 Erro no processamento da IA: ${error.message}` };
  }
}

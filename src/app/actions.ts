'use server';

import { createTaskFromNaturalLanguage } from '@/ai/flows/create-tasks-from-natural-language';
import { generateTaskAnalysis } from '@/ai/flows/generate-task-analysis';
import { updateTaskStatus as updateTaskStatusFlow } from '@/ai/flows/update-task-status';
import type { Task } from '@/lib/types';
import { addTask, updateTaskStatus } from '@/lib/firestore-service';

// Main server action to handle user prompts
export async function handlePrompt(
  prompt: string,
  tasks: Task[],
  userId: string
): Promise<{ type: 'analysis' | 'update' | 'create' | 'error'; content: string, task?: any }> {
  const lowerCasePrompt = prompt.toLowerCase();

  try {
    // 1. Handle Task Creation
    if (lowerCasePrompt.startsWith('nova tarefa:')) {
      const result = await createTaskFromNaturalLanguage({
        naturalLanguageDescription: prompt,
        currentTasks: tasks.map(t => ({ id: t.id, Tarefa: t.Tarefa, Status: t.Status, Projeto: t.Projeto })),
      });
      
      // The AI might return an 'Última Atualização' field, but we want Firestore to set it.
      const { 'Última Atualização': _, ...taskToAdd } = result;

      // We no longer add to DB here. We send the task data back to the client.
      return { type: 'create', content: `✅ Tarefa **${result.Tarefa}** pronta para ser criada!`, task: taskToAdd };
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

      // We no longer update DB here. We send the data back to the client.
      return { type: 'update', content: `✅ Status de **${taskToUpdate.Tarefa}** pronto para ser atualizado para **${flowResult.newStatus}**.`, task: { taskId: taskToUpdate.id, newStatus: flowResult.newStatus } };
    }

    // 3. Handle General Analysis
    const analysisResult = await generateTaskAnalysis({
      taskList: tasks,
      userPrompt: prompt,
    });
    return { type: 'analysis', content: analysisResult.analysisResult };

  } catch (error: any) {
    console.error('Error handling prompt:', error);
    // Return the specific error message from the failed operation
    return { type: 'error', content: `❌ Falha na operação: ${error.message}` };
  }
}

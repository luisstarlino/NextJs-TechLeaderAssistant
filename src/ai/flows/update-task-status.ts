'use server';

/**
 * @fileOverview This file defines a Genkit flow for updating the status of a task based on natural language input.
 *
 * - updateTaskStatus - A function that updates the task status based on user input.
 * - UpdateTaskStatusInput - The input type for the updateTaskStatus function.
 * - UpdateTaskStatusOutput - The return type for the updateTaskStatus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UpdateTaskStatusInputSchema = z.object({
  taskId: z.string().describe('The ID of the task to update.'),
  newStatus: z.string().describe('The new status of the task (e.g., "completed", "in progress", "pending").'),
  taskDescription: z.string().optional().describe('The current description of the task.'),
});
export type UpdateTaskStatusInput = z.infer<typeof UpdateTaskStatusInputSchema>;

const UpdateTaskStatusOutputSchema = z.object({
  taskId: z.string().describe('The ID of the updated task.'),
  newStatus: z.string().describe('The updated status of the task.'),
});
export type UpdateTaskStatusOutput = z.infer<typeof UpdateTaskStatusOutputSchema>;

export async function updateTaskStatus(input: UpdateTaskStatusInput): Promise<UpdateTaskStatusOutput> {
  return updateTaskStatusFlow(input);
}

const updateTaskStatusPrompt = ai.definePrompt({
  name: 'updateTaskStatusPrompt',
  input: {schema: UpdateTaskStatusInputSchema},
  output: {schema: UpdateTaskStatusOutputSchema},
  prompt: `You are a task management assistant. The user wants to update the status of a task.

  The task has the following description: {{{taskDescription}}}

  The task ID is {{{taskId}}}.

  The user wants to update the status to {{{newStatus}}}.

  Return the task ID and the new status.
`,
});

const updateTaskStatusFlow = ai.defineFlow(
  {
    name: 'updateTaskStatusFlow',
    inputSchema: UpdateTaskStatusInputSchema,
    outputSchema: UpdateTaskStatusOutputSchema,
  },
  async input => {
    const {output} = await updateTaskStatusPrompt(input);
    return output!;
  }
);

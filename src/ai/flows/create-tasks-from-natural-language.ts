'use server';
/**
 * @fileOverview Creates a new task from natural language input.
 *
 * - createTaskFromNaturalLanguage - A function that handles the task creation process.
 * - CreateTaskFromNaturalLanguageInput - The input type for the createTaskFromNaturalLanguage function.
 * - CreateTaskFromNaturalLanguageOutput - The return type for the createTaskFromNaturalLanguage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateTaskFromNaturalLanguageInputSchema = z.object({
  naturalLanguageDescription: z
    .string()
    .describe("A natural language description of the task including description, responsible person, deadline, and project."),
  currentTasks: z.array(z.object({
    id: z.string().optional(),
    Tarefa: z.string(),
    Status: z.string(),
    Projeto: z.string(),
  })).describe('The current list of tasks in JSON format.'),
});
export type CreateTaskFromNaturalLanguageInput = z.infer<typeof CreateTaskFromNaturalLanguageInputSchema>;

const CreateTaskFromNaturalLanguageOutputSchema = z.object({
  Projeto: z.string().describe('The project the task belongs to.'),
  Tarefa: z.string().describe('The description of the task.'),
  Responsável: z.string().describe('The person responsible for the task.'),
  Status: z.string().describe('The status of the task, should default to "⏳ pendente".'),
  Prazo: z.string().describe('The deadline for the task.'),
  'Última Atualização': z.string().describe('The last time the task was updated.'),
  Observações: z.string().optional().describe('Any observations about the task.'),
});
export type CreateTaskFromNaturalLanguageOutput = z.infer<typeof CreateTaskFromNaturalLanguageOutputSchema>;

export async function createTaskFromNaturalLanguage(input: CreateTaskFromNaturalLanguageInput): Promise<CreateTaskFromNaturalLanguageOutput> {
  return createTaskFromNaturalLanguageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createTaskFromNaturalLanguagePrompt',
  input: {schema: CreateTaskFromNaturalLanguageInputSchema},
  output: {schema: CreateTaskFromNaturalLanguageOutputSchema},
  prompt: `You are an expert project manager. Generate a JSON object containing task details.

  Today's date for calculating deadlines is 22/10/2025.

  User Input: {{{naturalLanguageDescription}}}

  Current Tasks (JSON format, use the 'id' field for updates): {{{currentTasks}}}

  Ensure the Status defaults to \"⏳ pendente\". The output MUST be a JSON object conforming to the following schema:
  \n  {
    \"Projeto\": string,  // The project the task belongs to
    \"Tarefa\": string,   // The description of the task
    \"Responsável\": string, // The person responsible for the task
    \"Status\": string,    // The status of the task (default: \"⏳ pendente\")
    \"Prazo\": string,     // The deadline for the task
    \"Última Atualização\": string, // The last time the task was updated
    \"Observações\": string // Any observations about the task
  }
  \n  Based on the user input, extract the relevant information and populate the JSON object. Return ONLY the JSON. Do not return any markdown or any other text.`, 
  
});

const createTaskFromNaturalLanguageFlow = ai.defineFlow(
  {
    name: 'createTaskFromNaturalLanguageFlow',
    inputSchema: CreateTaskFromNaturalLanguageInputSchema,
    outputSchema: CreateTaskFromNaturalLanguageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

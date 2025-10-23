'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating task analysis, mind maps, or lists of pending tasks using generative AI.
 *
 * @exports generateTaskAnalysis - The main function to trigger the task analysis generation flow.
 * @exports GenerateTaskAnalysisInput - The input type for the generateTaskAnalysis function.
 * @exports GenerateTaskAnalysisOutput - The output type for the generateTaskAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTaskAnalysisInputSchema = z.object({
  taskList: z.array(
    z.object({
      id: z.string().optional(),
      Projeto: z.string(),
      Tarefa: z.string(),
      Responsável: z.string(),
      Status: z.string(),
      Prazo: z.string(),
      'Última Atualização': z.string(),
      Observações: z.string().optional(),
    })
  ).describe('The current list of tasks, including project, task, responsible person, status, and deadline.'),
  userPrompt: z.string().describe('The user prompt requesting task analysis, mind map, or list of pending tasks.'),
});
export type GenerateTaskAnalysisInput = z.infer<typeof GenerateTaskAnalysisInputSchema>;

const GenerateTaskAnalysisOutputSchema = z.object({
  analysisResult: z.string().describe('The generated task analysis, mind map, or list of pending tasks in markdown or Mermaid syntax.'),
});
export type GenerateTaskAnalysisOutput = z.infer<typeof GenerateTaskAnalysisOutputSchema>;

export async function generateTaskAnalysis(input: GenerateTaskAnalysisInput): Promise<GenerateTaskAnalysisOutput> {
  return generateTaskAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTaskAnalysisPrompt',
  input: {schema: GenerateTaskAnalysisInputSchema},
  output: {schema: GenerateTaskAnalysisOutputSchema},
  prompt: `You are a leadership assistant and expert in productivity and project management.

  The user has provided a list of tasks and is requesting an analysis, mind map, or list of pending tasks.
  Your goal is to use the task list to generate a helpful and informative response based on the user's request.

  Task List:
  {{#each taskList}}
  - Projeto: {{this.Projeto}}, Tarefa: {{this.Tarefa}}, Responsável: {{this.Responsável}}, Status: {{this.Status}}, Prazo: {{this.Prazo}}
  {{/each}}

  User Request: {{{userPrompt}}}

  If the user asks for a "mind map" or "mapa mental", you MUST generate the output using Mermaid syntax inside a "mermaid" code block.
  For example:
  \`\`\`mermaid
  mindmap
    root((My Tasks))
      ProjectA
        Task1
        Task2
      ProjectB
        Task3
  \`\`\`

  For all other requests, respond in markdown format.
  `,
});

const generateTaskAnalysisFlow = ai.defineFlow(
  {
    name: 'generateTaskAnalysisFlow',
    inputSchema: GenerateTaskAnalysisInputSchema,
    outputSchema: GenerateTaskAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

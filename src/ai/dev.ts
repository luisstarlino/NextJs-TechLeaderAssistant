import { config } from 'dotenv';
config();

import '@/ai/flows/update-task-status.ts';
import '@/ai/flows/create-tasks-from-natural-language.ts';
import '@/ai/flows/generate-task-analysis.ts';
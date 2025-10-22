
import { List } from 'lucide-react';
import type { Task } from '@/lib/types';
import TaskList from './task-list';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '../ui/separator';

interface TaskDashboardProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updatedData: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskDashboard: React.FC<TaskDashboardProps> = ({ tasks, onUpdateTask, onDeleteTask }) => {
  return (
    <Card className="shadow-lg h-full">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <List className="w-6 h-6" />
            Acompanhamento de Tarefas
          </CardTitle>
          <CardDescription>Lista sincronizada com Firestore</CardDescription>
        </div>
        <div className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-md">
          Total: {tasks.length}
        </div>
      </CardHeader>
      <CardContent>
        <TaskList tasks={tasks} onUpdateTask={onUpdateTask} onDeleteTask={onDeleteTask} />

        <Separator className="my-6" />

        <div>
            <h3 className="font-headline text-xl font-bold text-foreground mb-3">Instruções de Comando</h3>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                <li>
                    <strong className="text-foreground/80">Nova Tarefa:</strong> Use 
                    <code className="font-code mx-1 p-1 bg-muted rounded-sm text-primary">Nova tarefa: [descrição] — responsável: [nome] — prazo: [data] — projeto: [nome]</code>.
                </li>
                <li>
                    <strong className="text-foreground/80">Atualizar Status:</strong> Use 
                    <code className="font-code mx-1 p-1 bg-muted rounded-sm text-primary">Atualize status de [nome parcial da tarefa] para [✅ concluído / ⚙️ em andamento / ⏳ pendente]</code>.
                </li>
                <li>
                    <strong className="text-foreground/80">Análise com IA:</strong> Peça por 
                    <code className="font-code mx-1 p-1 bg-muted rounded-sm text-primary">Mapa mental</code> ou 
                    <code className="font-code mx-1 p-1 bg-muted rounded-sm text-primary">Liste as tarefas pendentes</code> para obter insights no chat.
                </li>
            </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskDashboard;

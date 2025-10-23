
'use client';
import { useState, useMemo } from 'react';
import { List, FileDown } from 'lucide-react';
import type { Task } from '@/lib/types';
import TaskList from './task-list';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '../ui/separator';
import { Button } from '../ui/button';
import { downloadCSV, downloadPDF } from '@/lib/export';

interface TaskDashboardProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updatedData: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

type SortKey = keyof Task | 'id';
type SortDirection = 'asc' | 'desc';

const TaskDashboard: React.FC<TaskDashboardProps> = ({ tasks, onUpdateTask, onDeleteTask }) => {
    const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'Última Atualização', direction: 'desc' });

    const handleSort = (key: SortKey) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedTasks = useMemo(() => {
        let sortableItems = [...tasks];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key as keyof Task] ?? '';
                const bValue = b[sortConfig.key as keyof Task] ?? '';

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [tasks, sortConfig]);

  return (
    <Card className="shadow-lg h-full">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <List className="w-6 h-6" />
            Acompanhamento de Tarefas
          </CardTitle>
          <CardDescription>Lista sincronizada com Firestore. Clique nos cabeçalhos para ordenar.</CardDescription>
        </div>
        <div className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-md">
          Total: {tasks.length}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end gap-2 mb-4">
            <Button variant="outline" size="sm" onClick={() => downloadCSV(sortedTasks)}>
                <FileDown className="mr-2 h-4 w-4" />
                Exportar para CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => downloadPDF(sortedTasks)}>
                <FileDown className="mr-2 h-4 w-4" />
                Exportar para PDF
            </Button>
        </div>
        <TaskList 
            tasks={sortedTasks} 
            onUpdateTask={onUpdateTask} 
            onDeleteTask={onDeleteTask}
            onSort={handleSort}
            sortConfig={sortConfig}
        />

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

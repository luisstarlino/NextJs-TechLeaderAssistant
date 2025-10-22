
import { CheckCircle, Clock, XCircle, AlertTriangle, Inbox } from 'lucide-react';
import type { Task } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TaskListProps {
  tasks: Task[];
}

const getStatusStyles = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('concluído') || statusLower.includes('✅')) {
    return { icon: CheckCircle, color: 'text-green-700 bg-green-100 border-green-200 dark:text-green-300 dark:bg-green-900/50 dark:border-green-700/50', label: 'Concluído' };
  }
  if (statusLower.includes('andamento') || statusLower.includes('⚙️')) {
    return { icon: Clock, color: 'text-blue-700 bg-blue-100 border-blue-200 dark:text-blue-300 dark:bg-blue-900/50 dark:border-blue-700/50', label: 'Em Andamento' };
  }
  if (statusLower.includes('atrasado') || statusLower.includes('⚠️')) {
    return { icon: XCircle, color: 'text-red-700 bg-red-100 border-red-200 dark:text-red-300 dark:bg-red-900/50 dark:border-red-700/50', label: 'Atrasado' };
  }
  return { icon: AlertTriangle, color: 'text-yellow-700 bg-yellow-100 border-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/50 dark:border-yellow-700/50', label: 'Pendente' };
};

const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
        <div className="text-center text-muted-foreground italic p-8 border-2 border-dashed rounded-lg">
            <Inbox className="w-12 h-12 mx-auto mb-2" />
            <p>Nenhuma tarefa encontrada na base de dados.</p>
            <p className="text-xs mt-1">Use o assistente para criar sua primeira tarefa!</p>
        </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader className='bg-primary/5'>
          <TableRow>
            <TableHead className="px-4 py-2 text-left text-xs font-bold text-primary uppercase tracking-wider">Projeto</TableHead>
            <TableHead className="px-4 py-2 text-left text-xs font-bold text-primary uppercase tracking-wider">Tarefa</TableHead>
            <TableHead className="px-4 py-2 text-left text-xs font-bold text-primary uppercase tracking-wider">Responsável</TableHead>
            <TableHead className="px-4 py-2 text-left text-xs font-bold text-primary uppercase tracking-wider">Prazo</TableHead>
            <TableHead className="px-4 py-2 text-left text-xs font-bold text-primary uppercase tracking-wider">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const { icon: Icon, color, label } = getStatusStyles(task.Status);
            return (
              <TableRow key={task.id} className="hover:bg-muted/50 transition-colors">
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary">{task.Projeto}</TableCell>
                <TableCell className="px-4 py-3 text-sm text-foreground max-w-xs truncate">{task.Tarefa}</TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{task.Responsável}</TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{task.Prazo}</TableCell>
                <TableCell className="px-4 py-3 whitespace-nowrap">
                  <Badge variant="outline" className={`gap-1.5 ${color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskList;

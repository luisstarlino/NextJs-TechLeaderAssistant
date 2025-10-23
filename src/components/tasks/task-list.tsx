
'use client';

import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, AlertTriangle, Inbox, MoreHorizontal, Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import type { Task } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import EditTaskDialog from './edit-task-dialog';
import { cn } from '@/lib/utils';


type SortKey = keyof Task | 'id';
type SortDirection = 'asc' | 'desc';

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (taskId: string, updatedData: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onSort: (key: SortKey) => void;
  sortConfig: { key: SortKey; direction: SortDirection } | null;
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

const TaskList: React.FC<TaskListProps> = ({ tasks, onUpdateTask, onDeleteTask, onSort, sortConfig }) => {
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleDeleteConfirm = () => {
    if (taskToDelete && taskToDelete.id) {
      onDeleteTask(taskToDelete.id);
    }
    setTaskToDelete(null);
  };

  const handleEditConfirm = (updatedData: Partial<Task>) => {
    if (taskToEdit && taskToEdit.id) {
      onUpdateTask(taskToEdit.id, updatedData);
    }
    setTaskToEdit(null);
  }

  const renderSortArrow = (key: SortKey) => {
    if (!sortConfig || sortConfig.key !== key) {
        return <ArrowUpDown className="w-3 h-3 ml-2 opacity-30" />;
    }
    return sortConfig.direction === 'asc' ? '▲' : '▼';
  };

  const SortableHeader = ({ sortKey, children }: { sortKey: SortKey, children: React.ReactNode }) => (
    <TableHead
        className="px-4 py-2 text-left text-xs font-bold text-primary uppercase tracking-wider cursor-pointer hover:bg-primary/10"
        onClick={() => onSort(sortKey)}
    >
        <div className="flex items-center">
            {children}
            <span className="ml-2">{renderSortArrow(sortKey)}</span>
        </div>
    </TableHead>
  );


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
    <>
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className='bg-primary/5'>
            <TableRow>
              {/* <SortableHeader sortKey="id">ID</SortableHeader> */}
              <SortableHeader sortKey="Projeto">Projeto</SortableHeader>
              <SortableHeader sortKey="Tarefa">Tarefa</SortableHeader>
              <SortableHeader sortKey="Responsável">Responsável</SortableHeader>
              <SortableHeader sortKey="Prazo">Prazo</SortableHeader>
              <SortableHeader sortKey="Status">Status</SortableHeader>
              <TableHead className="px-4 py-2 text-center text-xs font-bold text-primary uppercase tracking-wider">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const { icon: Icon, color, label } = getStatusStyles(task.Status);
              return (
                <TableRow key={task.id} className="hover:bg-muted/50 transition-colors">
                  {/* <TableCell className="px-4 py-3 whitespace-nowrap text-sm font-mono text-muted-foreground text-xs">{task.id?.substring(0, 8)}...</TableCell> */}
                  <TableCell className="px-4 py-3 whitespace-nowrap text-sm font-medium text-primary">{task.Projeto}</TableCell>
                  <TableCell className="px-4 py-3 text-sm text-foreground max-w-xs truncate">{task.Tarefa}</TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{task.Responsável}</TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{task.Prazo}</TableCell>
                  <TableCell className="px-4 py-3 whitespace-nowrap">
                    <Badge variant="default" className={cn('gap-1.5', color)}>
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onSelect={() => setTaskToEdit(task)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onSelect={() => setTaskToDelete(task)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!taskToDelete} onOpenChange={(open) => !open && setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A tarefa <strong className="text-foreground">{taskToDelete?.Tarefa}</strong> será excluída permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      {taskToEdit && (
        <EditTaskDialog
          task={taskToEdit}
          onOpenChange={(open) => !open && setTaskToEdit(null)}
          onSave={handleEditConfirm}
        />
      )}
    </>
  );
};

export default TaskList;

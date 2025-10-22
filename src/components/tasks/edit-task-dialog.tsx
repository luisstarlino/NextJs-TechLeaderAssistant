
'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Task } from '@/lib/types';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface EditTaskDialogProps {
  task: Task;
  onSave: (updatedData: Partial<Task>) => void;
  onOpenChange: (open: boolean) => void;
}

const taskSchema = z.object({
  Projeto: z.string().min(1, 'Projeto é obrigatório'),
  Tarefa: z.string().min(1, 'Tarefa é obrigatória'),
  Responsável: z.string().min(1, 'Responsável é obrigatório'),
  Prazo: z.string().min(1, 'Prazo é obrigatório'),
  Status: z.string().min(1, 'Status é obrigatório'),
  Observações: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

const EditTaskDialog: React.FC<EditTaskDialogProps> = ({ task, onSave, onOpenChange }) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      Projeto: task.Projeto || '',
      Tarefa: task.Tarefa || '',
      Responsável: task.Responsável || '',
      Prazo: task.Prazo || '',
      Status: task.Status || '',
      Observações: task.Observações || '',
    },
  });

  useEffect(() => {
    reset({
      Projeto: task.Projeto || '',
      Tarefa: task.Tarefa || '',
      Responsável: task.Responsável || '',
      Prazo: task.Prazo || '',
      Status: task.Status || '',
      Observações: task.Observações || '',
    });
  }, [task, reset]);

  const onSubmit = (data: TaskFormData) => {
    onSave(data);
  };

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Editar Tarefa</DialogTitle>
            <DialogDescription>
              Faça alterações na tarefa aqui. Clique em salvar quando terminar.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="Tarefa">Tarefa</Label>
              <Input id="Tarefa" {...register('Tarefa')} />
              {errors.Tarefa && <p className="text-xs text-destructive">{errors.Tarefa.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="Projeto">Projeto</Label>
              <Input id="Projeto" {...register('Projeto')} />
              {errors.Projeto && <p className="text-xs text-destructive">{errors.Projeto.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="Responsável">Responsável</Label>
              <Input id="Responsável" {...register('Responsável')} />
              {errors.Responsável && <p className="text-xs text-destructive">{errors.Responsável.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="Prazo">Prazo</Label>
              <Input id="Prazo" {...register('Prazo')} />
              {errors.Prazo && <p className="text-xs text-destructive">{errors.Prazo.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="Status">Status</Label>
               <Controller
                name="Status"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="✅ concluído">✅ Concluído</SelectItem>
                      <SelectItem value="⚙️ em andamento">⚙️ Em Andamento</SelectItem>
                      <SelectItem value="⏳ pendente">⏳ Pendente</SelectItem>
                       <SelectItem value="⚠️ atrasado">⚠️ Atrasado</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.Status && <p className="text-xs text-destructive">{errors.Status.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="Observações">Observações</Label>
              <Textarea id="Observações" {...register('Observações')} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;

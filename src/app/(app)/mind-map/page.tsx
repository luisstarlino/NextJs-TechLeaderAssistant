
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

export default function MindMapPage() {
  return (
    <Card className="shadow-lg h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <BrainCircuit className="w-6 h-6" />
          Mind Map de Tarefas
        </CardTitle>
        <CardDescription>Visualize suas tarefas e projetos de forma interligada.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground italic border-2 border-dashed rounded-lg">
            <p>Funcionalidade de Mind Map em construção.</p>
            <p className="text-sm mt-2">Em breve, você poderá visualizar suas tarefas aqui!</p>
        </div>
      </CardContent>
    </Card>
  );
}


import { Task } from '@/lib/types';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend the jsPDF type to include the autoTable method.
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

const getFormattedDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

export const downloadCSV = (tasks: Task[]) => {
    if (tasks.length === 0) {
        alert('Nenhuma tarefa para exportar.');
        return;
    }
    const headers = ['ID', 'Projeto', 'Tarefa', 'Responsável', 'Status', 'Prazo', 'Última Atualização', 'Observações'];
    const data = tasks.map(task => ({
        ID: task.id || '',
        Projeto: task.Projeto,
        Tarefa: task.Tarefa,
        Responsável: task.Responsável,
        Status: task.Status,
        Prazo: task.Prazo,
        'Última Atualização': task['Última Atualização'],
        Observações: task.Observações || '',
    }));

    const csv = Papa.unparse({
        fields: headers,
        data: data.map(row => Object.values(row))
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `tasks-export-${getFormattedDate()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const downloadPDF = (tasks: Task[]) => {
    if (tasks.length === 0) {
        alert('Nenhuma tarefa para exportar.');
        return;
    }
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    const head = [['ID', 'Projeto', 'Tarefa', 'Responsável', 'Status', 'Prazo']];
    const body = tasks.map(task => [
        task.id || 'N/A',
        task.Projeto,
        task.Tarefa,
        task.Responsável,
        task.Status,
        task.Prazo,
    ]);

    doc.autoTable({
        head: head,
        body: body,
        startY: 20,
        didDrawPage: (data) => {
            // Header
            doc.setFontSize(20);
            doc.setTextColor(40);
            doc.text('Relatório de Tarefas', data.settings.margin.left, 15);
        },
    });

    doc.save(`tasks-report-${getFormattedDate()}.pdf`);
};

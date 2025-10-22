
import { Zap, MessageSquare, AlertTriangle } from 'lucide-react';
import { CardContent } from '@/components/ui/card';
import MarkdownRenderer from './markdown-renderer';

interface ChatAreaProps {
  assistantOutput: string | null;
  error: string | null;
}

const ChatArea: React.FC<ChatAreaProps> = ({ assistantOutput, error }) => {
  const hasContent = assistantOutput || error;

  return (
    <CardContent className="flex-1 overflow-y-auto p-4 h-96">
      {!hasContent ? (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground italic">
          <MessageSquare className="w-6 h-6 mb-2" />
          <p>Aguardando seu primeiro comando...</p>
          <p className="text-xs mt-2">Ex: "Nova tarefa: Criar login"</p>
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg font-medium text-sm flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold">Erro</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {assistantOutput && (
            <div className="prose prose-sm max-w-none text-foreground">
              <div className="text-sm text-muted-foreground mb-2 flex items-center font-semibold">
                <Zap className="w-4 h-4 mr-1.5 text-primary" />
                Assistente de Liderança
              </div>
              <MarkdownRenderer content={assistantOutput} />
            </div>
          )}
        </div>
      )}
    </CardContent>
  );
};

export default ChatArea;

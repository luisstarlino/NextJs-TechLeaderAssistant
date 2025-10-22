
import React, { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface ChatInputFormProps {
  isLoading: boolean;
  isAuthReady: boolean;
  onSubmit: (prompt: string) => void;
}

const ChatInputForm: React.FC<ChatInputFormProps> = ({ isLoading, isAuthReady, onSubmit }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading || !isAuthReady) return;
    onSubmit(prompt);
    setPrompt('');
  };

  return (
    <CardFooter className="bg-background/80 border-t p-4">
      <form onSubmit={handleSubmit} className="w-full space-y-2">
        <Textarea
          rows={2}
          className="w-full p-2 border-input rounded-lg focus:ring-ring focus:border-ring transition resize-none text-sm"
          placeholder='Ex: "Nova tarefa: Publicação..." ou "Mapa mental"'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading || !isAuthReady}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !prompt.trim() || !isAuthReady}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processando...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Enviar Comando
            </>
          )}
        </Button>
        {!isAuthReady && <p className="text-center text-xs text-destructive mt-2">Aguardando conexão...</p>}
      </form>
    </CardFooter>
  );
};

export default ChatInputForm;

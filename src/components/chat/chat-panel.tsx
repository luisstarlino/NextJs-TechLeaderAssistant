
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import ChatArea from './chat-area';
import ChatInputForm from './chat-input-form';

interface ChatPanelProps {
  assistantOutput: string | null;
  error: string | null;
  isLoading: boolean;
  isAuthReady: boolean;
  onSubmit: (prompt: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = (props) => {
  return (
    <Card className="flex flex-col shadow-lg h-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">
          Assistente Gemini
        </CardTitle>
      </CardHeader>
      <ChatArea assistantOutput={props.assistantOutput} error={props.error} />
      <ChatInputForm
        isLoading={props.isLoading}
        isAuthReady={props.isAuthReady}
        onSubmit={props.onSubmit}
      />
    </Card>
  );
};

export default ChatPanel;

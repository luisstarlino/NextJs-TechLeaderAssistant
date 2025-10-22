
import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const renderMarkdown = (text: string | null) => {
    if (!text) return null;

    // Replace **text** with <strong>text</strong>
    const boldedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    const lines = boldedText.split('\n');

    return lines.map((line, index) => {
      if (line.startsWith('###')) {
        return <h3 key={index} className="font-headline text-lg font-bold text-primary/90 mt-3 mb-1" dangerouslySetInnerHTML={{ __html: line.substring(3).trim() }} />;
      }
      if (line.startsWith('##')) {
        return <h2 key={index} className="font-headline text-xl font-bold text-foreground mt-4 mb-2" dangerouslySetInnerHTML={{ __html: line.substring(2).trim() }} />;
      }
      if (line.startsWith('#')) {
        return <h1 key={index} className="font-headline text-2xl font-bold text-foreground mt-5 mb-3" dangerouslySetInnerHTML={{ __html: line.substring(1).trim() }} />;
      }
      if (line.trim().startsWith('- ')) {
        return <li key={index} className="list-disc ml-5 text-muted-foreground my-1" dangerouslySetInnerHTML={{ __html: line.substring(1).trim() }} />;
      }
      if (line.trim() === '') {
          return <br key={index} />;
      }
      return <p key={index} className="text-foreground/90 my-1" dangerouslySetInnerHTML={{ __html: line }} />;
    });
  };

  return <div className="space-y-1">{renderMarkdown(content)}</div>;
};

export default MarkdownRenderer;

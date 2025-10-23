
'use client';

import React, { useEffect, useState, useId } from 'react';
import mermaid from 'mermaid';

interface MarkdownRendererProps {
  content: string;
}

const MermaidRenderer: React.FC<{ id: string; content: string }> = ({ id, content }) => {
    // This effect will run only on the client, after the component mounts.
    useEffect(() => {
        mermaid.initialize({ 
            startOnLoad: false, 
            theme: 'base',
            themeVariables: {
                background: 'var(--mermaid-background)',
                primaryColor: 'var(--mermaid-background)',
                primaryTextColor: 'var(--mermaid-foreground)',
                lineColor: 'var(--mermaid-border)',
                secondaryColor: 'var(--mermaid-primary)',
                tertiaryColor: 'var(--mermaid-primary)',
                primaryBorderColor: 'var(--mermaid-border)',
                nodeBorder: 'var(--mermaid-border)',
                mainBkg: 'var(--mermaid-primary)',
                textColor: 'var(--mermaid-foreground)',
            }
        });
        // We call `run` manually after ensuring the element is in the DOM.
        mermaid.run({
            nodes: [document.getElementById(id)!],
        });
    }, [id, content]); // Re-run if the content or ID changes.

    // We render the container with the content inside, ready for Mermaid to process.
    return (
        <div className="mermaid" id={id}>
            {content}
        </div>
    );
};


const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const uniqueId = useId();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const renderMarkdown = (text: string | null) => {
    if (!text) return null;

    // Check for Mermaid block
    const mermaidRegex = /```mermaid\n([\s\S]*?)\n```/;
    const mermaidMatch = text.match(mermaidRegex);

    if (mermaidMatch && mermaidMatch[1]) {
      const mermaidContent = mermaidMatch[1];
      if (isClient) {
        return <MermaidRenderer id={`mermaid-${uniqueId}`} content={mermaidContent} />;
      }
      return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground italic">
            <p>Carregando diagrama...</p>
        </div>
      );
    }


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

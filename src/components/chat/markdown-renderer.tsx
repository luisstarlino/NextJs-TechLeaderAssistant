
'use client';

import React, { useEffect, useState, useId } from 'react';
import mermaid from 'mermaid';

interface MarkdownRendererProps {
  content: string;
}

const MermaidRenderer: React.FC<{ id: string; content: string }> = ({ id, content }) => {
    useEffect(() => {
        const getStyle = (variable: string) => `hsl(${getComputedStyle(document.documentElement).getPropertyValue(variable).trim()})`;

        try {
            mermaid.initialize({ 
                startOnLoad: false, 
                theme: 'base',
                themeVariables: {
                    background: getStyle('--background'),
                    primaryColor: getStyle('--background'),
                    primaryTextColor: getStyle('--foreground'),
                    lineColor: getStyle('--border'),
                    secondaryColor: getStyle('--primary'),
                    tertiaryColor: getStyle('--primary'),
                    primaryBorderColor: getStyle('--border'),
                    nodeBorder: getStyle('--border'),
                    mainBkg: getStyle('--primary'),
                    textColor: getStyle('--foreground'),
                }
            });
            
            const renderMermaid = async () => {
              try {
                // Ensure the element exists before trying to render
                const element = document.getElementById(id);
                if (element) {
                   const { svg } = await mermaid.render(id + '-svg', content);
                   element.innerHTML = svg;
                }
              } catch (error) {
                console.error('Mermaid rendering error:', error);
                const element = document.getElementById(id);
                if(element) {
                    element.innerHTML = "Error rendering diagram.";
                }
              }
            };
    
            renderMermaid();

        } catch (e) {
            console.error("Could not initialize mermaid", e);
        }

    }, [id, content]);

    return <div className="mermaid-container flex justify-center" id={id} />;
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

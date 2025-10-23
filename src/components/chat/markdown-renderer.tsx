'use client';

import React, { useEffect, useState, useId } from 'react';
import mermaid from 'mermaid';

interface MarkdownRendererProps {
  content: string;
}

// This component is dedicated to rendering a Mermaid diagram.
const MermaidRenderer: React.FC<{ chart: string }> = ({ chart }) => {
    const id = `mermaid-chart-${useId()}`;
    const [svg, setSvg] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const getStyle = (variable: string) => `hsl(${getComputedStyle(document.documentElement).getPropertyValue(variable).trim()})`;

        mermaid.initialize({ 
            startOnLoad: false, 
            theme: 'base',
            themeVariables: {
                background: getStyle('--background'),
                primaryColor: getStyle('--background'),
                primaryTextColor: getStyle('--foreground'),
                lineColor: getStyle('--primary'), 
                secondaryColor: getStyle('--accent'),
                tertiaryColor: getStyle('--accent'),
                primaryBorderColor: getStyle('--border'),
                nodeBorder: getStyle('--primary'),
                mainBkg: getStyle('--accent'),
                textColor: getStyle('--foreground'),
            }
        });

        // Define an async function to render the diagram
        const renderDiagram = async () => {
            try {
                // mermaid.render() generates a random ID, which can cause issues in React.
                // We pass our own stable ID.
                const renderResult = await mermaid.render(id, chart);
                setSvg(renderResult.svg);
                setError(null);
            } catch (e: any) {
                console.error('Mermaid rendering failed:', e);
                setError('Falha ao renderizar o diagrama. Verifique a sintaxe.');
            }
        };

        renderDiagram();

    }, [chart, id]);

    if (error) {
        return <div className="text-destructive font-semibold">{error}</div>;
    }

    if (svg) {
        // Use dangerouslySetInnerHTML to render the SVG string from Mermaid
        return <div className="mermaid-container flex justify-center" dangerouslySetInnerHTML={{ __html: svg }} />;
    }

    // Show a loading state while rendering
    return (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground italic">
            <p>Carregando diagrama...</p>
        </div>
    );
};


const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
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
      // Only attempt to render on the client-side
      if (isClient) {
        return <MermaidRenderer chart={mermaidContent} />;
      }
      // Show a placeholder while server-side rendering or before client-side hydration
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

'use client';

import { useMemo } from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Basic HTML sanitization - escape potentially dangerous characters
function sanitizeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    // Don't escape apostrophes - they'll be rendered correctly by dangerouslySetInnerHTML
    ;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const parsed = useMemo(() => parseMarkdown(content), [content]);

  return (
    <div className={`markdown-content ${className}`}>
      {parsed.map((element, index) => {
        switch (element.type) {
          case 'h1':
            return <h1 key={index} className="text-2xl font-bold text-calm-900 mb-3 mt-2">{element.content}</h1>;
          case 'h2':
            return <h2 key={index} className="text-xl font-bold text-calm-900 mb-2 mt-4">{element.content}</h2>;
          case 'h3':
            return <h3 key={index} className="text-lg font-semibold text-calm-900 mb-2 mt-3">{element.content}</h3>;
          case 'list':
            return (
              <ul key={index} className="list-disc pl-5 mb-3 space-y-1">
                {element.items?.map((item, i) => (
                  <li key={i} className="text-calm-700">{formatInlineText(item)}</li>
                ))}
              </ul>
            );
          case 'numbered-list':
            return (
              <ol key={index} className="list-decimal pl-5 mb-3 space-y-1">
                {element.items?.map((item, i) => (
                  <li key={i} className="text-calm-700">{formatInlineText(item)}</li>
                ))}
              </ol>
            );
          case 'table':
            return (
              <div key={index} className="overflow-x-auto mb-4">
                <table className="min-w-full border border-calm-200 rounded-lg overflow-hidden">
                  <thead className="bg-calm-50">
                    <tr>
                      {element.headers?.map((header, i) => (
                        <th key={i} className="px-4 py-2 text-left text-sm font-semibold text-calm-700 border-b border-calm-200">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {element.rows?.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-calm-50'}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-2 text-sm text-calm-700 border-b border-calm-200">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'code-block':
            return (
              <pre key={index} className="bg-calm-900 text-calm-100 p-4 rounded-lg overflow-x-auto mb-3 text-sm font-mono">
                <code>{element.content}</code>
              </pre>
            );
          case 'blockquote':
            return (
              <blockquote key={index} className="border-l-4 border-primary-300 pl-4 py-2 my-3 bg-primary-50 rounded-r">
                <p className="text-calm-700 italic">{element.content}</p>
              </blockquote>
            );
          case 'paragraph':
            return (
              <p
                key={index}
                className="text-calm-700 leading-relaxed mb-3"
                dangerouslySetInnerHTML={{ __html: formatInlineText(element.content || '') }}
              />
            );
          case 'line-break':
            return <br key={index} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

interface ParsedElement {
  type: string;
  content?: string;
  url?: string;
  items?: string[];
  headers?: string[];
  rows?: string[][];
}

function parseMarkdown(text: string): ParsedElement[] {
  const elements: ParsedElement[] = [];
  let i = 0;

  // If no newlines, treat as single paragraph
  if (!text.includes('\n')) {
    return [{ type: 'paragraph', content: formatInlineText(text) }];
  }

  const lines = text.split('\n');

  while (i < lines.length) {
    let line = lines[i].trim();

    // Skip empty lines - paragraphs will be rendered separately
    if (!line) {
      i++;
      continue;
    }

    // Headers
    if (line.startsWith('# ')) {
      elements.push({ type: 'h1', content: line.slice(2) });
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push({ type: 'h2', content: line.slice(3) });
      i++;
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push({ type: 'h3', content: line.slice(4) });
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('>')) {
      elements.push({ type: 'blockquote', content: line.slice(1).trim() });
      i++;
      continue;
    }

    // Code block
    if (line.startsWith('```')) {
      const codeLines: string[] = i + 1 < lines.length ? [lines[i + 1]] : [];
      i += 2;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push({ type: 'code-block', content: codeLines.join('\n') });
      i++;
      continue;
    }

    // Unordered list
    if (line.match(/^[-*]\s/) || line.match(/^[-*]\d/)) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].trim().match(/^[-*]\s/) || lines[i].trim().match(/^[-*]\d/))) {
        let item = lines[i].trim().slice(2);
        if (line.match(/^[-*]\d/)) {
          item = lines[i].trim().slice(1);
        }
        items.push(item);
        i++;
      }
      elements.push({ type: 'list', items });
      continue;
    }

    // Numbered list
    if (line.match(/^\d+\.\s/) && !line.includes('**')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      elements.push({ type: 'numbered-list', items });
      continue;
    }

    // Table
    if (line.includes('|') && !line.startsWith('|') && lines[i + 1]?.includes('---')) {
      const headers = line.split('|').filter(h => h.trim()).map(h => h.trim());
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes('|')) {
        const row = lines[i].split('|').filter(c => c).map(c => c.trim());
        if (row.length > 0) rows.push(row);
        i++;
      }
      elements.push({ type: 'table', headers, rows });
      continue;
    }

    // Regular paragraph
    elements.push({ type: 'paragraph', content: formatInlineText(line) });
    i++;
  }

  return elements;
}

function formatInlineText(text: string): string {
  // First sanitize any raw HTML to prevent XSS
  let result = sanitizeHtml(text);

  // Handle code blocks (multiline ```code```)
  result = result.replace(/```([\s\S]*?)```/g, (_, code) => {
    return `<pre class="bg-calm-900 text-calm-100 p-3 rounded-lg overflow-x-auto mb-3 text-sm font-mono"><code>${code}</code></pre>`;
  });

  // Handle inline code `code`
  result = result.replace(/`([^`]+)`/g, (_, code) => {
    return `<code class="bg-calm-100 text-calm-800 px-1.5 py-0.5 rounded text-sm font-mono">${code}</code>`;
  });

  // Handle bold **text**
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Handle italic *text* - more careful regex to avoid matching lists
  // Only match single asterisks that are surrounded by non-asterisk characters
  result = result.replace(/(?<!\*)\*([^*][^*]*?)\*(?!\*)/g, '<em>$1</em>');

  // Handle links [text](url) with security attributes
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
    // Validate URL to prevent javascript: injection
    const safeUrl = url.startsWith('http://') || url.startsWith('https://') ? url : '#';
    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 underline">${text}</a>`;
  });

  return result;
}

export default MarkdownRenderer;

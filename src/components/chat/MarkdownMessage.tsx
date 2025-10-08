import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownMessageProps {
  content: string
}

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <div className="prose prose-sm max-w-none text-gray-800 text-left">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings - Estilo ChatGPT
          h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 pb-3 text-gray-900 border-b border-gray-200">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold mb-4 pb-3 text-gray-900 border-b border-gray-200">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-semibold mb-3 text-gray-900">{children}</h3>,
          
          // Paragraphs - Con separador
          p: ({ children }) => <p className="mb-4 pb-4 leading-relaxed text-gray-800 border-b border-gray-100 last:border-0">{children}</p>,
          
          // Lists - Estilo limpio
          ul: ({ children }) => <ul className="list-disc list-outside ml-5 mb-4 space-y-1.5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-outside ml-5 mb-4 space-y-1.5">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed text-gray-800">{children}</li>,
          
          // Code - JetBrains Mono style
          code: ({ children, ...props }) => {
            const isInline = !String(children).includes('\n')
            return isInline ? (
              <code className="bg-pink-50 text-pink-700 border border-pink-200 px-1.5 py-0.5 rounded text-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }} {...props}>
                {children}
              </code>
            ) : (
              <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg my-3 overflow-x-auto text-sm leading-relaxed shadow-sm" style={{ fontFamily: "'JetBrains Mono', monospace" }} {...props}>
                {children}
              </code>
            )
          },
          
          // Pre (code blocks)
          pre: ({ children }) => <pre className="my-3">{children}</pre>,
          
          // Strong (bold) - Notion style
          strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
          
          // Em (italic)
          em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
          
          // Links - Blue underline style
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline decoration-blue-300 hover:decoration-blue-500 transition-colors">
              {children}
            </a>
          ),
          
          // Blockquote - Notion style
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-400 bg-blue-50 pl-4 py-2 my-3 italic text-gray-700">
              {children}
            </blockquote>
          ),
          
          // Horizontal rule
          hr: () => <hr className="my-6 border-gray-200" />,
          
          // Tables - Clean style
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border border-gray-200 rounded-lg">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => (
            <th className="bg-gray-100 border border-gray-200 px-4 py-2 text-left font-semibold text-gray-900">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-200 px-4 py-2 text-gray-800">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}


import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownMessageProps {
  content: string
}

export function MarkdownMessage({ content }: MarkdownMessageProps) {
  return (
    <div className="prose prose-sm max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold mb-1">{children}</h3>,
          
          // Paragraphs
          p: ({ children }) => <p className="mb-3 leading-relaxed">{children}</p>,
          
          // Lists
          ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          
          // Code
          code: ({ children, ...props }) => {
            const isInline = !String(children).includes('\n')
            return isInline ? (
              <code className="bg-gray-800 text-pink-400 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                {children}
              </code>
            ) : (
              <code className="block bg-gray-900 text-gray-100 p-3 rounded-lg my-2 overflow-x-auto font-mono text-sm" {...props}>
                {children}
              </code>
            )
          },
          
          // Pre (code blocks)
          pre: ({ children }) => <pre className="my-2">{children}</pre>,
          
          // Strong (bold)
          strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
          
          // Em (italic)
          em: ({ children }) => <em className="italic">{children}</em>,
          
          // Links
          a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {children}
            </a>
          ),
          
          // Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2">
              {children}
            </blockquote>
          ),
          
          // Horizontal rule
          hr: () => <hr className="my-4 border-gray-300" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}


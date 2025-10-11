import { useEffect, useRef } from 'react';
import { type Message } from '../../store/chatStore';
import { MarkdownMessage } from './MarkdownMessage';
import { WelcomeScreen } from './WelcomeScreen';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onExampleClick?: (prompt: string) => void;
}

export function MessageList({ messages, isLoading, onExampleClick }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Helper para remover bloques de código Mermaid
  const removeCodeBlocks = (content: string): string => {
    // Remover bloques de código con ```mermaid
    return content.replace(/```mermaid[\s\S]*?```/g, '').trim();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 w-full">
      {messages.length === 0 && onExampleClick ? (
        // WelcomeScreen - Usar toda la altura para centrar
        <div className="h-full min-h-full flex items-center justify-center">
          <WelcomeScreen onExampleClick={onExampleClick} />
        </div>
      ) : (
        // Messages - Layout normal con márgenes laterales
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="space-y-8">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${message.role === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                  {message.role === 'assistant' ? (
                    // AI Message - Con márgenes laterales estilo ChatGPT
                    <div className="bg-transparent px-6 py-3">
                      <div className="prose prose-sm max-w-none">
                        <MarkdownMessage content={removeCodeBlocks(message.content)} />
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(message.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  ) : (
                    // User Message - Azul suave con brillo
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl px-6 py-3 shadow-sm hover:shadow-[0_0_12px_rgba(59,130,246,0.25)] transition-shadow duration-200">
                      <p className="text-gray-800 whitespace-pre-wrap break-words leading-relaxed font-normal">
                        {message.content}
                      </p>
                      <p className="text-xs text-blue-400 mt-2">
                        {new Date(message.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[85%]">
                  <div className="bg-transparent px-6 py-3">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}


import { useEffect, useRef } from 'react';
import { Message } from '../../store/chatStore';
import { User, Bot } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-gray-600 text-center px-4">
          <Bot size={56} className="mb-4 text-gray-400" />
          <p className="text-xl font-semibold mb-2 text-gray-900">¡Bienvenido a Zipna!</p>
          <p className="text-base max-w-md text-gray-600">
            Describe cualquier proceso, flujo o concepto y te generaré un diagrama Mermaid visual.
          </p>
          <div className="mt-8 text-left bg-white rounded-xl p-5 max-w-md shadow-sm border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">💡 Ejemplos para probar:</p>
            <ul className="text-sm space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>"Proceso para hacer una pizza"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>"Flujo de autenticación de usuarios"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>"Ciclo de vida de un pedido online"</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`flex gap-3 max-w-[85%] ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {message.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex gap-3 max-w-[85%]">
              <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-gray-200 text-gray-700">
                <Bot size={20} />
              </div>
              <div className="bg-white text-gray-900 rounded-2xl px-4 py-3 border border-gray-200">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div ref={messagesEndRef} />
    </div>
  );
}


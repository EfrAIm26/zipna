import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (trimmed && !isLoading) {
      onSendMessage(trimmed);
      setValue('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 5 * 24; // 5 lines * approximate line height
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [value]);

  return (
    <div className="border-t border-gray-200 bg-white shadow-lg">
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex gap-3 items-end">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe el diagrama que quieres crear... (Ej: 'Proceso para hacer una pizza')"
            disabled={isLoading}
            className="flex-1 bg-white text-gray-900 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px] max-h-[120px] border border-gray-300"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !value.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl p-3 transition-colors flex items-center justify-center min-w-[52px] h-[52px] shadow-sm"
          >
            <SendHorizontal size={22} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Presiona <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Enter</kbd> para enviar · <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Shift+Enter</kbd> para nueva línea
        </p>
      </div>
    </div>
  );
}


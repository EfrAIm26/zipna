import { useState, type KeyboardEvent, useRef, useEffect } from 'react';
import { SendHorizontal } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function ChatInput({ onSendMessage, isLoading, value: externalValue, onValueChange }: ChatInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const value = externalValue !== undefined ? externalValue : internalValue;
  const setValue = onValueChange || setInternalValue;
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
            placeholder="Describe the diagram or graph you want to create... (e.g., 'A Harry Potter mind map')"
            disabled={isLoading}
            className="flex-1 bg-white text-gray-900 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px] max-h-[120px] border border-gray-300 shadow-sm transition-shadow duration-200"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !value.trim()}
            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl p-3 transition-all duration-200 flex items-center justify-center min-w-[52px] h-[52px] shadow-md hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]"
          >
            <SendHorizontal size={22} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-xs">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}


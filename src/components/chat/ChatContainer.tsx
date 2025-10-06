import { useChatStore } from '../../store/chatStore';
import { sendMessage } from '../../lib/openrouter';
import { extractMermaidCode } from '../../lib/utils';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { AlertCircle } from 'lucide-react';

export function ChatContainer() {
  const { messages, isLoading, error, addMessage, setLoading, setError, setCurrentDiagram } = useChatStore();

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    try {
      // Limpiar error previo
      setError(null);

      // Agregar mensaje del usuario
      addMessage({
        role: 'user',
        content
      });

      // Iniciar loading
      setLoading(true);

      // Llamar a OpenRouter
      const response = await sendMessage(content);

      // Agregar respuesta de la IA
      addMessage({
        role: 'assistant',
        content: response
      });

      // Extraer y actualizar diagrama Mermaid
      console.log('🔄 [ChatContainer] Response received:', response.substring(0, 200));
      const mermaidCode = extractMermaidCode(response);
      console.log('📊 [ChatContainer] Extracted code:', mermaidCode ? mermaidCode.substring(0, 100) : 'null');
      if (mermaidCode) {
        setCurrentDiagram(mermaidCode);
        console.log('✅ [ChatContainer] Diagram updated in store');
      } else {
        console.log('⚠️ [ChatContainer] No Mermaid code extracted');
      }

    } catch (error) {
      console.error('Error en handleSendMessage:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      
      // Agregar mensaje de error visible para el usuario
      addMessage({
        role: 'assistant',
        content: `❌ Error: ${errorMessage}\n\nPor favor, verifica tu API key de OpenRouter en el archivo .env`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center gap-2 text-sm text-red-700">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} />

      {/* Input */}
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}


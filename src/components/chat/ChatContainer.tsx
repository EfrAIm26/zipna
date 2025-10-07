import { useChatStore } from '../../store/chatStore';
import { sendMessage } from '../../lib/openrouter';
import { extractMermaidCode } from '../../lib/utils';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { AlertCircle, MessageCircle } from 'lucide-react';

export function ChatContainer() {
  const { 
    messages, 
    currentChatId, 
    isLoading, 
    error, 
    saveMessage, 
    saveDiagram, 
    setLoading, 
    setError, 
    setCurrentDiagram 
  } = useChatStore();

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading || !currentChatId) return;

    try {
      // Limpiar error previo
      setError(null);
      setLoading(true);

      // Guardar mensaje del usuario en Supabase
      const userMessageId = await saveMessage(currentChatId, 'user', content);
      console.log('✅ User message saved:', userMessageId);

      // Llamar a OpenRouter
      const response = await sendMessage(content);
      console.log('🔄 [ChatContainer] Response received:', response.substring(0, 200));

      // Extraer código Mermaid
      const mermaidCode = extractMermaidCode(response);
      console.log('📊 [ChatContainer] Extracted code:', mermaidCode ? mermaidCode.substring(0, 100) : 'null');

      // Guardar respuesta de la IA en Supabase
      const assistantMessageId = await saveMessage(currentChatId, 'assistant', response, mermaidCode || undefined);
      console.log('✅ Assistant message saved:', assistantMessageId);

      // Si hay diagrama, guardarlo y actualizarlo
      if (mermaidCode) {
        setCurrentDiagram(mermaidCode);
        
        // Generar título del diagrama basado en el contenido del usuario
        const diagramTitle = content.length > 50 ? content.substring(0, 50) + '...' : content;
        
        await saveDiagram(currentChatId, assistantMessageId, mermaidCode, diagramTitle);
        console.log('✅ [ChatContainer] Diagram saved');
      }

    } catch (error) {
      console.error('Error en handleSendMessage:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Si no hay chat seleccionado, mostrar placeholder
  if (!currentChatId) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center p-8">
        <MessageCircle size={64} className="text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Selecciona o crea un chat
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          Elige un chat existente de la barra lateral o crea uno nuevo para comenzar a generar diagramas con IA
        </p>
      </div>
    );
  }

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


import { useState } from 'react'
import { useChatStore } from '../../store/chatStore'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { sendMessage } from '../../lib/openrouter'
import { extractContent } from '../../lib/utils'
import { generateChatTitle, shouldUpdateChatTitle } from '../../lib/chatHelpers'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { CompactModelSelector } from './CompactModelSelector'
import { FileUpload } from './FileUpload'
import { AlertCircle, MessageCircle, FileIcon, X, Paperclip } from 'lucide-react'
import { DEFAULT_MODEL } from '../../lib/aiModels'

export function ChatContainerV2() {
  const { user } = useAuth()
  const { 
    messages, 
    currentChatId,
    chats,
    isLoading, 
    error, 
    saveMessage, 
    saveDiagram, 
    loadChats,
    setLoading, 
    setError, 
    setCurrentDiagram 
  } = useChatStore()

  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL)
  const [attachedFiles, setAttachedFiles] = useState<Array<{ name: string; content: string }>>([])
  const [showFileUpload, setShowFileUpload] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleFilesProcessed = (files: Array<{ name: string; type: string; content: string }>) => {
    setAttachedFiles(files.map(f => ({ name: f.name, content: f.content })))
  }

  const handleExampleClick = (prompt: string) => {
    setInputValue(prompt)
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading || !currentChatId || !user) return

    try {
      setError(null)
      setLoading(true)
      setInputValue('') // Limpiar input inmediatamente

      // Si es el primer mensaje, actualizar el título del chat
      const currentChat = chats.find(c => c.id === currentChatId)
      if (currentChat && messages.length === 0 && shouldUpdateChatTitle(currentChat.title, content)) {
        const newTitle = generateChatTitle(content)
        await supabase
          .from('chats')
          .update({ title: newTitle })
          .eq('id', currentChatId)
        
        // Recargar chats para actualizar el título en el sidebar
        const projectId = currentChat.project_id
        if (projectId) {
          await loadChats(user.id, projectId)
        }
      }

      // Guardar mensaje del usuario
      await saveMessage(currentChatId, 'user', content)

      // Llamar a OpenRouter con el modelo seleccionado
      const { content: response, isDiagram } = await sendMessage(content, {
        model: selectedModel,
        attachedFiles,
      })

      console.log('📦 [ChatContainer] Response:', { isDiagram, length: response.length })

      // Extraer código Mermaid y explicación
      const { mermaidCode } = extractContent(response)

      // Guardar respuesta de la IA
      const assistantMessageId = await saveMessage(
        currentChatId,
        'assistant',
        response,
        mermaidCode || undefined
      )

      // Si hay diagrama, guardarlo y mostrarlo
      if (mermaidCode && isDiagram) {
        setCurrentDiagram(mermaidCode)
        
        const diagramTitle = content.length > 50 ? content.substring(0, 50) + '...' : content
        await saveDiagram(currentChatId, assistantMessageId, mermaidCode, diagramTitle)
      } else {
        // No hay diagrama, limpiar
        setCurrentDiagram(null)
      }

      // Limpiar archivos adjuntos después de enviar
      setAttachedFiles([])
      setShowFileUpload(false)

    } catch (error) {
      console.error('Error en handleSendMessage:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Si no hay chat seleccionado
  if (!currentChatId) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center p-8">
        <MessageCircle size={64} className="text-gray-300 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Select or create a chat
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          Choose an existing chat or create a new one to get started
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-2 flex items-center gap-2 text-sm text-red-700">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* File Upload expandible */}
      {showFileUpload && (
        <div className="border-b border-gray-200 px-6 py-3 bg-gray-50">
          <FileUpload onFilesProcessed={handleFilesProcessed} />
        </div>
      )}

      {/* Archivos adjuntos */}
      {attachedFiles.length > 0 && (
        <div className="border-b border-gray-200 px-6 py-2 bg-blue-50 flex flex-wrap gap-2">
          {attachedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-2 py-1 bg-white border border-blue-200 rounded text-xs"
            >
              <FileIcon size={12} className="text-blue-600" />
              <span className="text-gray-700 font-medium">{file.name}</span>
              <button
                onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== index))}
                className="hover:bg-gray-100 rounded p-0.5"
              >
                <X size={12} className="text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Messages */}
      <MessageList messages={messages} isLoading={isLoading} onExampleClick={handleExampleClick} />

      {/* Input Footer - estilo Cursor */}
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-2">
          {/* Botón de adjuntar */}
          <button
            onClick={() => setShowFileUpload(!showFileUpload)}
            className={`p-2.5 rounded-lg transition-colors ${
              showFileUpload || attachedFiles.length > 0
                ? 'bg-blue-100 text-blue-600'
                : 'hover:bg-gray-100 text-gray-500'
            }`}
            title="Attach file"
          >
            <Paperclip size={20} />
          </button>

          {/* Selector de modelo compacto */}
          <CompactModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />

          {/* Input (Chat Input ya tiene el botón de enviar) */}
          <div className="flex-1">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={isLoading}
              value={inputValue}
              onValueChange={setInputValue}
            />
          </div>
        </div>
      </div>
    </div>
  )
}


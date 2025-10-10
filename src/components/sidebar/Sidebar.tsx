import { useEffect, useState } from 'react'
import { useChatStore } from '../../store/chatStore'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Plus, MessageSquare, LogOut, User, Loader2 } from 'lucide-react'
import { ChatMenu } from './ChatMenu'

export function Sidebar() {
  const { user, signOut } = useAuth()
  const { chats, currentChatId, loadChats, createChat, deleteChat, loadMessages, setCurrentChat } = useChatStore()
  const [isLoadingChats, setIsLoadingChats] = useState(false)
  const [isCreatingChat, setIsCreatingChat] = useState(false)
  const [projectId, setProjectId] = useState<string | null>(null)
  const [renamingChatId, setRenamingChatId] = useState<string | null>(null)
  const [newChatTitle, setNewChatTitle] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)

  // Obtener o crear project_id al montar - SOLO UNA VEZ
  useEffect(() => {
    const initProject = async () => {
      if (!user || isInitialized) return

      try {
        setIsLoadingChats(true)

        // Obtener proyecto del usuario (o crear uno por defecto)
        const { data: existingProjects, error: fetchError } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .limit(1)

        if (fetchError) throw fetchError

        let currentProjectId: string

        if (existingProjects && existingProjects.length > 0) {
          currentProjectId = existingProjects[0].id
        } else {
          // Crear proyecto por defecto
          const { data: newProject, error: createError } = await supabase
            .from('projects')
            .insert({
              user_id: user.id,
              title: 'Mi Proyecto',
            })
            .select()
            .single()

          if (createError) throw createError
          currentProjectId = newProject.id
        }

        setProjectId(currentProjectId)

        // Cargar chats
        await loadChats(user.id, currentProjectId)

        // Verificar si hay chats
        const { data: existingChats } = await supabase
          .from('chats')
          .select('id, updated_at')
          .eq('project_id', currentProjectId)
          .order('updated_at', { ascending: false })
          .limit(1)

        if (!existingChats || existingChats.length === 0) {
          // No hay chats, crear uno automáticamente
          console.log('🆕 Auto-creating first chat')
          const chatId = await createChat('New Chat', user.id, currentProjectId)
          setCurrentChat(chatId)
        } else {
          // Hay chats, seleccionar el más reciente automáticamente SOLO si no hay chat seleccionado
          if (!currentChatId) {
            console.log('📂 Auto-selecting most recent chat')
            const mostRecentChatId = existingChats[0].id
            setCurrentChat(mostRecentChatId)
            await loadMessages(mostRecentChatId)
          }
        }

        setIsInitialized(true)
      } catch (error) {
        console.error('Error initializing project:', error)
      } finally {
        setIsLoadingChats(false)
      }
    }

    initProject()
  }, [user])

  const handleNewChat = async () => {
    if (!user || !projectId) return

    try {
      setIsCreatingChat(true)
      const chatId = await createChat('New Chat', user.id, projectId)
      setCurrentChat(chatId)
    } catch (error) {
      console.error('Error creating chat:', error)
    } finally {
      setIsCreatingChat(false)
    }
  }

  const handleSelectChat = async (chatId: string) => {
    try {
      await loadMessages(chatId)
    } catch (error) {
      console.error('Error loading chat:', error)
    }
  }

  const handleRenameChat = async (chatId: string) => {
    const chat = chats.find(c => c.id === chatId)
    if (!chat) return
    
    setRenamingChatId(chatId)
    setNewChatTitle(chat.title)
  }

  const saveRename = async (chatId: string) => {
    if (!newChatTitle.trim()) return

    try {
      const { error } = await supabase
        .from('chats')
        .update({ title: newChatTitle.trim() })
        .eq('id', chatId)

      if (error) throw error

      // Recargar chats
      if (user && projectId) {
        await loadChats(user.id, projectId)
      }

      setRenamingChatId(null)
      setNewChatTitle('')
    } catch (error) {
      console.error('Error renaming chat:', error)
    }
  }

  const handleDeleteChat = async (chatId: string) => {
    if (!confirm('¿Eliminar este chat?')) return

    try {
      await deleteChat(chatId)
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-screen flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={handleNewChat}
          disabled={isCreatingChat || !projectId}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreatingChat ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Creating...</span>
            </>
          ) : (
            <>
              <Plus size={18} />
              <span>New Chat</span>
            </>
          )}
        </button>
      </div>

      {/* Lista de chats */}
      <div className="flex-1 overflow-y-auto p-2">
        {isLoadingChats ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-gray-400" size={24} />
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-8 px-4">
            <MessageSquare className="mx-auto mb-2 text-gray-600" size={32} />
            <p className="text-sm text-gray-500">No chats yet</p>
            <p className="text-xs text-gray-600 mt-1">Create a new one to get started</p>
          </div>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`rounded-lg transition-colors group relative ${
                  currentChatId === chat.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200'
                }`}
              >
                {renamingChatId === chat.id ? (
                  <div className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={newChatTitle}
                      onChange={(e) => setNewChatTitle(e.target.value)}
                      onBlur={() => saveRename(chat.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveRename(chat.id)
                        if (e.key === 'Escape') {
                          setRenamingChatId(null)
                          setNewChatTitle('')
                        }
                      }}
                      autoFocus
                      className="w-full bg-gray-700 text-white text-sm px-2 py-1 rounded border border-blue-500 focus:outline-none"
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectChat(chat.id)}
                    className="w-full text-left px-3 py-3"
                  >
                    <div className="flex items-start gap-2">
                      <MessageSquare size={16} className="mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{chat.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {new Date(chat.updated_at).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      </div>
                      <ChatMenu
                        onRename={() => handleRenameChat(chat.id)}
                        onDelete={() => handleDeleteChat(chat.id)}
                      />
                    </div>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer con usuario */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <User size={16} className="text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-200 truncate">
              {user?.user_metadata?.full_name || user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg px-3 py-2 text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>
    </div>
  )
}


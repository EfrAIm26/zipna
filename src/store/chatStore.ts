import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  mermaid_code?: string | null;
}

export interface Chat {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatStore {
  // Estado local
  messages: Message[];
  currentChatId: string | null;
  chats: Chat[];
  isLoading: boolean;
  error: string | null;
  currentDiagram: string | null;
  
  // Acciones locales
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentDiagram: (diagram: string | null) => void;
  setCurrentChat: (chatId: string | null) => void;
  
  // Acciones de Supabase
  createChat: (title: string, userId: string, projectId: string) => Promise<string>;
  loadChats: (userId: string, projectId: string) => Promise<void>;
  loadMessages: (chatId: string) => Promise<void>;
  saveMessage: (chatId: string, role: 'user' | 'assistant', content: string, mermaidCode?: string) => Promise<string>;
  saveDiagram: (chatId: string, messageId: string, code: string, title: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
}

export const useChatStore = create<ChatStore>((set) => ({
  // Estado inicial
  messages: [],
  currentChatId: null,
  chats: [],
  isLoading: false,
  error: null,
  currentDiagram: null,

  // Acciones locales
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  setCurrentDiagram: (diagram) => {
    console.log('📊 [ChatStore] setCurrentDiagram called');
    set({ currentDiagram: diagram });
  },

  setCurrentChat: (chatId) => {
    set({ currentChatId: chatId, messages: [], currentDiagram: null });
  },

  // Crear nuevo chat
  createChat: async (title, userId, projectId) => {
    try {
      console.log('📝 [ChatStore] Creating new chat:', title);
      
      const { data, error } = await supabase
        .from('chats')
        .insert({
          title,
          user_id: userId,
          project_id: projectId,
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ [ChatStore] Chat created:', data.id);
      
      // Agregar a la lista de chats
      set((state) => ({
        chats: [data as Chat, ...state.chats],
        currentChatId: data.id,
      }));

      return data.id;
    } catch (error) {
      console.error('❌ [ChatStore] Error creating chat:', error);
      throw error;
    }
  },

  // Cargar lista de chats
  loadChats: async (userId, projectId) => {
    try {
      console.log('📋 [ChatStore] Loading chats for user:', userId);
      
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .eq('user_id', userId)
        .eq('project_id', projectId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      console.log('✅ [ChatStore] Loaded', data.length, 'chats');
      set({ chats: data as Chat[] });
    } catch (error) {
      console.error('❌ [ChatStore] Error loading chats:', error);
      throw error;
    }
  },

  // Cargar mensajes de un chat
  loadMessages: async (chatId) => {
    try {
      console.log('💬 [ChatStore] Loading messages for chat:', chatId);
      set({ isLoading: true });
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      console.log('✅ [ChatStore] Loaded', data.length, 'messages');
      
      // Convertir a formato local
      const messages: Message[] = data.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.created_at).getTime(),
        mermaid_code: msg.mermaid_code,
      }));

      // Buscar el último diagrama
      const lastDiagram = [...messages]
        .reverse()
        .find((msg) => msg.mermaid_code);

      set({ 
        messages, 
        currentChatId: chatId,
        currentDiagram: lastDiagram?.mermaid_code || null,
        isLoading: false 
      });
    } catch (error) {
      console.error('❌ [ChatStore] Error loading messages:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  // Guardar mensaje
  saveMessage: async (chatId, role, content, mermaidCode) => {
    try {
      console.log('💾 [ChatStore] Saving message:', { chatId, role, contentLength: content.length });
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          role,
          content,
          mermaid_code: mermaidCode || null,
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ [ChatStore] Message saved:', data.id);

      // Actualizar timestamp del chat
      await supabase
        .from('chats')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', chatId);

      // Agregar a mensajes locales
      const newMessage: Message = {
        id: data.id,
        role,
        content,
        timestamp: new Date(data.created_at).getTime(),
        mermaid_code: mermaidCode,
      };

      set((state) => ({
        messages: [...state.messages, newMessage],
      }));

      return data.id;
    } catch (error) {
      console.error('❌ [ChatStore] Error saving message:', error);
      throw error;
    }
  },

  // Guardar diagrama
  saveDiagram: async (chatId, messageId, code, title) => {
    try {
      console.log('🎨 [ChatStore] Saving diagram:', { chatId, messageId, title });
      
      const { error } = await supabase
        .from('diagrams')
        .insert({
          chat_id: chatId,
          message_id: messageId,
          mermaid_code: code,
          title,
        });

      if (error) throw error;

      console.log('✅ [ChatStore] Diagram saved');
    } catch (error) {
      console.error('❌ [ChatStore] Error saving diagram:', error);
      throw error;
    }
  },

  // Eliminar chat
  deleteChat: async (chatId) => {
    try {
      console.log('🗑️ [ChatStore] Deleting chat:', chatId);
      
      const { error } = await supabase
        .from('chats')
        .delete()
        .eq('id', chatId);

      if (error) throw error;

      console.log('✅ [ChatStore] Chat deleted');
      
      // Remover de la lista local
      set((state) => ({
        chats: state.chats.filter((chat) => chat.id !== chatId),
        currentChatId: state.currentChatId === chatId ? null : state.currentChatId,
        messages: state.currentChatId === chatId ? [] : state.messages,
      }));
    } catch (error) {
      console.error('❌ [ChatStore] Error deleting chat:', error);
      throw error;
    }
  },
}));


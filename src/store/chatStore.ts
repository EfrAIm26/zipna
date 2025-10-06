import { create } from 'zustand';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  currentDiagram: string | null;
  
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentDiagram: (diagram: string | null) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isLoading: false,
  error: null,
  currentDiagram: null,

  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    set((state) => ({
      messages: [...state.messages, newMessage]
    }));
  },

  clearMessages: () => {
    set({ messages: [], error: null, currentDiagram: null });
  },

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },

  setCurrentDiagram: (diagram) => {
    console.log('📊 [ChatStore] setCurrentDiagram called with:', diagram ? diagram.substring(0, 100) : 'null');
    set({ currentDiagram: diagram });
    console.log('✅ [ChatStore] currentDiagram updated in store');
  }
}));


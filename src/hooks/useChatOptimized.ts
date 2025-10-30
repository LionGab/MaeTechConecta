import { useReducer, useMemo, useCallback } from 'react';

// Tipos
export type Message = {
  id: string | number;
  content: string;
  role: string;
};

interface ChatState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET' };

const initialState: ChatState = {
  messages: [],
  loading: false,
  error: null,
};

function chatReducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useChatOptimized() {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  const sendMessage = useCallback(async (content: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'ADD_MESSAGE', payload: { id: Date.now(), content, role: 'user' }});
    // TODO: lógica de comunicação com IA...
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  // Memoização do histórico da IA
  const aiHistory = useMemo(() => {
    return state.messages.filter(m => m.role !== 'system');
    // Adapte conforme sua lógica de envio para IA
  }, [state.messages]);

  const resetChat = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return {
    messages: state.messages,
    loading: state.loading,
    error: state.error,
    sendMessage,
    aiHistory,
    resetChat,
  };
}

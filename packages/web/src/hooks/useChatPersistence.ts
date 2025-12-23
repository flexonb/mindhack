import { useState, useEffect, useCallback } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  suggestedResponses?: Array<{ id: string; content: string; category: string }>;
  timestamp?: number;
}

const STORAGE_KEY_PREFIX = 'mindhack_chat_';

export function useChatPersistence(chatId: string, maxMessages: number = 50) {
  const storageKey = `${STORAGE_KEY_PREFIX}${chatId}`;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setMessages(parsed);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoading(false);
    }
  }, [storageKey]);

  // Save to localStorage whenever messages change
  const saveMessages = useCallback((msgs: ChatMessage[]) => {
    try {
      // Keep only the last maxMessages
      const trimmed = msgs.slice(-maxMessages);
      localStorage.setItem(storageKey, JSON.stringify(trimmed));
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  }, [storageKey, maxMessages]);

  const addMessage = useCallback((message: ChatMessage) => {
    const newMessage = {
      ...message,
      timestamp: Date.now(),
    };
    setMessages(prev => {
      const updated = [...prev, newMessage];
      saveMessages(updated);
      return updated;
    });
  }, [saveMessages]);

  const updateLastMessage = useCallback((updates: Partial<ChatMessage>) => {
    setMessages(prev => {
      if (prev.length === 0) return prev;
      const updated = [...prev];
      updated[updated.length - 1] = { ...updated[updated.length - 1], ...updates };
      saveMessages(updated);
      return updated;
    });
  }, [saveMessages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  const exportChat = useCallback((format: 'text' | 'json' = 'text') => {
    if (format === 'json') {
      return JSON.stringify(messages, null, 2);
    }

    let text = 'MindHack Chat Export\n';
    text += '===================\n\n';

    messages.forEach((msg, index) => {
      const time = msg.timestamp
        ? new Date(msg.timestamp).toLocaleString()
        : 'Unknown time';
      const role = msg.role === 'user' ? 'You' : 'AI Companion';
      text += `[${time}] ${role}:\n`;
      text += `${msg.content}\n`;
      text += '---\n\n';
    });

    return text;
  }, [messages]);

  const downloadExport = useCallback((format: 'text' | 'json' = 'text') => {
    const content = exportChat(format);
    const blob = new Blob([content], {
      type: format === 'json' ? 'application/json' : 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mindhack-chat-${chatId}-${Date.now()}.${format === 'json' ? 'json' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [chatId, exportChat]);

  return {
    messages,
    setMessages,
    addMessage,
    updateLastMessage,
    clearMessages,
    exportChat,
    downloadExport,
    isLoading,
  };
}

export function getAllChatIds(): string[] {
  if (typeof window === 'undefined') return [];

  const ids: string[] = [];
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(STORAGE_KEY_PREFIX)) {
      ids.push(key.replace(STORAGE_KEY_PREFIX, ''));
    }
  });
  return ids;
}

export function deleteChat(chatId: string): void {
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${chatId}`);
}

export default useChatPersistence;

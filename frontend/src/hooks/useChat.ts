import { useState, useCallback } from 'react';
import type { ChatMessage, ChatResponse } from '../types/chat';
import { chatService } from '../services/chatService';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: ChatMessage = { role: 'user', content };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        const response: ChatResponse = await chatService.sendMessage({
          message: content,
          history: messages,
          conversation_id: conversationId,
        });

        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.response,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        setConversationId(response.conversation_id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message');
        console.error('Chat error:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, conversationId]
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
};

import { apiFetch } from './api';
import type { ChatRequest, ChatResponse } from '../types/chat';

export const chatService = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    return apiFetch<ChatResponse>('/api/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  },
};

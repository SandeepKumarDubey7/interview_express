/**
 * AI Assistant Service — ChatGPT-like conversation via Flask backend.
 */

import { apiPost } from './baseService';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  reply: string;
  suggestions: string[];
}

/**
 * Send a chat message to the AI assistant.
 *
 * @param message - The user's message
 * @param history - Last N messages for context
 * @param userId - Optional user ID for memory/RAG
 */
export async function chatWithAssistant(
  message: string,
  history: ChatMessage[] = [],
  userId?: string
): Promise<ChatResponse> {
  const result = await apiPost<ChatResponse>('/api/ai/chat', {
    message,
    history: history.slice(-10), // Last 5 exchanges (10 messages)
    userId,
  });

  if (result.error || !result.data) {
    return {
      reply: result.error || 'Failed to get a response. Please try again.',
      suggestions: ['Try rephrasing your question', 'Check if the backend is running'],
    };
  }

  return result.data;
}

/**
 * Upload a file to extract its text (PDF, DOCX, TXT)
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${BACKEND_URL}/api/ai/extract-text`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to extract text from file');
    }
    
    return data.text;
  } catch (error: any) {
    console.error('Error extracting text:', error);
    throw new Error(error.message || 'Error extracting text from file');
  }
}

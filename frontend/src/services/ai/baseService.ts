/**
 * Base AI Service — HTTP client that calls Flask backend API.
 *
 * All AI requests go through the Flask backend (NOT directly to Ollama).
 * Architecture: React → Flask (:5000) → Ollama (:11434)
 */

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
}

/**
 * Make a POST request to the Flask backend AI API.
 */
export async function apiPost<T = unknown>(
  endpoint: string,
  body: Record<string, unknown>
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.error || `API error: ${response.status}`,
      };
    }

    return { data: data as T, error: null };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Unknown error';

    if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
      return {
        data: null,
        error: 'Cannot connect to backend. Make sure the Flask server is running on ' + BACKEND_URL,
      };
    }

    return { data: null, error: message };
  }
}

/**
 * Make a GET request to the Flask backend API.
 */
export async function apiGet<T = unknown>(
  endpoint: string,
  params?: Record<string, string>
): Promise<ApiResponse<T>> {
  try {
    const url = new URL(`${BACKEND_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString());
    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.error || `API error: ${response.status}`,
      };
    }

    return { data: data as T, error: null };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return { data: null, error: message };
  }
}

/**
 * Check backend and Ollama health status.
 */
export async function checkHealth(): Promise<{
  backend: boolean;
  ollama: boolean;
  model: string;
}> {
  try {
    const response = await fetch(`${BACKEND_URL}/health`);
    const data = await response.json();
    return {
      backend: true,
      ollama: data.ollama?.status === 'connected',
      model: data.ollama?.model || 'unknown',
    };
  } catch {
    return { backend: false, ollama: false, model: 'unknown' };
  }
}

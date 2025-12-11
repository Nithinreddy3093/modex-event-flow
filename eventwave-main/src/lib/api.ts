'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

let token: string | null = null;
let onAuthError: (() => void) | null = null;
let onTokenRefresh: ((tokens: { accessToken: string; refreshToken: string }) => void) | null = null;

const api = {
  setToken: (newToken: string | null) => {
    token = newToken;
  },

  init: (
    _onAuthError: () => void,
    _onTokenRefresh: (tokens: { accessToken: string; refreshToken: string }) => void
  ) => {
    onAuthError = _onAuthError;
    onTokenRefresh = _onTokenRefresh;
  },

  async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    data?: any,
    isRetry = false
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      method,
      headers,
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    let response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (response.status === 401 && !isRetry) {
      const refreshToken = localStorage.getItem('gtp_refresh');
      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const { data: newTokens } = await refreshResponse.json();
            if (onTokenRefresh) {
              onTokenRefresh(newTokens);
            }
            return this.request(method, endpoint, data, true);
          }
        } catch (error) {
          // Refresh failed
        }
      }

      if (onAuthError) {
        onAuthError();
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw { status: response.status, ...errorData };
    }

    if (response.status === 204) {
      return {} as T;
    }

    const responseData = await response.json();
    return (responseData.data || responseData) as T;
  },

  get<T>(endpoint: string): Promise<T> {
    return this.request('GET', endpoint);
  },

  post<T>(endpoint: string, data: any): Promise<T> {
    return this.request('POST', endpoint, data);
  },

  put<T>(endpoint: string, data: any): Promise<T> {
    return this.request('PUT', endpoint, data);
  },

  delete<T>(endpoint: string): Promise<T> {
    return this.request('DELETE', endpoint);
  },
};

export { api };

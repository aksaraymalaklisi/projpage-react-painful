/**
 * Centralized API client with error handling, token management, and request interceptors
 */

import { config } from '../config';
import type { ApiError, AuthTokens } from '../types';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Get the current access token from localStorage
   */
  private getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Get the current refresh token from localStorage
   */
  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  /**
   * Store tokens in localStorage
   */
  setTokens(tokens: AuthTokens): void {
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
  }

  /**
   * Clear tokens from localStorage
   */
  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  /**
   * Refresh the access token using the refresh token
   */
  async refreshAccessToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return null;
      }

      const data = await response.json();
      if (data.access) {
        localStorage.setItem('access_token', data.access);
        return data.access;
      }
    } catch (error) {
      console.error('Failed to refresh token:', error);
      this.clearTokens();
    }

    return null;
  }

  /**
   * Build headers for API requests
   */
  private buildHeaders(includeAuth = true, customHeaders: Record<string, string> = {}): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (includeAuth) {
      const token = this.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  /**
   * Handle API errors
   */
  private async handleError(response: Response): Promise<ApiError> {
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText || 'An error occurred' };
    }

    const error: ApiError = {
      message: errorData.detail || errorData.message || 'An error occurred',
      status: response.status,
      detail: errorData.detail,
      errors: errorData.errors,
    };

    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401) {
      const newToken = await this.refreshAccessToken();
      if (newToken) {
        // Retry the original request (caller should handle this)
        throw new Error('TOKEN_REFRESHED');
      }
    }

    return error;
  }

  /**
   * Make a GET request
   */
  async get<T>(endpoint: string, includeAuth = true): Promise<T> {
    const url = `${this.baseUrl}${endpoint.replace(/^\//, '')}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.buildHeaders(includeAuth),
      });

      if (!response.ok) {
        const error = await this.handleError(response);
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.message === 'TOKEN_REFRESHED') {
        // Retry the request with the new token
        const response = await fetch(url, {
          method: 'GET',
          headers: this.buildHeaders(true),
        });

        if (!response.ok) {
          const error = await this.handleError(response);
          throw error;
        }

        return await response.json();
      }
      throw error;
    }
  }

  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data: any, includeAuth = false, isFormData = false): Promise<T> {
    const url = `${this.baseUrl}${endpoint.replace(/^\//, '')}`;
    
    const headers: HeadersInit = isFormData
      ? {}
      : { 'Content-Type': 'application/json' };

    if (includeAuth) {
      const token = this.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const body = isFormData ? data : JSON.stringify(data);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body,
      });

      if (!response.ok) {
        const error = await this.handleError(response);
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.message === 'TOKEN_REFRESHED') {
        // Retry the request with the new token
        const headers: HeadersInit = isFormData
          ? {}
          : { 'Content-Type': 'application/json' };
        
        const token = this.getAccessToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
          method: 'POST',
          headers,
          body,
        });

        if (!response.ok) {
          const error = await this.handleError(response);
          throw error;
        }

        return await response.json();
      }
      throw error;
    }
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(endpoint: string, data: any, isFormData = false): Promise<T> {
    const url = `${this.baseUrl}${endpoint.replace(/^\//, '')}`;
    
    const headers: HeadersInit = isFormData
      ? {}
      : { 'Content-Type': 'application/json' };

    const token = this.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const body = isFormData ? data : JSON.stringify(data);

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers,
        body,
      });

      if (!response.ok) {
        const error = await this.handleError(response);
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.message === 'TOKEN_REFRESHED') {
        // Retry the request with the new token
        const headers: HeadersInit = isFormData
          ? {}
          : { 'Content-Type': 'application/json' };
        
        const token = this.getAccessToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
          method: 'PATCH',
          headers,
          body,
        });

        if (!response.ok) {
          const error = await this.handleError(response);
          throw error;
        }

        return await response.json();
      }
      throw error;
    }
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint.replace(/^\//, '')}`;
    
    const headers: HeadersInit = {};
    const token = this.getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const error = await this.handleError(response);
        throw error;
      }

      // DELETE might return empty response
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.message === 'TOKEN_REFRESHED') {
        // Retry the request with the new token
        const headers: HeadersInit = {};
        const token = this.getAccessToken();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
          method: 'DELETE',
          headers,
        });

        if (!response.ok) {
          const error = await this.handleError(response);
          throw error;
        }

        if (response.status === 204) {
          return {} as T;
        }

        return await response.json();
      }
      throw error;
    }
  }
}

// Export a singleton instance
export const apiClient = new ApiClient(config.api.baseUrl);

// Export convenience functions
export const api = {
  get: <T>(endpoint: string, includeAuth = true) => apiClient.get<T>(endpoint, includeAuth),
  post: <T>(endpoint: string, data: any, includeAuth = false, isFormData = false) =>
    apiClient.post<T>(endpoint, data, includeAuth, isFormData),
  patch: <T>(endpoint: string, data: any, isFormData = false) =>
    apiClient.patch<T>(endpoint, data, isFormData),
  delete: <T>(endpoint: string) => apiClient.delete<T>(endpoint),
  setTokens: (tokens: AuthTokens) => apiClient.setTokens(tokens),
  clearTokens: () => apiClient.clearTokens(),
};


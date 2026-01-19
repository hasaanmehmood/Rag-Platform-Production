import api from './api.service';
import type { AuthResponse, RegisterData, LoginData, User } from '@/types/auth.types';

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/v1/auth/register', data);
    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/v1/auth/login', data);
    this.setTokens(response.data.accessToken, response.data.refreshToken);
    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await api.post('/api/v1/auth/logout');
    } finally {
      this.clearTokens();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ user: User }>('/api/v1/auth/me');
    return response.data.user;
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

export default new AuthService();
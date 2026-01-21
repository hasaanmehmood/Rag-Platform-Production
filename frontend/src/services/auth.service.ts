import api from './api.service';
import type { AuthResponse, RegisterData, LoginData, User } from '@/types/auth.types';

class AuthService {
  async register(data: RegisterData): Promise<AuthResponse> {
    console.log('🔵 Registering user:', data.email);
    const response = await api.post<AuthResponse>('/api/v1/auth/register', data);
    console.log('✅ Full register response:', response);
    console.log('✅ Response data:', response.data);
    
    // Check if tokens are at root level or nested
    const accessToken = response.data.accessToken || (response.data as any).access_token;
    const refreshToken = response.data.refreshToken || (response.data as any).refresh_token;
    
    if (!accessToken) {
      console.error('❌ Response structure:', JSON.stringify(response.data, null, 2));
      throw new Error('No token received from server');
    }
    
    this.setTokens(accessToken, refreshToken);
    return response.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    console.log('🔵 Logging in:', data.email);
    const response = await api.post<AuthResponse>('/api/v1/auth/login', data);
    console.log('✅ Full login response:', response);
    console.log('✅ Response data:', response.data);
    console.log('✅ Response keys:', Object.keys(response.data));
    
    // Check if tokens are at root level or nested
    const accessToken = response.data.accessToken || (response.data as any).access_token;
    const refreshToken = response.data.refreshToken || (response.data as any).refresh_token;
    
    if (!accessToken) {
      console.error('❌ Response structure:', JSON.stringify(response.data, null, 2));
      throw new Error('No token received from server');
    }
    
    console.log('💾 Found tokens - access:', !!accessToken, 'refresh:', !!refreshToken);
    this.setTokens(accessToken, refreshToken);
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
    console.log('💾 Storing tokens in localStorage');
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    console.log('✅ Tokens stored successfully');
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
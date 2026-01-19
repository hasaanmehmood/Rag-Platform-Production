import { defineStore } from 'pinia';
import { ref } from 'vue';
import authService from '@/services/auth.service';
import type { User, RegisterData, LoginData } from '@/types/auth.types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const register = async (data: RegisterData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await authService.register(data);
      user.value = response.user;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Registration failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const login = async (data: LoginData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await authService.login(data);
      user.value = response.user;
    } catch (err: any) {
      error.value = err.response?.data?.error?.message || 'Login failed';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const logout = async () => {
    loading.value = true;
    try {
      await authService.logout();
      user.value = null;
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchCurrentUser = async () => {
    if (!authService.isAuthenticated()) {
      return;
    }

    loading.value = true;
    try {
      user.value = await authService.getCurrentUser();
    } catch (err) {
      console.error('Failed to fetch user:', err);
      user.value = null;
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    fetchCurrentUser,
    isAuthenticated: () => !!user.value,
  };
});
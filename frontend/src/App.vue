<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth.store';
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

onMounted(async () => {
  const token = localStorage.getItem('auth_token');
  
  // Only try to fetch user if token exists and we're not on auth pages
  if (token && route.path !== '/login' && route.path !== '/register') {
    try {
      await authStore.fetchCurrentUser();
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      // Token invalid, clear it and redirect to login
      localStorage.removeItem('auth_token');
      authStore.user = null;
      router.push('/login');
    }
  }
});
</script>
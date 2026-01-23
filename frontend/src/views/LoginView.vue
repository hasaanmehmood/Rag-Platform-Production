<template>
  <div class="min-h-screen flex items-center justify-center mesh-gradient particle-bg px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-10">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-teal rounded-2xl flex items-center justify-center neon-glow">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 class="text-4xl font-black gradient-text text-glow">ContextIQ</h1>
        </div>
        <p class="text-gray-300 text-lg">Sign in to your account</p>
      </div>

      <div class="glass-dark-modern p-8 rounded-3xl neon-border">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full bg-dark-200 border border-white/20 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 placeholder-gray-500 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Password</label>
            <input
              v-model="password"
              type="password"
              required
              class="w-full bg-dark-200 border border-white/20 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 placeholder-gray-500 transition-all"
              placeholder="••••••••"
            />
          </div>

          <div v-if="authStore.error" class="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            {{ authStore.error }}
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full btn-modern text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ authStore.loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-sm text-gray-400">
            Don't have an account?
            <router-link to="/register" class="text-primary-400 hover:text-primary-300 font-semibold ml-1">
              Sign up
            </router-link>
          </p>
        </div>

        <div class="mt-6 text-center">
          <router-link to="/" class="text-sm text-gray-500 hover:text-gray-400 transition-colors">
            ← Back to home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    await authStore.login({ email: email.value, password: password.value });
    console.log('✅ Redirecting to /documents');
    router.push('/documents');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
</script>

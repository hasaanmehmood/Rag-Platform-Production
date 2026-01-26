<template>
  <div class="min-h-screen flex items-center justify-center mesh-gradient particle-bg px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-10">
        <div class="flex items-center justify-center gap-3 mb-4">
          <div class="scale-[0.55] origin-center">
            <LogoLoader />
          </div>
          <h1 class="text-4xl font-black gradient-text-light text-glow">ContextIQ</h1>
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
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              class="w-full bg-dark-200 border border-white/20 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 placeholder-gray-500 transition-all"
              :class="{ 'border-red-500/50': localError }"
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
              :class="{ 'border-red-500/50': localError }"
              placeholder="••••••••"
            />
          </div>

          <div v-if="localError || authStore.error" class="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            {{ localError || authStore.error }}
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
import LogoLoader from '@/components/LogoLoader.vue';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const localError = ref('');

const handleLogin = async () => {
  // Clear all errors
  localError.value = '';

  // Validate email format
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  if (!emailRegex.test(email.value)) {
    localError.value = 'Please enter a valid email address';
    return;
  }

  try {
    await authStore.login({ email: email.value, password: password.value });
    console.log('✅ Redirecting to /documents');
    await router.push('/documents');
  } catch (error: any) {
    console.error('Login failed:', error);

    // Extract and display user-friendly error message
    const errorMessage = error.response?.data?.error?.message ||
                        error.response?.data?.message ||
                        error.message;

    if (errorMessage?.toLowerCase().includes('invalid credentials') ||
        errorMessage?.toLowerCase().includes('unauthorized')) {
      localError.value = 'Invalid email or password. Please try again.';
    } else if (errorMessage?.toLowerCase().includes('user not found')) {
      localError.value = 'No account found with this email. Please sign up first.';
    } else {
      localError.value = errorMessage || 'Login failed. Please try again.';
    }
  }
};
</script>

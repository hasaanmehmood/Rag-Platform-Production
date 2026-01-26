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
        <p class="text-gray-300 text-lg">Create your account</p>
      </div>

      <div class="glass-dark-modern p-8 rounded-3xl neon-border">
        <form @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Email</label>
            <input
              v-model="email"
              type="email"
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              class="w-full bg-dark-200 border border-white/20 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 placeholder-gray-500 transition-all"
              :class="{ 'border-red-500/50': error }"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Password</label>
            <input
              v-model="password"
              type="password"
              required
              minlength="8"
              class="w-full bg-dark-200 border border-white/20 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 placeholder-gray-500 transition-all"
              :class="{ 'border-red-500/50': error }"
              placeholder="••••••••"
            />
            <p class="text-xs text-gray-500 mt-2">At least 8 characters</p>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-300 mb-2 uppercase tracking-wider">Confirm Password</label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              minlength="8"
              class="w-full bg-dark-200 border border-white/20 text-white rounded-xl px-4 py-3 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 placeholder-gray-500 transition-all"
              :class="{ 'border-red-500/50': error }"
              placeholder="••••••••"
            />
          </div>

          <div v-if="error" class="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full btn-modern text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ authStore.loading ? 'Creating account...' : 'Sign Up' }}
          </button>
        </form>

        <div class="mt-8 text-center">
          <p class="text-sm text-gray-400">
            Already have an account?
            <router-link to="/login" class="text-primary-400 hover:text-primary-300 font-semibold ml-1">
              Sign in
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
const confirmPassword = ref('');
const error = ref('');

async function handleRegister() {
  error.value = '';

  // Validate email format
  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
  if (!emailRegex.test(email.value)) {
    error.value = 'Please enter a valid email address';
    return;
  }

  // Validate password length (backend requires 8 characters)
  if (password.value.length < 8) {
    error.value = 'Password must be at least 8 characters';
    return;
  }

  // Validate passwords match
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  try {
    await authStore.register({
      email: email.value,
      password: password.value
    });
    router.push('/documents');
  } catch (err: any) {
    console.error('Registration error:', err);

    // Extract error message from various possible formats
    const errorMessage = err.response?.data?.error?.message ||
                        err.response?.data?.message ||
                        err.response?.data?.error ||
                        err.message ||
                        'Registration failed. Please try again.';

    // Provide user-friendly error messages
    if (errorMessage.toLowerCase().includes('already exists') ||
        errorMessage.toLowerCase().includes('already registered')) {
      error.value = 'An account with this email already exists. Try logging in instead.';
    } else if (errorMessage.toLowerCase().includes('invalid email')) {
      error.value = 'Please enter a valid email address';
    } else if (errorMessage.toLowerCase().includes('password')) {
      error.value = errorMessage;
    } else {
      error.value = errorMessage;
    }
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">RAG Platform</h1>
        <p class="text-gray-600">Create your account</p>
      </div>

      <div class="card">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              v-model="name"
              type="text"
              class="input"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="input"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              v-model="password"
              type="password"
              required
              minlength="8"
              class="input"
              placeholder="••••••••"
            />
            <p class="mt-1 text-xs text-gray-500">At least 8 characters</p>
          </div>

          <div v-if="authStore.error" class="text-red-600 text-sm">
            {{ authStore.error }}
          </div>

          <button
            type="submit"
            :disabled="authStore.loading"
            class="w-full btn-primary"
          >
            {{ authStore.loading ? 'Creating account...' : 'Sign Up' }}
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Already have an account?
            <router-link to="/login" class="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </router-link>
          </p>
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

const name = ref('');
const email = ref('');
const password = ref('');

const handleRegister = async () => {
  try {
    await authStore.register({
      email: email.value,
      password: password.value,
      name: name.value || undefined,
    });
    router.push('/documents');
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
</script>
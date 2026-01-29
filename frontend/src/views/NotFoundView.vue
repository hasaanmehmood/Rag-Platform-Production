<template>
  <div class="min-h-screen flex items-center justify-center mesh-gradient particle-bg px-4">
    <div class="max-w-2xl w-full text-center">
      <div class="mb-8">
        <div class="inline-block mb-6">
          <div class="scale-75">
            <LogoLoader />
          </div>
        </div>
        <h1 class="text-9xl font-black gradient-text text-glow mb-4">404</h1>
        <h2 class="text-3xl font-bold text-white mb-4">Page Not Found</h2>
        <p class="text-xl text-gray-300 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <div class="flex gap-4 justify-center">
        <router-link
          to="/"
          class="btn-modern btn-modern-sm text-lg px-8 py-3"
        >
          Go Home
        </router-link>
        <button
          @click="goBack"
          class="px-8 py-3 border-2 border-white/30 text-white rounded-xl text-lg font-bold hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
        >
          Go Back
        </button>
      </div>

      <div class="mt-12 glass-dark-modern p-6 rounded-2xl neon-border">
        <h3 class="text-lg font-bold text-white mb-4">Quick Links</h3>
        <div class="grid grid-cols-2 gap-4">
          <router-link
            to="/login"
            class="p-4 bg-dark-200 border border-white/10 rounded-xl hover:border-primary-500/50 hover:bg-dark-300 transition-all duration-300 text-white font-semibold"
          >
            Sign In
          </router-link>
          <router-link
            to="/register"
            class="p-4 bg-dark-200 border border-white/10 rounded-xl hover:border-primary-500/50 hover:bg-dark-300 transition-all duration-300 text-white font-semibold"
          >
            Sign Up
          </router-link>
          <router-link
            to="/documents"
            class="p-4 bg-dark-200 border border-white/10 rounded-xl hover:border-primary-500/50 hover:bg-dark-300 transition-all duration-300 text-white font-semibold"
          >
            My Documents
          </router-link>
          <router-link
            to="/chat"
            class="p-4 bg-dark-200 border border-white/10 rounded-xl hover:border-primary-500/50 hover:bg-dark-300 transition-all duration-300 text-white font-semibold"
          >
            Chat
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import LogoLoader from '@/components/LogoLoader.vue';

const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};
</script>

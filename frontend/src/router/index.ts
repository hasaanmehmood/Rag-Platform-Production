import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import authService from '@/services/auth.service';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('@/views/LandingView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresAuth: false },
    },
    {
      path: '/documents',
      name: 'documents',
      component: () => import('@/views/DocumentsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/chat',
      name: 'chat',
      component: () => import('@/views/ChatView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { requiresAuth: false },
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  console.log('🔀 Router navigating from', from.path, 'to', to.path);
  
  const authStore = useAuthStore();
  const isAuthenticated = authService.isAuthenticated();
  
  console.log('🔐 Is authenticated:', isAuthenticated);
  console.log('🔐 Route requires auth:', to.meta.requiresAuth);

  // If route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('❌ Not authenticated, redirecting to login');
    return next({ name: 'login' });
  }

  // If user is authenticated and trying to access login/register/landing
  if (!to.meta.requiresAuth && isAuthenticated && (to.name === 'login' || to.name === 'register' || to.name === 'landing')) {
    console.log('✅ Already authenticated, redirecting to documents');
    return next({ name: 'documents' });
  }

  // Fetch current user if authenticated but not loaded
  if (isAuthenticated && !authStore.user) {
    console.log('📥 Fetching current user');
    await authStore.fetchCurrentUser();
  }

  console.log('✅ Navigation allowed');
  next();
});

export default router;
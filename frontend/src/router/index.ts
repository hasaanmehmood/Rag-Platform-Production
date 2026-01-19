import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import authService from '@/services/auth.service';

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
      path: '/',
      redirect: '/documents',
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
  ],
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = authService.isAuthenticated();

  // If route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ name: 'login' });
  }

  // If user is authenticated and trying to access login/register
  if (!to.meta.requiresAuth && isAuthenticated) {
    return next({ name: 'documents' });
  }

  // Fetch current user if authenticated but not loaded
  if (isAuthenticated && !authStore.user) {
    await authStore.fetchCurrentUser();
  }

  next();
});

export default router;
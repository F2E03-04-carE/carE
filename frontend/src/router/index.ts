import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/join-garage',
      name: 'JoinGarage',
      component: () => import('@/views/Garage/JoinGarage.vue'),
      meta: {
        title: '刊登維修廠 - carE',
      },
    },
    {
      path: '/auth/callback',
      name: 'auth-callback',
      component: () => import('@/views/Auth/AuthCallback.vue'),
    },
  ],
});

export default router;

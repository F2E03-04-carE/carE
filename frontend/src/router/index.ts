import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home/Home.vue'),
      meta: {
        title: 'carE - 汽車維修平台',
      },
    },
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
    {
      path: '/member/profile',
      name: 'member-profile',
      component: () => import('@/views/User/UserDashboard.vue'),
      meta: {
        title: '會員基本資料 - carE',
        requiresAuth: true,
      },
    },
    {
      path: '/member/bookings',
      name: 'member-bookings',
      component: () => import('@/views/User/BookingList.vue'),
      meta: {
        title: '預約紀錄 - carE',
        requiresAuth: true,
      },
    },
    {
      path: '/member/history',
      name: 'member-history',
      component: () => import('@/views/User/MaintenanceHistory.vue'),
      meta: {
        title: '維修歷史 - carE',
        requiresAuth: true,
      },
    },
    {
      path: '/member/post-garage',
      name: 'member-post-garage',
      component: () => import('@/views/Garage/JoinGarage.vue'),
      meta: {
        title: '刊登維修廠 - carE',
        requiresAuth: true,
      },
    },
  ],
});

export default router;

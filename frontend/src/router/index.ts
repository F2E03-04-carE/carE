import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // 路由跳轉後的滾動行為
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    }
    return { top: 0, behavior: 'smooth' };
  },
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/Home/Home.vue'),
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
      path: '/search',
      name: 'SearchResults',
      component: () => import('@/views/Search/SearchResults.vue'),
      meta: {
        title: '搜尋結果 - carE',
      },
    },
    {
      path: '/search/:id',
      name: 'ShopDetail',
      component: () => import('@/components/Search/DetailView.vue'),
      meta: {
        title: '保養廠詳情 - carE',
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
    {
      path: '/garage/onboarding',
      name: 'GarageOnboarding',
      component: () => import('@/views/Garage/GarageOnboarding.vue'),
      meta: {
        title: '商家基本資料 - carE',
        requiresAuth: true,
      },
    },
    {
      path: '/garage/subscription',
      name: 'SubscriptionSelection',
      component: () => import('@/views/Garage/SubscriptionSelection.vue'),
      meta: {
        title: '選擇訂閱方案 - carE',
        requiresAuth: true,
      },
    },
    {
      path: '/garage/subscription/success',
      name: 'SubscriptionSuccess',
      component: () => import('@/views/Garage/SubscriptionSuccess.vue'),
      meta: {
        title: '訂閱成功 - carE',
        requiresAuth: true,
      },
    },
    {
      path: '/garage/subscription/failure',
      name: 'SubscriptionFailure',
      component: () => import('@/views/Garage/SubscriptionFailure.vue'),
      meta: {
        title: '訂閱失敗 - carE',
        requiresAuth: true,
      },
    },
  ],
});

export default router;

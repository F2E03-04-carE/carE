import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      path: '/terms',
      name: 'TermsOfService',
      component: () => import('@/views/Legal/TermsOfService.vue'),
      meta: {
        title: '服務條款 - carE',
      },
    },
    {
      path: '/privacy',
      name: 'PrivacyPolicy',
      component: () => import('@/views/Legal/PrivacyPolicy.vue'),
      meta: {
        title: '隱私權政策 - carE',
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
        title: '會員中心 - carE',
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
        // 不需要 requiresAuth，因為從金流頁面跳回時認證狀態可能還沒恢復
      },
    },
    {
      path: '/garage/subscription/failure',
      name: 'SubscriptionFailure',
      component: () => import('@/views/Garage/SubscriptionFailure.vue'),
      meta: {
        title: '訂閱失敗 - carE',
        // 不需要 requiresAuth，因為從金流頁面跳回時認證狀態可能還沒恢復
      },
    },
    // 維修廠後台頁面（直接路由，透過 navbar 切換）
    {
      path: '/garage/admin/dashboard',
      name: 'garage-admin-dashboard',
      component: () => import('@/views/GarageAdmin/GarageDashboard.vue'),
      meta: {
        title: '總覽 - 維修廠後台 - carE',
        requiresAuth: true,
      },
    },
    {
      path: '/garage/admin/appointments',
      name: 'garage-admin-appointments',
      component: () => import('@/views/GarageAdmin/GarageAppointments.vue'),
      meta: {
        title: '預約排程 - 維修廠後台 - carE',
        requiresAuth: true,
      },
    },
    {
      path: '/garage/admin/records',
      name: 'garage-admin-records',
      component: () => import('@/views/GarageAdmin/GarageRecords.vue'),
      meta: {
        title: '完工維修紀錄 - 維修廠後台 - carE',
        requiresAuth: true,
      },
    },
    {
      path: '/garage/admin/settings',
      name: 'garage-admin-settings',
      component: () => import('@/views/GarageAdmin/GarageSettings.vue'),
      meta: {
        title: '編輯維修廠 - 維修廠後台 - carE',
        requiresAuth: true,
      },
    },
  ],
});

// 路由守衛：檢查需要登入的頁面
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();

  // 檢查路由是否需要登入
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 未登入，重定向到首頁
    // 儲存原本要去的路由，登入後可跳回
    next({ name: 'Home', query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;

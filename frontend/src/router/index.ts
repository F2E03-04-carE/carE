import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUserStore, type UserRole } from '@/stores/user';
import { useUiStore } from '@/stores/ui';

// 擴充 vue-router 的型別定義
declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    requiresAuth?: boolean;
    allowedRoles?: UserRole[];
  }
}

const routes: RouteRecordRaw[] = [
  // --- 公開區 ---
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home/Home.vue'),
    meta: { title: '首頁' },
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: () => import('@/views/Search/SearchResults.vue'),
    meta: { title: '搜尋結果' },
  },
  {
    path: '/garage/:id',
    name: 'GarageDetail',
    component: () => import('@/components/Search/DetailView.vue'),
    meta: { title: '車廠詳情' },
  },
  {
    path: '/join-garage',
    name: 'JoinGarage',
    component: () => import('@/views/Garage/JoinGarage.vue'),
    meta: { title: '加入我們' },
  },
  {
    path: '/garage/onboarding',
    name: 'GarageOnboarding',
    component: () => import('@/views/Garage/GarageOnboarding.vue'),
    meta: { title: '商家開通' },
  },

  // --- 認證相關 ---
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: () => import('@/views/Auth/AuthCallback.vue'),
  },

  // --- 需登入功能 ---
  {
    path: '/booking/:garageId',
    name: 'BookingFlow',
    component: () => import('@/components/service-search/ServiceSearchFlow.vue'),
    meta: { 
      requiresAuth: true, 
      allowedRoles: ['member'],
      title: '預約服務'
    },
  },

  // --- 會員中心 ---
  {
    path: '/member',
    meta: { requiresAuth: true, allowedRoles: ['member'] },
    children: [
      {
        path: '',
        name: 'MemberDashboard',
        component: () => import('@/views/User/UserDashboard.vue'),
        meta: { title: '會員中心' }
      },
      {
        path: 'vehicles',
        name: 'MemberVehicles',
        component: () => import('@/views/User/VehicleManagement.vue'),
        meta: { title: '愛車管理' }
      },
      {
        path: 'bookings',
        name: 'MemberBookings',
        component: () => import('@/views/User/BookingList.vue'),
        meta: { title: '預約紀錄' }
      },
      {
        path: 'history',
        name: 'MemberHistory',
        component: () => import('@/views/User/MaintenanceHistory.vue'),
        meta: { title: '歷史保養' }
      }
    ],
  },

  // --- 車廠後台 ---
  {
    path: '/garage-admin',
    meta: { requiresAuth: true, allowedRoles: ['garage'] },
    component: () => import('@/layouts/GarageAdminLayout.vue'),
    children: [
      {
        path: 'overview',
        name: 'GarageOverview',
        component: () => import('@/views/GarageAdmin/OverView.vue'),
        meta: { title: '商家總覽' }
      },
      {
        path: 'orders',
        name: 'GarageOrders',
        component: () => import('@/views/GarageAdmin/OrdersView.vue'),
        meta: { title: '訂單管理' }
      },
      {
        path: 'schedule',
        name: 'GarageSchedule',
        component: () => import('@/views/GarageAdmin/ScheduleView.vue'),
        meta: { title: '排程管理' }
      },
      {
        path: 'edit',
        name: 'GarageEdit',
        component: () => import('@/views/GarageAdmin/EditView.vue'),
        meta: { title: '商家資訊' }
      },
    ],
  },

  // --- 錯誤頁面 ---
  {
    path: '/error',
    name: 'Error',
    component: () => import('@/views/Error/ErrorView.vue'),
    meta: { title: '發生錯誤' }
  },

  // --- 404 Catch-all ---
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/Error/ErrorView.vue'),
    meta: { title: '頁面不存在' }
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (to, from, savedPosition) => (savedPosition || { top: 0 }),
});

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const userStore = useUserStore();
  const uiStore = useUiStore();

  if (to.meta.title) document.title = `${to.meta.title} | carE`;

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      uiStore.openLoginModal(to.fullPath);
      return next('/');
    }
    if (to.meta.allowedRoles && !to.meta.allowedRoles.includes(userStore.userRole)) {
      // 權限不足導向 403 錯誤狀態
      return next({ name: 'Error', query: { status: '403' } });
    }
  }

  next();
});

export default router;
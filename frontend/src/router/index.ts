import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ShopAdminLayout from '@/views/ShopAdmin/layout/ShopAdminLayout.vue';

const routes = [
  {
    path: '/',
    component: ShopAdminLayout,
    children: [
      {
        path: 'overview',
        name: 'overview',
        component: () => import('@/views/ShopAdmin/OverView.vue'),
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/views/ShopAdmin/OrdersView.vue'),
      },
      {
        path: 'schedule',
        name: 'schedule',
        component: () => import('@/views/ShopAdmin/ScheduleView.vue'),
      },
      {
        path: 'records',
        name: 'records',
        component: () => import('@/views/ShopAdmin/RecordsView.vue'),
      },
      {
        path: 'edit',
        name: 'edit',
        component: () => import('@/views/ShopAdmin/EditView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// 全局路由守衛
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  // 如果沒有 workshop 資料，強制設定為 onboarding 狀態
  if (!auth.workshop) {
    auth.setStatus('onboarding');
  }

  const status = auth.status;

  // 處理根路徑 '/' 的導向邏輯
  if (to.path === '/') {
    if (status === 'active') {
      return next('/overview');
    } else if (status === 'onboarding' || status === 'pending_review') {
      return next('/edit');
    }
  }

  // 尚未開通的使用者 (onboarding 或 pending_review) 只能待在編輯頁
  if ((status === 'onboarding' || status === 'pending_review') && to.path !== '/edit') {
    return next('/edit');
  }

  // 其他路徑正常放行
  next();
});

export default router;

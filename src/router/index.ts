import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ShopAdminLayout from '@/components/shop/layout/ShopAdminLayout.vue'

const routes = [
  {
    path: '/',
    component: ShopAdminLayout,
    children: [
      {
        path: '',
        redirect: '/overview',
      },
      {
        path: 'overview',
        name: 'overview',
        component: () => import('@/components/shop/OverView.vue'),
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/components/shop/OrdersView.vue'),
      },
      {
        path: 'schedule',
        name: 'schedule',
        component: () => import('@/components/shop/ScheduleView.vue'),
      },
      {
        path: 'records',
        name: 'records',
        component: () => import('@/components/shop/RecordsView.vue'),
      },
      {
        path: 'edit',
        component: () => import('@/components/shop/edit/EditView.vue'),
        children: [
          {
            path: '',
            redirect: { name: 'info' },
          },
          {
            path: 'info',
            name: 'info',
            component: () => import('@/components/shop/edit/components/Info.vue'),
          },
          {
            path: 'hours',
            name: 'hours',
            component: () => import('@/components/shop/edit/components/Hours.vue'),
          },
          {
            path: 'photos',
            name: 'photos',
            component: () => import('@/components/shop/edit/components/Photos.vue'),
          },
        ],
      },
      {
        path: 'billing',
        name: 'billing',
        component: () => import('@/components/shop/BillingView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 🟢 全局路由守衛
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  // 尚未有 workshop → 強制 info
  if (!auth.workshop) {
    if (to.path !== '/edit/info') return next('/edit/info')
    return next()
  }

  // 尚未填資料 / 尚未開通 → 一律跳 info
  if (auth.workshop.status !== 'active' || !auth.workshop.profile_completed) {
    if (!to.path.startsWith('/edit')) return next('/edit/info')
    return next()
  }

  // 已開通 → 登入 / 編輯 info 頁面跳 overview
  if (auth.workshop.status === 'active' && (to.path === '/' || to.path.startsWith('/edit/info'))) {
    return next('/overview')
  }

  // 其他路徑正常放行
  next()
})

export default router

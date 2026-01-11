import { createRouter, createWebHistory } from 'vue-router'

import ShopAdminLayout from '@/components/shop/layout/ShopAdminLayout.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
          component: () => import('@/components/shop/Overview.vue'),
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
  ],
})

export default router

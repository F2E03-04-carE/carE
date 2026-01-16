import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/join-garage',
      name: 'JoinGarage',
      component: () => import('@/views/Garage/JoinGarage.vue'),
      meta: {
        title: '加入維修廠 - carE',
      },
    },
  ],
})

export default router

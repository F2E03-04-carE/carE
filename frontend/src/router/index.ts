import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
]
})

export default router

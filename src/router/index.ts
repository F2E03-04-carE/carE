import { createRouter, createWebHistory } from 'vue-router'
import SearchResults from '@/components/SearchResults.vue'
import Home from '@/components/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/search',
      name: 'search',
      component: SearchResults
    }
  ],
})

export default router

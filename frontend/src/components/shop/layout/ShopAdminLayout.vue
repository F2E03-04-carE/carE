<script setup lang="ts">
import AsideMenu from './AsideMenu.vue';
import DevRoleSwitcher from '../DevRoleSwitcher.vue';
import { watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

// 監聽使用者身分狀態的變化
watch(
  () => authStore.status,
  (newStatus) => {
    // 當身分變為 'onboarding' 或 'pending_review' 且當前路徑不是 '/edit'
    if ((newStatus === 'onboarding' || newStatus === 'pending_review') && route.path !== '/edit') {
      // 強制導向到 /edit 頁面
      router.push('/edit');
    }
  },
);
</script>

<template>
  <div class="relative min-h-screen flex text-[#4a4a43]">
    <AsideMenu />
    <DevRoleSwitcher />

    <main class="w-[80%] ml-[20%] px-8 py-4 bg-white rounded-xl shadow-sm">
      <router-view />
    </main>
  </div>
</template>

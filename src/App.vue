<script setup lang="ts">
import { ref } from "vue"; // ✅ 新增
import Home from './components/Home.vue'
import LoginModal from "./components/auth/LoginModal.vue"; // ✅ 新增
const isLoginOpen = ref(false); // ✅ 新增
</script>

<template>
  <Home />
  <!-- ✅ 登入浮窗：只掛載，不影響 Home -->
  <LoginModal :open="isLoginOpen" @close="isLoginOpen = false" />

  <!-- ✅ 測試用按鈕（之後 NAV 好了直接刪） -->
  <button
    type="button"
    class="fixed bottom-6 right-6 z-[9998] rounded-xl px-4 py-2 text-white shadow-lg bg-emerald-600 hover:bg-emerald-700"
    @click="isLoginOpen = true"
  >
    測試登入
  </button>
</template>

<style scoped></style>

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 先讓首頁導到註冊頁，確保 Register 一定可到達（解掉 reviewer P1）
    { path: "/", redirect: "/register" },

    {
      path: "/register",
      name: "register",
      component: () => import("../components/RegisterView.vue"),
    },
  ],
});

export default router;

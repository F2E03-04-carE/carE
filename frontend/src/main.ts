import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import './main.css';
import { setupCalendar } from 'v-calendar';
import { useAuthStore } from './stores/auth';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(setupCalendar, {});

// 初始化認證狀態
const authStore = useAuthStore();

// 使用 await 確保認證狀態初始化完成後才掛載應用
// 這樣可以避免在路由守衛 (Guard) 中因為狀態尚未準備好而導致錯誤的重導向
await authStore.initialize();

app.mount('#app');

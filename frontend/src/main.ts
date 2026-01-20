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
authStore.initialize();

app.mount('#app');

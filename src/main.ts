import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import './main.css'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { setupCalendar } from 'v-calendar'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(setupCalendar, {})

app.mount('#app')

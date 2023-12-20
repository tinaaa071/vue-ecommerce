import { createApp } from 'vue'
// 匯入 axios
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import router from './router'

// 調整
const app = createApp(App)
app.use(VueAxios, axios)
app.use(router)
app.mount('#app')

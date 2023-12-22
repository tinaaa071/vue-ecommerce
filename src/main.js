import { createApp } from 'vue'

// 匯入 axios
import axios from 'axios'
import VueAxios from 'vue-axios'

// loading 效果
// Import component
import Loading from 'vue3-loading-overlay'
// Import stylesheet
import 'vue3-loading-overlay/dist/vue3-loading-overlay.css'

import App from './App.vue'
import router from './router'

import 'bootstrap/dist/js/bootstrap.bundle'

// 全域註冊
const app = createApp(App)
app.use(VueAxios, axios)
app.use(router)
app.component('LoadingEffect', Loading)
app.mount('#app')

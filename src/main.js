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

// 匯出 filters.js 內之檔案
import { currency, date } from './methods/filters'
// 匯出
import $httpMessageState from './methods/pushMessageState'

// bootstrap
import 'bootstrap/dist/js/bootstrap.bundle'
// bootstrap icons
import 'bootstrap-icons/font/bootstrap-icons.css'

// 全域註冊
const app = createApp(App)
app.use(VueAxios, axios)
app.use(router)
app.component('LoadingEffect', Loading)
app.mount('#app')
// 使用 config 註冊
// app.config.globalProperties.自定義屬性名稱
app.config.globalProperties.$filters = {
  date,
  currency
}
// 將 $httpMessageState 加入 global
// 此函式的用途是整合 Ajax 的錯誤事件，統一整理發送給予 Toast 處理
// 正常來說不建議將太多方法掛 Global，此處可使用 provide 處理
app.config.globalProperties.$httpMessageState = $httpMessageState

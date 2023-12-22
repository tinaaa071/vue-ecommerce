<template>
    <!-- 加入 Navbar 元件 -->
    <Navbar></Navbar>
    <div class="container-fluid mt-3 position-relative">
    <!-- 加入 ToastMessage -->
    <ToastMessages></ToastMessages>
    <router-view/>
  </div>
</template>

<script>
// 匯入 mitt
import emitter from '@/methods/emitter'
// 匯入 NavBar
import Navbar from '../components/NavBar.vue'
// 匯入 ToastMessage
import ToastMessages from '@/components/ToastMessages.vue'

export default {
  // 區域註冊元件
  components: {
    Navbar,
    ToastMessages
  },
  // 使內層元件都可使用外層功能
  provide () {
    return {
      emitter
    }
  },
  created () {
    // 使用 replace 取出 token
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
    console.log(token)
    // 加入至 headers
    this.$http.defaults.headers.common.Authorization = `${token}`

    console.log('login')
    // ${環境變數站點位置/實際 API}
    const api = `${process.env.VUE_APP_API}api/user/check`
    console.log(api)
    // 送出 API
    // (api 路徑, 夾帶的資料)
    this.$http.post(api, this.user)
    // promise
      .then((res) => {
        console.log(res)
        // 判斷登入失敗，回到首頁
        if (!res.data.success) {
          this.$router.push('/login')
        }
      })
  }
}
</script>

<template>
    <!-- 加入 Navbar 元件 -->
    <Navbar></Navbar>
    <router-view/>
</template>

<script>
// 導入 NavBar
import Navbar from '../components/NavBar.vue'

export default {
  // 區域註冊 Navbar 元件
  components: {
    Navbar
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

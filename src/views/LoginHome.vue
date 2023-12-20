<template>
    <div class="container mt-5">
        <!-- @submit 加上 .prevent 避免觸發 html 預設事件 -->
        <form class="row justify-content-center"
        @submit.prevent="signIn">
            <div class="col-md-6">
                <h1 class="h3 mb-3 font-weight-normal">請先登入</h1>
                <div class="mb-2">
                <label for="inputEmail" class="sr-only">Email address</label>
                <input
                    type="email"
                    id="inputEmail"
                    class="form-control"
                    placeholder="Email address"
                    required
                    autofocus
                    v-model="user.username"
                />
                </div>
                <div class="mb-2">
                <label for="inputPassword" class="sr-only">Password</label>
                <input
                    type="password"
                    id="inputPassword"
                    class="form-control"
                    placeholder="Password"
                    required
                    v-model="user.password"
                />
                </div>

                <div class="text-end mt-4">
                <button class="btn btn-lg btn-primary btn-block" type="submit">登入</button>
                </div>
            </div>
        </form>
</div>
</template>

<script>
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // 自訂方法名稱
    signIn () {
      console.log('login')
      // ${環境變數站點位置/實際 API}
      const api = `${process.env.VUE_APP_API}admin/signin`
      console.log(api)
      // 送出 API
      // (api 路徑, 夾帶的資料)
      this.$http.post(api, this.user)
        // promise
        .then((res) => {
          // 判斷登入成功，就轉至 DashBoard
          if (res.data.success) {
            // 新增 cookie
            // document.cookie = `自定義名稱=${token}; 到期日`
            const { token, expired } = res.data
            // console.log(token, expired)
            // 需將到期日轉載成 token 可儲存之編碼
            document.cookie = `hexToken=${token}; expires=${new Date(expired)}`
            // console.log(res)
            // 轉址到 DashBoard
            this.$router.push('/dashboard/products')
          }
        })
    }
  }
}
</script>

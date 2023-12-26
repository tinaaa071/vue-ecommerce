<template>
    <LoadingEffect :active="isLoading"></LoadingEffect>
    <div class="container">
      <div class="row mt-4">
        <div class="col-md-7">
          <table class="table align-middle">
            <thead>
            <tr>
              <th>圖片</th>
              <th>商品名稱</th>
              <th>價格</th>
              <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in products" :key="item.id">
              <td style="width: 200px">
                <div style="height: 100px; background-size: cover; background-position: center"
                     :style="{backgroundImage: `url(${item.imageUrl})`}"></div>
              </td>
              <td><a href="#" class="text-dark">{{ item.title }}</a></td>
              <td>
                <div class="h5" v-if="!item.price">{{ item.origin_price }} 元</div>
                <del class="h6" v-if="item.price">原價 {{ item.origin_price }} 元</del>
                <div class="h5" v-if="item.price">現在只要 {{ item.price }} 元</div>
              </td>
              <td>
                <div class="btn-group btn-group-sm">
                  <button type="button" class="btn btn-outline-secondary"
                          @click="getProduct(item.id)">
                    查看更多
                  </button>
                  <!-- 將  this.status.loadingItem 和當前 item.id 做比對，符合則按鈕顯示 disabled -->
                  <button type="button" class="btn btn-outline-danger"
                  :disabled="this.status.loadingItem === item.id"
                  @click="addCart(item.id)"
                          >
                          <!-- spinner 效果 -->
                          <div v-if="this.status.loadingItem === item.id" class="spinner-grow spinner-grow-sm text-danger" role="status">
                            <span class="visually-hidden">
                                Loading...
                            </span>
                        </div>
                    加到購物車
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <!-- 購物車列表 -->
        <div class="col-md-5">
            <div class="sticky-top">
            <table class="table align-middle">
                <thead>
                <tr>
                    <th></th>
                    <th>品名</th>
                    <th style="width: 110px">數量</th>
                    <th>單價</th>
                </tr>
                </thead>
                <tbody>
                <!-- 判斷陣列是否存在 -->
                <template v-if="cart.carts">
                <!-- 若陣列存在，就使用 v-for 將陣列內容呈現 -->
                <tr v-for="item in cart.carts" :key="item.id">
                    <td>
                    <button type="button" class="btn btn-outline-danger btn-sm"
                            :disabled="status.loadingItem === item.id"
                            @click="removeCartItem(item.id)">
                        <i class="bi bi-x"></i>
                    </button>
                    </td>
                    <td>
                    {{ item.product.title }}
                    <div class="text-success" v-if="item.coupon">
                        已套用優惠券
                    </div>
                    </td>
                    <td>
                    <!-- 數量 -->
                    <div class="input-group input-group-sm">
                        <input type="number" class="form-control"
                        min="1"
                        :disabled="item.id === status.loadingItem"
                        @change="updateCart(item)"
                        v-model.number="item.qty">
                        <div class="input-group-text">/ {{ item.product.unit }}</div>
                    </div>
                    </td>
                    <td class="text-end">
                    <small v-if="cart.final_total !== cart.total" class="text-success">折扣價：</small>
                    {{ $filters.currency(item.final_total) }}
                    </td>
                </tr>
                </template>
                </tbody>
                <tfoot>
                <tr>
                <td colspan="3" class="text-end">總計</td>
                <td class="text-end">{{ $filters.currency(cart.total) }}</td>
                </tr>
                <tr v-if="cart.final_total !== cart.total">
                <td colspan="3" class="text-end text-success">折扣價</td>
                <td class="text-end text-success">{{ $filters.currency(cart.final_total) }}</td>
                </tr>
                </tfoot>
            </table>
            <div class="input-group mb-3 input-group-sm">
                <input type="text" class="form-control" v-model="coupon_code" placeholder="請輸入優惠碼">
                <div class="input-group-append">
                <button class="btn btn-outline-secondary" type="button" @click="addCouponCode">
                    套用優惠碼
                </button>
                </div>
            </div>
            </div>
        </div>
      </div>

      <!-- 結帳表 -->
      <div class="my-5 row justify-content-center">
        <VForm class="col-md-6" v-slot="{ errors }"
              @submit="createOrder">
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <VField id="email" name="email" type="email" class="form-control"
                    :class="{ 'is-invalid': errors['email'] }"
                    placeholder="請輸入 Email" rules="email|required"
                    v-model="form.user.email"></VField>
            <ErrorMessage name="email" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="name" class="form-label">收件人姓名</label>
            <VField id="name" name="姓名" type="text" class="form-control"
                    :class="{ 'is-invalid': errors['姓名'] }"
                    placeholder="請輸入姓名" rules="required"
                    v-model="form.user.name"></VField>
            <ErrorMessage name="姓名" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="tel" class="form-label">收件人電話</label>
            <VField id="tel" name="電話" type="tel" class="form-control"
                    :class="{ 'is-invalid': errors['電話'] }"
                    placeholder="請輸入電話" rules="required"
                    v-model="form.user.tel"></VField>
            <ErrorMessage name="電話" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="address" class="form-label">收件人地址</label>
            <VField id="address" name="地址" type="text" class="form-control"
                    :class="{ 'is-invalid': errors['地址'] }"
                    placeholder="請輸入地址" rules="required"
                    v-model="form.user.address"></VField>
            <ErrorMessage name="地址" class="invalid-feedback"></ErrorMessage>
          </div>

          <div class="mb-3">
            <label for="message" class="form-label">留言</label>
            <textarea name="" id="message" class="form-control" cols="30" rows="10"
                      v-model="form.message"></textarea>
          </div>
          <div class="text-end">
            <button class="btn btn-danger">送出訂單</button>
          </div>
        </VForm>
      </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
      products: [],
      product: {},
      status: {
        // 對應品項 id，若為特定品項轉為 disabled 並加上讀取效果
        loadingItem: ''
      },
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: ''
        },
        message: ''
      },
      cart: {},
      coupon_code: ''
    }
  },
  methods: {
    // 取得產品列表
    getProducts () {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/all`
      this.isLoading = true
      this.$http.get(url).then((response) => {
        this.products = response.data.products
        console.log('products:', response)
        this.isLoading = false
      })
    },
    // 取得單一產品
    getProduct (id) {
      this.$router.push(`/user/product/${id}`)
    },
    // 加入購物車
    addCart (id) {
      // API
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`
      // 點擊時加入讀取效果
      this.status.loadingItem = id
      const cart = {
        product_id: id,
        qty: 1
      }
      // 發送 API
      this.$http.post(url, { data: cart })
        .then((res) => {
          // 讀取成功後清空讀取效果
          this.status.loadingItem = ''
          console.log(res)
          this.getCart()
        })
    },
    // 加入購物車
    getCart () {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`
      this.isLoading = true
      this.$http.get(url).then((response) => {
        console.log(response)
        this.cart = response.data.data
        this.isLoading = false
      })
    },
    // 更新購物車
    updateCart (item) {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${item.id}`
      this.isLoading = true
      // 讀取效果
      this.status.loadingItem = item.id
      const cart = {
        product_id: item.product_id,
        qty: item.qty
      }
      this.$http.put(url, { data: cart }).then((res) => {
        console.log(res)
        this.status.loadingItem = ''
        this.getCart()
      })
    },
    // 移除購物車品項
    removeCartItem (id) {
      this.status.loadingItem = id
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${id}`
      this.isLoading = true
      this.$http.delete(url).then((response) => {
        this.$httpMessageState(response, '移除購物車品項')
        this.status.loadingItem = ''
        this.getCart()
        this.isLoading = false
      })
    },
    // 加入優惠券
    addCouponCode () {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/coupon`
      const coupon = {
        code: this.coupon_code
      }
      this.isLoading = true
      this.$http.post(url, { data: coupon }).then((response) => {
        this.$httpMessageState(response, '加入優惠券')
        this.getCart()
        this.isLoading = false
      })
    },
    // 驗證表單
    createOrder () {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/order`
      const order = this.form
      this.$http.post(url, { data: order })
        .then((res) => {
          console.log(res)
        })
    }
  },
  created () {
    this.getProducts()
    this.getCart()
  }
}
</script>

<template>
    <!-- Loading 效果 -->
    <!-- :active 為 props
      :active="自定義狀態" -->
    <LoadingEffect :active="isLoading"></LoadingEffect>
    <!-- 新增按鈕 -->
    <div class="text-end">
        <!-- 使用 @click 指向元件 -->
        <button class="btn btn-primary" type="button" @click="openModal(true)">
            增加一個產品
        </button>
    </div>
    <table class="table mt-4">
        <thead>
            <tr>
            <th width="120">分類</th>
            <th>產品名稱</th>
            <th width="120">原價</th>
            <th width="120">售價</th>
            <th width="100">是否啟用</th>
            <th width="200">編輯</th>
            </tr>
        </thead>
        <tbody>
            <!-- 使用 v-for 將產品資料一一呈現 -->
            <!-- 綁定 key，使用產品 id(不會重複) -->
            <tr v-for="item in products" :key="item.id">
            <td>{{ item.category }}</td>
            <td>{{ item.title }}</td>
            <td class="text-right">
                <!-- currency 為函式，所以需使用 currency() -->
                {{ $filters.currency(item.origin_price) }}
            </td>
            <td class="text-right">
                {{ $filters.currency(item.price) }}
            </td>
            <td>
                <!-- 使用 v-if 判斷啟用狀態 -->
                <span class="text-success" v-if="item.is_enabled=1">啟用</span>
                <span class="text-muted" v-else>未啟用</span>
            </td>
            <td>
                <div class="btn-group">
                <button class="btn btn-outline-primary btn-sm"
                @click="openModal(false, item)">編輯</button>
                <button class="btn btn-outline-danger btn-sm" @click="openDelProductModal(item)">
                刪除
              </button>
                </div>
            </td>
            </tr>
        </tbody>
    </table>
    <!-- 載入 PaginationBtn 元件 -->
    <PaginationBtn :pages="pagination" @emit-pages="getProducts"></PaginationBtn>
    <!-- 將 Modal 元件加到畫面上 -->
    <!-- 增加 ref 呼叫 -->
    <!-- 設定觸發 updateProduct 方法 -->
    <ProductModal ref="productModal"
    :product="tempProduct"
    @update-product="updateProduct"></ProductModal>
    <DelProductModal
      :item="tempProduct"
      ref="delProductModal"
      @del-item="delProduct"
    ></DelProductModal>
</template>

<script>
// 匯入 Modal 元件
import ProductModal from '../components/ProductModal.vue'
import DelProductModal from '@/components/DelModal.vue'
import PaginationBtn from '@/components/PaginationBtn.vue'
// 具名匯出 currency 方法
// import { currency } from '@/methods/filters'

export default {
  data () {
    // 回傳產品資訊陣列
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      // 增加屬性狀態
      isNew: false,
      // 預設為 false
      isLoading: false
    }
  },
  // 區域註冊
  components: {
    ProductModal,
    DelProductModal,
    PaginationBtn
  },
  // 加入 emitt
  inject: ['emitter'],
  methods: {
    // 加入 currency
    // currency,
    // 預設在第一頁
    getProducts (page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products/?page=${page}`
      // 讀取 loading 效果
      this.isLoading = true
      // get api 路徑
      this.$http.get(api)
        // promise
        .then((res) => {
          // 取得遠端資料後關閉 loading 效果
          this.isLoading = false
          if (res.data.success) {
            console.log(res.data)
            this.products = res.data.products
            this.pagination = res.data.pagination
          }
        })
    },
    // 獨立 openModal 功能
    // (使否為新, 若是編輯就把品項加入)
    openModal (isNew, item) {
      // 判斷是否為新
      if (isNew) {
        // 清空 tempProduct
        this.tempProduct = {}
      } else {
        // 新的 item 時
        this.tempProduct = { ...item }
      }
      // 暫存狀態
      this.isNew = isNew
      const productComponent = this.$refs.productModal
      // 開啟內層 Modal
      productComponent.showModal()
    },
    // 遠端資料傳送
    updateProduct (item) {
      // 儲存遠端傳送之資料
      this.tempProduct = item

      // 若為新增狀態
      let api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product`
      let httpMethod = 'post'

      // 若 this.isNew 不是新的（編輯狀態）就會執行調整
      if (!this.isNew) {
        // 調整 api
        api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`
        // 調整 httpMethod
        httpMethod = 'put'
      }
      const productComponent = this.$refs.productModal
      // 將資料發送至遠端
      this.$http[httpMethod](api, { data: this.tempProduct }).then((response) => {
        // console.log(response)
        // 設定新增完產品後關閉 Modal
        productComponent.hideModal()
        // 重新取得列表資料
        // this.getProducts()

        if (response.data.success) {
          this.getProducts()
          // 若成功，觸發 emitter
          this.emitter.emit('push-message', {
            style: 'success',
            title: '更新成功'
          })
        } else {
          this.emitter.emit('push-message', {
            style: 'danger',
            title: '更新失敗',
            // 由後端傳送失敗訊息內容，透過 join 將陣列一一取出，並補到 content 內
            content: response.data.message.join('、')
          })
        }
      })
    },
    // 加入 openDelModal 功能
    openDelProductModal (item) {
      this.tempProduct = { ...item }
      console.log(item.id)
      const delComponent = this.$refs.delProductModal
      delComponent.showModal()
    },
    // 刪除商品功能
    delProduct () {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${this.tempProduct.id}`
      this.$http.delete(url).then((response) => {
        console.log(this.tempProduct)
        console.log(response.data)
        const delComponent = this.$refs.delProductModal
        delComponent.hideModal()
        this.getProducts()
      })
    }
  },
  // 於生命週期觸發
  created () {
    this.getProducts()
  }
}
</script>

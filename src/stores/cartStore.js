import axios from 'axios'
import { defineStore } from 'pinia'
import statusStore from './statusStore'

const status = statusStore()

export default defineStore('cartStore', {
  state: () => {
    return {
      cart: {}
    }
  },
  actions: {
    // 加入購物車
    addCart (id) {
      // API
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`
      // 點擊時加入讀取效果
      status.cartLoadingItem = id
      const cart = {
        product_id: id,
        qty: 1
      }
      // 發送 API
      axios.post(url, { data: cart })
        .then((res) => {
          status.PushMessage({ title: '加入購物車' })
          // 讀取成功後清空讀取效果
          status.cartLoadingItem = ''
          console.log(res)
          this.getCart()
        })
    },
    // 加入購物車
    getCart () {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`
      status.isLoading = true
      axios.get(url).then((response) => {
        console.log(response)
        this.cart = response.data.data
        status.isLoading = false
      })
    },
    // 更新購物車
    updateCart (item) {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${item.id}`
      status.isLoading = true
      // 讀取效果
      status.cartLoadingItem = item.id
      const cart = {
        product_id: item.product_id,
        qty: item.qty
      }
      axios.put(url, { data: cart }).then((res) => {
        console.log(res)
        status.cartLoadingItem = ''
        this.getCart()
      })
    },
    // 移除購物車品項
    removeCartItem (id) {
      status.cartLoadingItem = id
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${id}`
      status.isLoading = true
      axios.delete(url).then((response) => {
        // this.$httpMessageState(response, '移除購物車品項')
        status.cartLoadingItem = ''
        this.getCart()
        status.isLoading = false
      })
    }
  }
})

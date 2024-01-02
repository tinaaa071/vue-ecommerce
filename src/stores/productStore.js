import axios from 'axios'
import { defineStore } from 'pinia'
import statusStore from './statusStore'

const status = statusStore()

export default defineStore('productStore', {
  state: () => {
    return {
      products: []
    }
  },
  getters: {
    sortProducts: (state) => state.products.sort((a, b) => a.price - b.price)
  },
  actions: {
    // 可使用 this 存取 state 內之資料
    getProducts () {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products/all`
      // this.isLoading = true
      status.isLoading = true
      axios.get(url).then((response) => {
        this.products = response.data.products
        console.log('products:', response)
        // this.isLoading = false
        status.isLoading = false
      })
    }
  }
})

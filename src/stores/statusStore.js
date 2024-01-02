import { defineStore } from 'pinia'

export default defineStore('statusStore', {
  state: () => {
    return {
      isLoading: false,
      cartLoadingItem: '',
      messages: []
    }
  },
  actions: {
    PushMessage (data) {
      const { title, content, style = 'success' } = data
      this.messages.push({ style, title, content })
    }
  }
})

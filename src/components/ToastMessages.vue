<template>
    <!-- 定位 -->
    <div class="toast-container position-absolute pe-3 top-0 end-0">
      <!-- 列表呈現
        載入內層 Toast 元件，透過 v-for 呈現 -->
      <ToastAlert v-for="(msg, key) in messages" :key="key" :msg="msg" />
    </div>
  </template>

<script>
import { storeToRefs } from 'pinia'
import ToastAlert from '@/components/ToastAlert.vue'
import statusStore from '@/stores/statusStore'

export default {
  components: {
    ToastAlert
  },
  setup () {
    const status = statusStore()
    const { messages } = storeToRefs(status)

    return {
      messages
    }
  }
  // data () {
  //   return {
  //     messages: []
  //   }
  // }
  // inject: ['emitter'],
  // mounted () {
  //   // 觸發 push-message 時，就會將訊息加入訊息列表
  //   // (message) 為外部傳來之資訊
  //   this.emitter.on('push-message', (message) => {
  //     // 有新訊息時，就將相關資訊取出，推送至訊息列表 messages 內
  //     const { style = 'success', title, content } = message
  //     this.messages.push({ style, title, content })
  //   })
  // }
}
</script>

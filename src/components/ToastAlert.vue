<template>
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" ref="ToastAlert">
      <div class="toast-header">
        <span :class="`bg-${msg.style}`" class="p-2 rounded me-2 d-inline-block"></span>
        <strong class="me-auto">{{ msg.title }}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body" v-if="msg.content">
        {{ msg.content }}
      </div>
    </div>
  </template>

<script>
import ToastAlert from 'bootstrap/js/dist/toast'

export default {
  name: 'ToastAlert',
  props: ['msg'],
  mounted () {
    const toastEl = this.$refs.ToastAlert
    // 觸發生命週期後，開啟 6 秒
    const toastAlert = new ToastAlert(toastEl, {
      delay: 6000
    })
    toastAlert.show()
  }
}
</script>

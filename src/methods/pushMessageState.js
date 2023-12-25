import emitter from '@/methods/emitter'

export default function (response, title = '更新') {
  if (response.data.success) {
    // 若成功，觸發 emitter
    emitter.emit('push-message', {
      style: 'success',
      title: `${title}成功`
    })
  } else {
    const message = typeof response.data.message === 'string'
      ? [response.data.message]
      : response.data.message
    emitter.emit('push-message', {
      style: 'danger',
      title: `${title}失敗`,
      // 由後端傳送失敗訊息內容，透過 join 將陣列一一取出，並補到 content 內
      content: message.join('、')
    })
  }
}

<template>
    <nav aria-label="Page navigation example">
      <ul class="pagination justify-content-center">
        <!-- 上一頁 -->
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <!-- 頁碼 -->
        <li class="page-item">
          <a class="page-link" href="#"></a>
        </li>
        <!-- 下一頁 -->
        <li class="page-item">
          <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </template>

<script>
// :pages="{ 頁碼資訊 }"
// @emitPages="更新頁面事件"
export default {
  props: ['pages'],
  methods: {
    updatePage () {
    }
  }
}
</script>

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
        <!-- 使用 v-for 將所有頁數帶出 -->
        <!-- :class="{}" 判斷是否為當前頁面並加上 active -->
        <li class="page-item" v-for="page in pages.total_pages" :key="page" :class="{ 'active': page === pages.current_page }">
          <a class="page-link" href="#" @click.prevent="updatePage(page)">{{ page }}</a>
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
  // 外部傳入的變數 pages，是從 ajax 取回之資料
  props: ['pages'],
  methods: {
    // 自定義名稱
    updatePage (page) {
      // 對外發送切換頁面事件
      // ('切換頁面事件名稱', 頁碼)
      this.$emit('emit-pages', page)
    }
  }
}
</script>

<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="(article, index) in list"
        :key="index"
        :title="article.title"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'SearchResult',
  data() {
    return {
      list: [],
      loading: false, //
      finished: false,
      page: 1, // 页码
      perPage: 10 // 每页大小
    }
  },
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  methods: {
    async onLoad() {
      // 1. 请求获取数据
      const { data } = await getSearchResult({
        page: this.page, // 页码
        per_page: this.perPage, // 每页大小
        q: this.searchText // 搜索的字符
      })

      // 2. 将数据放到数据列表汇总
      console.log(data)
      const { results } = data.data
      this.list.push(...results) // 使用展开运算符进行数组合并

      // 3. 关闭本次的 loading
      this.loading = false

      // 4. 判断是否还有数据
      if (results.length) {
        //    如果有，则更新获取下一页数据的页码
        this.page++
      } else {
        //    如果没有，则把 sinished 设置为 true，关闭加载更多
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-result {
  // 产生自己内部的滚动容器
  position: fixed;
  top: 54px;
  right: 0;
  bottom: 0;
  left: 0;
  // y 轴显示滚动条
  overflow-y: auto;
}
</style>

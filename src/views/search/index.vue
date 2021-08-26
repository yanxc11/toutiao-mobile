<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchText)"
        @cancel="$router.back()"
        @focus="isResultShow = false"
      />
      <!-- @blur="isResultShow = true" -->
    </form>
    <!-- /搜索栏 -->

    <!-- 搜索结果 -->
    <SearchResult v-if="isResultShow" :search-text="searchText" />
    <!-- /搜索结果 -->

    <!-- 联想建议 -->
    <!-- 在父组件中监听search事件。监听到search事件后，调用onSearch方法 -->
    <SearchSuggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />
    <!-- /联想建议 -->

    <!-- 历史记录 -->
    <SearchHistory
      v-else
      :search-histories="searchHistories"
      @search="onSearch"
      @update-histories="searchHistories = $event"
    />
    <!-- $event 事件参数 [] -->
    <!-- /历史记录 -->
  </div>
</template>

<script>
import SearchSuggestion from './components/search-suggestion'
import SearchHistory from './components/search-history'
import SearchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
// import { getSearchHistories } from '@/api/search'
import { mapState } from 'vuex'

export default {
  name: 'SearchIndex',
  components: {
    SearchSuggestion,
    SearchHistory,
    SearchResult
  },
  data() {
    return {
      searchText: '', // 搜索输入框的内容
      isResultShow: false, // 控制搜索结果的显示状态
      searchHistories: [] // 搜索历史数据
    }
  },
  computed: {
    ...mapState(['user'])
  },
  // 通过监视统一处理
  watch: {
    // 监视搜索历史记录的变化，存储到本地存储
    searchHistories() {
      // 只要 searchHistories 发生改变了。就会执行该函数
      setItem('search-histories', this.searchHistories)
    }
  },
  created() {
    this.loadSearchHistories()
  },
  methods: {
    onSearch(searchText) { // 接收子组件传递过来的列表项的值
      // 将传递过来的子组件列表项的值赋值给searchText
      this.searchText = searchText

      // 查找 searchText 所在的下标。如果存在则返回对应下标，如果不存在返回 -1
      const index = this.searchHistories.indexOf(searchText)
      if (index !== -1) { // 重复
        // 删除重复项
        this.searchHistories.splice(index, 1)
      }
      // 把最新的搜索历史记录放到顶部
      this.searchHistories.unshift(searchText) // 这里的searchText是用户输入或点击的值

      // 如果用户已登录，则把搜索历史记录存储到线上
      //    提示：只要我们调用获取搜索结果的数据接口，后端会自动存储用户的搜索历史记录
      // 如果没有登录，则把搜索历史记录存储到本地
      // setItem('search-histories', this.searchHistories)
      // 展示搜索结果
      this.isResultShow = true
    },
    async loadSearchHistories() {
      // 因为后端帮我们存储的用户搜索历史记录太少了(只有四条)
      // 所以我们这里让后端返回的历史记录和本地的历史记录合并到一起
      // 如果用户已登录
      const searchHistories = getItem('search-histories') || []
      console.log(searchHistories)

      // 因为接口有问题。所以这里我们不获取登录用户的搜索历史记录
      /* if (this.user) {
        const { data } = await getSearchHistories()
        console.log(data)
        // 下面代码很牛逼。
        // 使用了ES6中的...展开运算符合并数组并把伪数组Set转为真正的数组。使用了ES6中的 Set 数组去重。
        searchHistories = [...new Set([...searchHistories, ...data.data.keywords])]
      } */
      this.searchHistories = searchHistories
    }
  }
}
</script>

<style lang="less" scoped>
</style>

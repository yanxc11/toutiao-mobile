<template>
  <div class="article-list">
    <!--
        List 组件通过 loading 和 finished 两个变量控制加载状态，
        当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 设置成 true，此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可。
        若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

        load 事件：
        List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
        如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。

        loading 属性：控制加载中的 loading 状态
        非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
        加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件

        finished 属性：控制加载结束的状态
        在每次请求完毕后，需要手动将 loading 设置为 false，表示本次加载结束
        所有数据加载结束，finished 为 true，此时不会触发 load 事件

     -->

    <!-- 使用 van-pull-refresh 包住 list 组件实现下拉刷新效果 -->
    <van-pull-refresh
      v-model="isRefreshLoading"
      @refresh="onRefresh"
      :success-duration="1500"
      :success-text="refreshSuccessText"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 把遍历的文章对象传递给子组件 -->
        <ArticleItem
          v-for="(article, index) in articles"
          :key="index"
          :article="article"
        />
        <!--    <van-cell
          v-for="(article, index) in articles"
          :key="index"
          :title="article.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getAritcle } from '@/api/article'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  data() {
    return {
      articles: [], // 数据列表
      loading: false, // 控制加载中的 loading
      finished: false, // 控制加载结束的状态。加载结束，不再触发加载更多
      timestamp: null, // 获取下一页数据的时间戳
      isRefreshLoading: false, // 下拉刷新的 loading 状态
      refreshSuccessText: '' // 下拉刷新成功的提示文本
    }
  },
  props: {
    // 传入的 channel 类型是对象且必传
    channel: {
      type: Object,
      require: true
    }
  },
  methods: {
    // 上拉加载更多
    async onLoad() {
      console.log('onLoad')
      // 异步更新数据
      // 1. 请求获取数据
      const { data } = await getAritcle({
        // 传递 query 的 parmas 参数

        channel_id: this.channel.id, // 频道 ID
        timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳。timestamp 相当于页面，请求最新数据使用当前最新时间错，请求下一页数据使用上一次返回的数据中的时间戳

        with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
      })

      // 2. 把数据放到 list 数组中
      // 使用 ...展开运算符把新数组合并到原来的数组中
      const { results } = data.data
      this.articles.push(...results) // 拷贝数组、数组合并

      // 3. 设置本次加载状态结束，他才可以判定是否需要加载下一次，否则就会永远停在这里
      this.loading = false

      // 4. 数据全部加载完成
      // 数据全部加载完成，不会再触发加载更多
      if (results.length) {
        // 更新获取下一页数据的页码
        this.timestamp = data.data.pre_timestamp
      } else {
        // 没有数据了，把加载状态设置结束，不再触发加载更多
        this.finished = true
      }
    },

    // 下拉刷新事件
    async onRefresh() {
      // 下拉刷新，组件自己就会展示 loading 状态
      // 异步更新数据
      // 1. 请求获取数据
      const { data } = await getAritcle({
        channel_id: this.channel.id,
        timestamp: Date.now(), // 为了大家方便学习，只要传递不同的时间戳就一定给你返回不一样的数据，而且数据不为空
        with_top: 1
      })

      // 2. 把数据放到数据列表中(往顶部追加)
      const { results } = data.data
      this.articles.unshift(...results)

      // 3. 关闭刷新的状态 loading
      this.isRefreshLoading = false

      this.refreshSuccessText = `更新了${results.length}条数据`
    }
  }
}
</script>

<style lang="less" scoped>
// 我们选择给文章列表设置固定定位
// 每个列表都有自己的滚动容器，每个滚动容器中有不同的滚动位置
.article-list {
  position: fixed;
  top: 90px;
  left: 0;
  right: 0;
  bottom: 50px;
  overflow-y: auto;
}
</style>

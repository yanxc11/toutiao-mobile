<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="app-nav-bar">
      <!-- 这个导航栏是一个组件，我们想要放一个按钮进去 -->
      <!-- 通过插槽插入进来。设置标题 -->
      <van-button
        class="search-btn"
        slot="title"
        icon="search"
        type="info"
        round
        size="small"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- 导航栏/ -->

    <!-- 文章频道列表 -->
    <!--
        标签页组件有一个功能，只有你第一次查看标签页的时候，才会渲染里面的内容。
     -->
    <van-tabs class="channel-tabs" v-model="active">
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
      >
        <!-- 文章列表 -->
        <ArticleList :channel="channel"></ArticleList>
        <!-- 文章列表 -->
      </van-tab>
    </van-tabs>
    <!-- 文章频道列表/ -->
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
export default {
  name: 'HomeIndex',
  data() {
    return {
      active: 0, // tab 标签页默认激活的标签索引。控制被激活的标签
      channels: [] // 频道列表
    }
  },
  components: {
    ArticleList
  },
  methods: {
    // 请求获取频道数据
    async loadChannels() {
      const { data } = await getUserChannels()
      console.log(data)
      this.channels = data.data.channels
    }
  },
  created() {
    this.loadChannels()
  }
}
</script>

<style lang="less" scoped>
.home-container {
  /deep/.van-nav-bar__title {
    max-width: none;
  }
  .search-btn {
    width: 277px;
    height: 32px;
    background-color: #5babfb;
    border: none;
    .van-icon {
      font-size: 16px;
    }
    .van-button__text {
      font-size: 14px;
    }
  }
  .channel-tabs {
    /deep/.van-tab {
      border-right: 1px solid #edeff3;
      border-bottom: 1px solid #edeff3;
    }
    /deep/.van-tabs__line {
      bottom: 18px;
      width: 25px !important;
      height: 3px;
      background-color: #3296fa;
    }
  }
}
</style>

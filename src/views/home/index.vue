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

      <!-- 汉堡按钮定位把列表最后的位置挡住了一部分。我们选择在这里添加一个占位元素 -->
      <div slot="nav-right" class="wap-nav-placeholder"></div>
      <div
        slot="nav-right"
        class="wap-nav-wrap"
        @click="isChannelEditShow = true"
      >
        <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <!-- 文章频道列表/ -->

    <!-- 弹出层 -->
    <!-- 弹出层默认挂载到组件所在的位置，可以通过 get-container 属性指定挂载位置。这里我们直接挂载到 body 下 -->
    <van-popup
      class="channel-edit-popup"
      closeable
      close-icon-position="top-left"
      v-model="isChannelEditShow"
      position="bottom"
      get-container="body"
      style="height: 100%"
    >
      <!-- 把弹出层封装成一个组件 -->
      <!-- 模板中 $event 表示事件参数。子组件$emit('update-active',?) 第二个参数传递的是什么，这里的$event 就是什么 -->
      <!-- 把频道列表传递给子组件 -->
      <ChannelEdit
        :user-channels="channels"
        @close="isChannelEditShow = false"
        @update-active="active = $event"
        :active="active"
      ></ChannelEdit>
      <!-- 监听对应的时间 -->
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
// 引入组件
import ArticleList from './components/article-list'
import ChannelEdit from './components/channe-edit'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage'

export default {
  name: 'HomeIndex',
  data() {
    return {
      active: 0, // tab 标签页默认激活的标签索引。控制被激活的标签
      channels: [], // 频道列表
      isChannelEditShow: true // 控制编辑频道的显示状态
    }
  },
  components: {
    ArticleList,
    ChannelEdit
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 请求获取频道数据
    async loadChannels() {
      let channels = []
      if (this.user) {
        // 已登录。请求获取线上的用户频道列表数据
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        // 没有登录。判断是否有本地存储的列表数据
        const localChannels = getItem('user-channels')

        if (localChannels) {
          // 如果本地存储中有数据则使用
          channels = localChannels
        } else {
          // 用户既没有登录也没有本地村粗的频道。请求获取默认推荐的频道列表
          // 这里发出的请求没有携带 token。后端是可以识别的。后端会返回一个默认推荐的列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }

      // 把处理好的数据放在data中以供模板使用
      this.channels = channels
      // const { data } = await getUserChannels()
      // this.channels = data.data.channels
    }

    /* onUpdateActive(index) {
    this.active = index
  } */

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

  .wap-nav-placeholder {
    flex-shrink: 0;
    // width: 33px;
    width: 25px;
  }

  .wap-nav-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    right: 0;
    width: 33px;
    height: 43px;
    background-color: #fff;
    opacity: 0.9;
    .van-icon {
      font-size: 24px;
    }
    &:before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      top: 7px;
      width: 1px;
      height: 35px;
      background: url("./line.png") no-repeat;
      background-size: contain;
    }
  }
}
</style>

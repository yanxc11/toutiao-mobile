<template>
  <div class="layout-container">
    <!-- 给二级路由添加缓存状态 -->
    <keep-alive>
      <!-- 子路由出口 start -->
      <router-view></router-view>
      <!-- 子路由出口 end -->
    </keep-alive>
    <!-- 底部导航栏 start -->
    <!-- 在 Vant 组件上加上 route属性开启路由模式。  -->
    <van-tabbar v-model="active" route>
      <!-- 给 van-tabbar-item 加上to属性，配置路径 -->
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="comment-o" to="/qa">问答</van-tabbar-item>
      <van-tabbar-item icon="video-o" to="/video">视频</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/my">我的</van-tabbar-item>
    </van-tabbar>
    <!-- 底部导航栏 end -->
  </div>
</template>

<script>
export default {
  name: 'LayoutIndex',
  data() {
    return {
      active: 0 // Vant 样式
    }
  },
  methods: {

  },
  mounted() {
    this.$store.commit('addCachePage', 'LayoutIndex')
  }
}
</script>

<style lang="scss" scoped>
</style>

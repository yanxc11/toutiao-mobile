<!-- 跟组件 -->
<template>
  <div id="app">
    <h1>新闻</h1>
    <!-- 路由的出口。根据路由规则匹配到的路由组件就渲染到这里 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
</style>

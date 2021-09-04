<!-- 跟组件 -->
<template>
  <div id="app">
    <!--
      缓存后，组件的生命周期钩子就不在触发了
      我们给跟组件/一级路由组件 加的 keep-alive ，只对一级路由组件有缓存状态
     -->
    <!-- 使用 include 来进行条件缓存 -->
    <!-- 缓存 LayoutIndex (一级路由组件的名字) 只能写被缓存的一级路由组件-->
    <keep-alive :include="cachePages">
      <!-- 路由的出口。根据路由规则匹配到的路由组件就渲染到这里 -->
      <!--
        一级路由的出口，路由表中所有的顶层路由都是一级路由
        因为 router-view 是一级路由出口
        keep-alive 仅对该路由出口渲染的组件有效
       -->
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapState(['cachePages'])
  }
}
</script>
  <!--
      组件的样式作用域
        默认是全局样式

      如果不希望当前组件中的样式影响别的组件，我们可以添加作用域 scoped

      在有作用域的组件中如何给子组件设置样式 ？
        默认只能作用到子组件的根节点
          使用子组件根节点本身的 calss 类名
          如果是第三方组件，不知道它的根节点列名，那就审查元素查看 或者 添加一个类名
          组件的 class 默认作用到组件的根节点
          建议使用我们自己的类名进行覆盖

        我们可以使用 深度作用操作符 /deep/
        有些像 Sass 之类的预处理器无法正确解析 >>>。这种情况下你可以使用 /deep/ 或 ::v-deep 操作符取而代之——两者都是 >>> 的别名，同样可以正常工作。
   -->
<style lang="less">
</style>

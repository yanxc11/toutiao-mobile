<template>
  <div class="search-suggestion">
    <!-- 我们使用 van-cell 单元格 -->
    <van-cell
      icon="search"
      v-for="(str, index) in suggestions"
      :key="index"
      @click="$emit('search', str)"
    >
      <!-- 当我们点击van-cell单元格的时候，父组件监听到的我们的点击事件，父组件接收到子组件传递过去的列表项的值，并在事件的监听回调中把searchText 的值给修改了 -->
      <!-- 使用 v-html 渲染经过处理后的str -->
      <div slot="title" v-html="highlight(str)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
// 引入 loadsh 。这里我们按需加载 debounce
import { debounce } from 'lodash'

export default {
  name: 'SearchSuggestion',
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  methods: {
    // 这里对字符串进行高亮效果处理
    highlight(str) {
      // 正则表达式 / 中间的内容/ 都会被当做正则匹配模式字符来对待
      // 错误的写法： /this.searchText/gi

      // RegExp 是正则表达式的构造函数
      // 参数1：字符串(也可以是数据变量)
      // 参数2：匹配模式 g全局 i忽略大小写
      // 返回值：正则对象
      // 通过数据变量创建出正则表达式，需要手动的new出正则表达式的构造函数
      // 把this.searchText变量的值来使用
      return str.replace(new RegExp(this.searchText, 'gi'),
        `<span style="color: red">${this.searchText}</span>`)
    }
  },
  // 使用watch来监视searchText的变化
  watch: {
    // 属性名: 要监视的数据的名称
    /* searchText() {
      console.log('searchText')
      // 我们发现初始化的时候不会执行，需要用到完整语法
    } */
    // 完整写法
    // 一旦 searchText 数据变化，里面的handle函数就会被调用
    searchText: {
      immediate: true, // 该回调将会在侦听开始的时候立即调用
      // 当searchText数据发生变化则会执行 handler 处理函数
      handler: debounce(async function () { // 做防抖处理
        console.log('searchText')
        // 找到数据接口
        // 请求获取数据
        // 模板绑定展示
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      }, 500)
      /*  async handler() {
        console.log('searchText')
        // 找到数据接口
        // 请求获取数据
        // 模板绑定展示
        const { data } = await getSearchSuggestions(this.searchText)
        this.suggestions = data.data.options
      } */
    }
  }
}
</script>

<style lang="less" scoped>
</style>

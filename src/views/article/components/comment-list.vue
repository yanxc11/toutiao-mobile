<template>
  <div class="comment-list">
    <van-cell title="全部评论"></van-cell>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <CommentItem
        v-for="(comment, index) in list"
        :key="index"
        :comment="comment"
      />
      <!-- 模板中 $event 表示事件参数 -->
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from './comment-item'
export default {
  name: 'CommentList',
  props: {
    // 如果获取文章评论，则传递文章 ID
    // 如果获取评论回复，则传递评论 ID
    source: {
      type: [Number, String, Object],
      required: true
    },

    // 获取文章评论，使用字符 a
    // 获取评论回复，使用字符 c
    type: {
      type: String,
      default: 'a'
    },

    // 评论列表组件接收父组件传递过来的 commentList
    // 评论列表添加的数据，自动就保存在了父组件的 commentList 中
    list: {
      type: Array,
      // 数组或对象的默认值必须通过函数返回
      // default: []  // 报错
      default: () => []
    }
  },
  components: {
    CommentItem
  },
  data() {
    return {
      // list: [], // 评论
      loading: false,
      finished: false,
      offset: null, // 获取下一页数据的页码
      limit: 10 //  每页大小
    }
  },
  methods: {
    async onLoad() {
      // 1. 请求获取数据
      const { data } = await getComments({ // 后端要求传递过去一个对象
        type: this.type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
        source: this.source.toString(), // 源id，文章id或评论id
        offset: this.offset, // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
        limit: this.limit // 每页大小
      })

      // 评论总数在列表子组件中。
      // 发布事件
      this.$emit('update-total-count', data.data.total_count)

      // 2. 把数据放到列表中
      const { results } = data.data
      // 这里对 list 进行操作。list 是父组件传递过来的 commentList，实际上是对父组件中数据的更改。
      // 父组件可以使用这里的数据，本组件中也可以使用这里的数据
      this.list.push(...results)

      // 3. 将本次的loading 关闭
      this.loading = false

      // 4. 判断是否还有数据
      if (results.length) {
        //    如果有，更新获取下一页数据的页码
        this.offset = data.data.last_id // 下次请求的 offset
      } else {
        //    如果没有，则将 finished 设置为 true，不再触发加载更多了
        this.finished = true
      }
    }
  }
}
</script>

<style lang="less">
</style>

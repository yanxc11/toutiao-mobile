<template>
  <div class="post-comment">
    <van-field
      v-model.trim="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <!--  我们借助 disabled 动态绑定来禁止无输入点击 -->
    <van-button
      size="mini"
      style="width: 50px"
      @click="onPost"
      :disabled="!message"
      >发布</van-button
    >
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  name: 'PostComment',
  props: {
    // 如果是发布文章评论，则传递文章 ID
    // 如果是发布评论回复，则传递评论 ID
    target: {
      type: [Number, String, Object], // 评论目标的id。可能是数字，可能会超出js安全整数范围是个对象。
      // type: Object,
      required: true
    },

    // 如果是发布评论回复，则也需要传递文章 ID
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  data() {
    return {
      message: '' // 输入框内容
    }
  },
  methods: {

    async onPost() {
      this.$toast.loading({
        message: '发布中',
        forbidClick: true // 禁止背景点击
      })
      // 找到数据接口
      // 封装请求方法
      // 请求提交数据
      const { data } = await addComment({
        // 防止数字超出js安全整数范围，我们进行toString转换
        target: this.target.toString(), // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
        content: this.message, // 评论内容
        art_id: this.articleId ? this.articleId.toString() : null// 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
      })

      // 处理响应结果
      // 触发父组件中的自定义事件
      this.$emit('post-success', data.data.new_obj)

      this.$toast.success('发布成功')

      // 发布成功，清空文本框内容
      this.message = ''
    }
  }
}
</script>

<style lang="less" scoped>
.post-comment {
  display: flex;
  align-items: center;
  padding: 14px;
}
</style>

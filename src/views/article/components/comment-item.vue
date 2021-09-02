<template>
  <van-cell class="comment-item">
    <van-image
      class="avatar"
      slot="icon"
      round
      fit="cover"
      :src="comment.aut_photo"
    />
    <div slot="title">
      <div class="title-wrap">
        <div class="name">{{ comment.aut_name }}</div>
        <div class="like-wrap" @click="onCommentLike">
          <van-icon
            class="like-icon"
            :class="{
              liked: comment.is_liking,
            }"
            :name="comment.is_liking ? 'good-job' : 'good-job-o'"
          />
          <span class="like-count">{{ comment.like_count }}</span>
        </div>
      </div>
      <div class="content">{{ comment.content }}</div>
      <div>
        <!-- 过滤器调用传参 -->
        <span class="pubdate">{{
          comment.pubdate | datetime("MM-DD HH:mm")
        }}</span>

        <!-- 全局事件总线 -->
        <van-button class="reply-btn" round size="mini" @click="replyClick"
          >{{ comment.reply_count }} 回复</van-button
        >
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, deleteCommentLike } from '@/api/comment'

export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {

    }
  },
  methods: {

    async onCommentLike() {
      // 转换成字符串
      const commentId = this.comment.com_id.toString()
      // 判断是否点赞
      if (this.comment.is_liking) {
        // 已点赞，取消点赞
        await deleteCommentLike(commentId)
        this.comment.like_count--
      } else {
        // 未点赞，添加点赞
        await addCommentLike(commentId)
        this.comment.like_count++
      }
      // 更新视图
      // 父组件传递过来的数据 数组和对象，子组件接收之后可以修改里面的value，并且会传递给父组件。
      // 如果传递过来的是字符串，直接修改会报错
      // 不推荐子组件直接修改父组件中的参数，避免这个参数多个子组件引用，无法找到造成数据不正常的原因
      /*
        官方说明: 所有的 prop 都使得其父子 prop 之间形成了一个单向下行绑定：父级 prop 的更新会向下流动到子组件中，但是反过来则不行。这样会防止从子组件意外变更父级组件的状态，从而导致你的应用的数据流向难以理解。
      */
      this.comment.is_liking = !this.comment.is_liking
    },

    // 触发全局事件总线中的 replyClick 事件。参数是 this.comment
    replyClick() {
      this.$bus.$emit('replyClick', this.comment)
    }
  }
}
</script>

<style lang="less" scoped>
.comment-item {
  .avatar {
    width: 36px;
    height: 36px;
    margin-right: 13px;
  }
  .name {
    font-size: 14px;
    color: #406599;
  }
  .content {
    font-size: 16px;
    color: #222222;
  }
  .pubdate {
    font-size: 10px;
    margin-right: 10px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
  }
  .like-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .like-icon.liked {
    color: hotpink;
  }
}
</style>

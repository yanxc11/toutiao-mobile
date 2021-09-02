<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <!-- 编程式导航跳转，后退 -->
    <van-nav-bar
      class="app-nav-bar"
      title="文章详情"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <div class="article-wrap">
      <!-- 标题 -->
      <h1 class="title">{{ article.title }}</h1>

      <!-- 作者 -->
      <van-cell center class="user-info">
        <div slot="title" class="name">{{ article.aut_name }}</div>
        <van-image
          class="avatar"
          slot="icon"
          fit="cover"
          round
          :src="article.aut_photo"
        />
        <div slot="label" class="pubdate">
          {{ article.pubdate | relativeTime }}
        </div>
        <van-button
          class="follow-btn"
          round
          size="small"
          :type="article.is_followed ? 'default' : 'info'"
          :icon="article.is_followed ? '' : 'plus'"
          @click="onFollow"
          :loading="isFollowLodaing"
          >{{ article.is_followed ? "已关注" : "关注" }}</van-button
        >
      </van-cell>
      <!-- 文章正文 -->
      <div
        class="markdown-body"
        v-html="article.content"
        ref="article-content"
      ></div>

      <!-- 文章评论列表 -->
      <!-- 给子组件传递过去文章的id -->
      <!-- 监听自定义事件。把监听到的事件传递过来的值赋值给当前组件的data中 -->
      <comment-list
        :source="articleId"
        :list="commentList"
        @update-total-count="totalCommentCount = $event"
      />
      <!--  -->

      <!-- /文章评论列表 -->
    </div>

    <!-- 底部区域 -->
    <div class="article-bottom">
      <van-button
        class="comment-btn"
        type="default"
        round
        size="small"
        @click="isPostShow = true"
        >写评论</van-button
      >
      <van-icon
        name="comment-o"
        color="#777"
        :badge="totalCommentCount"
      ></van-icon>
      <!-- 判断是否收藏 -->
      <van-icon
        :name="article.is_collected ? 'star' : 'star-o'"
        :color="article.is_collected ? 'orange' : '#777'"
        @click="onCollect"
      ></van-icon>
      <van-icon
        :name="article.attitude === 1 ? 'good-job' : 'good-job-o'"
        :color="article.attitude === 1 ? 'hotpink' : '#777'"
        @click="onLike"
      ></van-icon>
      <van-icon name="share" color="#777777"></van-icon>
    </div>
    <!-- /底部区域 -->

    <!-- 发布评论 -->
    <!-- 这里监听了评论发布成功的事件，定义onPostSuccess函数来进行逻辑处理 -->
    <van-popup v-model="isPostShow" position="bottom">
      <PostComment
        :target="articleId"
        @post-success="onPostSuccess"
      ></PostComment>
    </van-popup>
    <!-- /发布评论 -->

    <!-- 评论回复 -->
    <van-popup v-model="isReplyShow" position="bottom">
      <!-- 这里使用 v-if 的目的是让组件随着弹出层的显示进行渲染和销毁，防止加载过的组件不重新渲染导致数据不会重新加载的问题 -->
      <CommentReply
        v-if="isReplyShow"
        :comment="replyComment"
        :article-id="articleId"
        @close="isReplyShow = false"
      ></CommentReply>
    </van-popup>
    <!-- /评论回复 -->
  </div>
</template>

<script>
import './github-markdown.css'
import { getArticleById } from '@/api/article'
// 我们想要实现点击图片预览效果，必须使用vant中的 ImagePreview 图片预览 组件
// ImagePreview 必须单独加载
// 这里我们使用函数调用
import { ImagePreview } from 'vant'
import { addFollow, deleteFollow, addCollect, deleteCollect, deleteLike, addLike } from '@/api/user'
import CommentList from './components/comment-list'
import PostComment from './components/post-comment'
import CommentReply from './components/comment-reply'

// 参数可以放一个数组，数组的每一项是图片的地址。ImagePreview 一旦调用，页面中就会显示图片
// ImagePreview([
//   'https://img01.yzcdn.cn/vant/apple-1.jpg',
//   'https://img01.yzcdn.cn/vant/apple-2.jpg'
// ])
// 对象方式
// ImagePreview({
//   images: [
//     'https://img01.yzcdn.cn/vant/apple-1.jpg',
//     'https://img01.yzcdn.cn/vant/apple-2.jpg'
//   ],
//   startPosition: 1 // 起始位置。对应 images 数组的下标
// })

export default {
  name: 'ArticleIndex',
  // 在组件中获取动态路由参数：
  //    方式一: this.$route.params.xxx
  //    方式二: props 传参，推荐
  //        this.articleId
  // 声明接收动态路由传递过来的参数
  components: {
    CommentList,
    PostComment,
    CommentReply
  },
  props: {
    articleId: {
      // 传递过来的 articleId 是多类型。我们这里使用数组
      type: [String, Number, Object],
      required: true
    }
  },
  data() {
    return {
      article: {}, // 文章数据对象
      isFollowLodaing: false, // 关注用户按钮的 loading 状态。我们使用loading 来替代 防抖节流
      isCollectLodaing: false, // 收藏的 loading 状态
      isPostShow: false, // 控制发布评论的显示状态
      // 为了拿到子组件的数据，在当前组件中声明 commentList 来控制子组件的评论列表数据，传递给评论列表组件
      commentList: [], // 文章评论列表
      totalCommentCount: 0, // 评论总数
      isReplyShow: false, // 控制评论回复的显示状态
      replyComment: {} // 当前回复评论对象
    }
  },
  created() {
    this.loadArticle()
  },
  methods: {
    async loadArticle() {
      const { data } = await getArticleById(this.articleId)
      this.article = data.data

      // 数据改变影响视图更新(DOM数据)不是立即的
      // 所以如果需要在修改数据之后马上操作被该数据影响的视图 DOM，需要把这个代码放到 this.$nextTick() 中
      // this.$nextTick 是 Vue 中提供的一个方法
      // 参考文档：https://cn.vuejs.org/v2/api/#vm-nextTick
      this.$nextTick(() => {
        this.handleperViewImage()
      })
    },

    // 在该方法中进行 原生dom逻辑处理
    handleperViewImage() {
      // 1. 获取文章内容 DOM 容器
      const articleContent = this.$refs['article-content']

      // 2. 得到所有的 img 标签
      const imgs = articleContent.querySelectorAll('img')

      const imgPaths = [] // 收集所有的图片路径

      // 3. 循环 img 列表，给 img 注册点击事件
      imgs.forEach((img, index) => {
        // 通过img.src获取到img的路径并追加到数组imgPaths中
        imgPaths.push(img.src)
        img.onclick = function () {
          // 4. 在事件处理函数中调用 ImagePreview() 预览
          ImagePreview({
            images: imgPaths, // 预览图片路径列表
            startPosition: index // 起始位置
          })
        }
      })
    },

    async onFollow() {
      this.isFollowLodaing = true
      // 已关注，则取消关注
      if (this.article.is_followed) {
        await deleteFollow(this.article.aut_id)
      } else {
        // 未关注，添加关注
        await addFollow(this.article.aut_id)
      }
      // 更新视图
      this.article.is_followed = !this.article.is_followed
      this.isFollowLodaing = false
    },

    async onCollect() {
      this.$toast.loading({
        message: '收藏中',
        forbidClick: true // 禁止背景点击
      })
      // 已收藏，取消收藏
      if (this.article.is_collected) {
        await deleteCollect(this.article.art_id) // 传入收藏的文章id
      } else {
        // 未收藏，添加收藏
        await addCollect(this.article.art_id)
      }
      // 更新视图
      this.article.is_collected = !this.article.is_collected
      // 使用 toast 轻提示
      this.$toast.success(`${this.article.is_collected ? '收藏成功' : '取消收藏'}`)
    },

    async onLike() {
      this.$toast.loading({
        message: '点赞中',
        forbidClick: true // 禁止背景点击
      })
      // 已点赞，取消点赞
      if (this.article.attitude === 1) {
        await deleteLike(this.articleId) // 传入收藏的文章id
        this.article.attitude = -1
      } else {
        // 未点赞，对文章点赞
        await addLike(this.articleId)
        this.article.attitude = 1
      }
      // 使用 toast 轻提示
      this.$toast.success(`${this.article.attitude === 1 ? '点赞成功' : '取消点赞'}`)
    },

    // 评论发布成功
    onPostSuccess(comment) {
      // 把发布成功的评论数据对象放到评论列表顶部
      this.commentList.unshift(comment)

      // 更新评论总数
      this.totalCommentCount++

      // 关闭发布评论的弹出层
      this.isPostShow = false
    },

    // 点击回复
    onReplyClick(comment) {
      console.log('onReplyClick', comment)
      // 把评论所在的评论对象保存起来，传递给子组件
      this.replyComment = comment

      // 展示回复内容
      this.isReplyShow = true
    }
  },

  // 组件挂载完毕后添加全局事件总线自定义事件
  mounted() {
    // 第一个参数是事件名，第二个参数是事件函数
    this.$bus.$on('replyClick', this.onReplyClick)
  },

  // 销毁自定义事件
  beforeDestroy() {
    this.$bus.$off('replyClick')
  }
}
</script>

<style lang="less" scoped>
.article-wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
}
.title {
  font-size: 20px;
  color: #3a3a3a;
  padding: 14px;
  background-color: #fff;
  margin: 0;
}

.user-info {
  .avatar {
    width: 35px;
    height: 35px;
    margin-right: 8px;
  }
  .name {
    font-size: 11px;
    color: #333333;
  }
  .pubdate {
    font-size: 11px;
    color: #b4b4b4;
  }
  .follow-btn {
    width: 85px;
    height: 29px;
  }
}

ul {
  list-style: unset;
}

.markdown-body {
  padding: 14px;
  background-color: #fff;
}

// 底部区域
.article-bottom {
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 44px;
  box-sizing: border-box;
  border-top: 1px solid #d8d8d8;
  background-color: #fff;
  .comment-btn {
    width: 141px;
    height: 23px;
    text-align: left;
    border: 1px solid #eeeeee;
    font-size: 15px;
    line-height: 23px;
    color: #a7a7a7;
  }
  .van-icon {
    font-size: 20px;
    .van-info {
      font-size: 11px;
      background-color: #e22829;
    }
  }
}
</style>

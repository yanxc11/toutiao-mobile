<template>
  <!-- <div class="article-item">文章列表项</div> -->
  <van-cell
    class="article-item"
    :to="{
      name: 'article',
      params: {
        articleId: article.art_id,
      },
    }"
  >
    <div slot="title" class="title van-multi-ellipsis--l3">
      {{ article.title }}
      <!-- 这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容这是标题内容 -->
    </div>
    <div slot="label">
      <div class="cover-wrap" v-if="article.cover.type === 3">
        <div
          class="cover-wrap-item"
          v-for="(img, index) in article.cover.images"
          :key="index"
        >
          <van-image class="cover-item" fit="cover" :src="img" />
        </div>
      </div>
      <div class="label-wrap">
        <span>{{ article.aut_name }}</span>
        <span>{{ article.comm_count }}评论</span>
        <span>{{ article.pubdate | relativeTime }}</span>
      </div>
    </div>
    <!-- 默认插槽的名字叫 default 可以省略 -->
    <van-image
      v-if="article.cover.type === 1"
      class="right-cover"
      fit="cover"
      :src="article.cover.images[0]"
    />
  </van-cell>
</template>

<script>
export default {
  name: 'ArticleItem',
  // 子组件声明接收父组件传递过来的文章对象
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {

    }
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.article-item {
  .title {
    font-size: 16px;
    color: #3a3a3a;
  }
  /deep/ .van-cell__value {
    flex: unset;
    width: 116px;
    height: 73px;
    margin-left: 12px;
  }
  .right-cover {
    width: 116px;
    height: 73px;
  }

  .cover-wrap {
    padding: 15px 0;
    display: flex;
    .cover-wrap-item {
      flex: 1;
      height: 73px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .cover-item {
        width: 100%;
        height: 73px;
      }
    }
  }

  .label-wrap {
    font-size: 11px;
    color: #b4b4b4;
    span {
      margin-right: 12px;
    }
  }
}
</style>

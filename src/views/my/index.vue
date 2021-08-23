<template>
  <div class="my-container">
    <div class="user-info">
      <van-cell-group v-if="user" class="my-info">
        <van-cell class="base-info" center :border="false">
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="currentUser.photo"
          />
          <div class="name" slot="title">{{ currentUser.name }}</div>
          <van-button class="update-btn" size="small" round
            >编辑资料</van-button
          >
        </van-cell>
        <van-grid class="data-info" :border="false">
          <van-grid-item class="data-info-item">
            <div class="text-wrap" slot="text">
              <div class="count">{{ currentUser.art_count }}</div>
              <div class="text">头条</div>
            </div>
          </van-grid-item>
          <van-grid-item class="data-info-item">
            <div class="text-wrap" slot="text">
              <div class="count">{{ currentUser.follow_count }}</div>
              <div class="text">关注</div>
            </div>
          </van-grid-item>
          <van-grid-item class="data-info-item">
            <div class="text-wrap" slot="text">
              <div class="count">{{ currentUser.fans_count }}</div>
              <div class="text">粉丝</div>
            </div>
          </van-grid-item>
          <van-grid-item class="data-info-item">
            <div class="text-wrap" slot="text">
              <div class="count">{{ currentUser.like_count }}</div>
              <div class="text">获赞</div>
            </div>
          </van-grid-item>
        </van-grid>
      </van-cell-group>

      <div class="not-login" v-else>
        <div @click="$router.push('/login')">
          <img class="mobile" src="./shouji.png" alt="" />
        </div>
        <div class="text">登录 / 注册</div>
      </div>

      <van-grid class="nav-grid mb-4" :column-num="2">
        <van-grid-item
          class="nav-grid-item"
          icon-prefix="toutiao"
          icon="shoucang"
          text="收藏"
        />
        <van-grid-item
          class="nav-grid-item"
          icon-prefix="toutiao"
          icon="lishi"
          text="历史"
        />
      </van-grid>

      <van-cell title="消息通知" is-link to="/" />
      <van-cell class="mb-4" title="小智同学" is-link to="/" />

      <van-cell
        class="logoout-cell"
        title="退出登录"
        center
        v-if="user"
        @click="onLogout"
      />
    </div>
  </div>
</template>

<script>
// 引入
import { mapState } from 'vuex'
import { getCurrentUser } from '@/api/user'

export default {
  name: 'MyIndex',
  data() {
    return {
      currentUser: {} // 当前登录用户的信息
    }
  },
  methods: {
    onLogout() {
      // 提示用户确认退出
      // 确认 => 处理退出
      this.$dialog.confirm({
        title: '退出提示',
        message: '确认退出吗？',
        confirmButtonColor: '#418bd6'
      })
        .then(() => { // 确认执行这里
          // 清除用户登录状态
          this.$store.commit('setUser', null)
          // 因为视图是响应式的，所以这里我们把登录状态清空，会影响页面的变化
        })
        .catch(() => { // 退出执行这里
          // on cancel
        })
    },
    async loadCurrentUser() {
      const { data } = await getCurrentUser()
      console.log(data)
      this.currentUser = data.data
    }
  },
  computed: {
    // 把 vuex 中的数据映射到本地组件当中
    ...mapState(['user'])
  },
  created() {
    // 初始化的时候获取数据
    this.loadCurrentUser()
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .my-info {
    background: url("./banner.png") no-repeat;
    background-size: cover;
    // 发现背景图不会渲染出来，因为子元素有背景图或背景色
    .base-info {
      box-sizing: border-box;
      height: 115px;
      background-color: unset; // unset 重置背景色
      padding-top: 38px;
      padding-bottom: 11px;
      // 头像
      .avatar {
        box-sizing: border-box;
        width: 66px;
        height: 66px;
        border: 1px solid #fff;
        margin-right: 11px;
      }
      .name {
        font-size: 15px;
        color: #fff;
      }
      .update-btn {
        // 不建议，也没有必要设置宽。由内容撑开就可以了
        // width: 58px;
        height: 16px;
        font-size: 10px;
        color: #666666;
      }
    }
    .data-info {
      .data-info-item {
        height: 65px;
        color: #fff;
        .text-wrap {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .count {
            font-size: 18px;
          }
          .text {
            font-size: 11px;
          }
        }
      }
    }

    /deep/ .van-grid-item__content {
      background-color: unset; // unset 重置背景色
    }
  }

  .not-login {
    height: 180px;
    background: url("./banner.png") no-repeat;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .mobile {
      width: 66px;
      height: 66px;
    }
    .text {
      font-size: 14px;
      color: #fff;
    }
  }

  /deep/.nav-grid {
    .nav-grid-item {
      height: 70px;
      .toutiao {
        font-size: 22px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      .van-grid-item__text {
        font-size: 14px;
        color: #333333;
      }
    }
  }

  .logoout-cell {
    text-align: center;
    color: #d86262;
  }
  .mb-4 {
    margin-bottom: 4px;
  }
}
</style>

<template>
  <div class="channel-edit">
    <!-- van-cell 单元格 -->
    <van-cell center :border="false">
      <div slot="title" class="channel-title">我的频道</div>
      <van-button
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>

    <!--
        :class="{ active: index === active }" 动态样式绑定
        active 是类名。：后面的是条件。Vue会根据条件来选择是否作用这个类名
        如果条件判定为 true。则作用类名
        active 这个class存在与否取决于 index === active
     -->
    <!-- 频道编辑 -->
    <van-grid :gutter="10">
      <!-- 如果是编辑状态且index不为0展示icon图标 -->
      <!-- 遍历渲染从父组件传递过来的数据 -->
      <van-grid-item
        :class="{ active: index === active }"
        v-for="(channel, index) in userChannels"
        :icon="isEdit && index !== 0 ? 'clear' : ''"
        :key="index"
        :text="channel.name"
        @click="onUserChannelClick(channel, index)"
      />
    </van-grid>

    <!-- van-cell 单元格 -->
    <van-cell center :border="false">
      <div slot="title" class="channel-title">频道推荐</div>
    </van-cell>

    <!-- 所有频道 -->
    <van-grid :gutter="10">
      <van-grid-item
        v-for="(channel, index) in recommendChannels"
        :key="index"
        :text="channel.name"
        @click="onAdd(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage'

export default {
  name: 'ChannelEdit',
  props: {
    // 声明接收父组件(首页)传递过来的频道列表
    userChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      require: true
    }
  },
  data() {
    return {
      allChannels: [], // 所有频道数据列表
      isEdit: false // 控制编辑的显示状态
    }
  },
  // 基于已有的数据衍生出来一些新的数据，需要逻辑运算，我们一般放在计算属性中
  computed: {
    // 将 vuex 中的用户映射到本地
    ...mapState(['user']),

    // 推荐的频道列表实现
    // 计算属性会观测内部依赖数据的变化而重新求值
    recommendChannels() { // 依赖项是 allChannels 和 userChannels
      // 思路所有频道 - 我的频道 = 剩下的推荐频道
      // 数组方法
      // 1. filter 方法：过滤数组。根据方法返回的布尔值 true 来收集数据
      /* return this.allChannels.filter(channel => { // filter 返回数组
        // 判断 channel 是否属于用户频道
        return !this.userChannels.find(userChannel => { // 返回满足条件的元素
          // 找到满足该条件的元素并返回
          return userChannel.id === channel.id
        })
      }) */
      // 1.1 极简版
      return this.allChannels.filter(channel => !this.userChannels.find(userChannel => userChannel.id === channel.id))

      // 2. for 循环版
      /* const arr = []
      // 遍历所有频道
      this.allChannels.forEach(channel => {
        let flag = false
        // forEach() 一旦开启就没办法终止
        for (let i = 0; i < this.userChannels.length; i++) {
          if (this.userChannels[i].id === channel.id) {
            // 所有频道中的频道向属于用户频道
            flag = true
            break
          }
        }
        if (!flag) {
          arr.push(channel)
        }
      })
      return arr */
    }

  },
  created() {
    this.loadAllChannels()
  },
  methods: {
    async loadAllChannels() {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },

    async onAdd(channel) {
      // 我们发现 点击后的频道从所有频道中消失 出现在了我的频道
      // 因为我们写了计算属性。计算属性依赖于所有频道和我的频道。频道发生改变，计算属性重新求职运算
      this.userChannels.push(channel) // 将所有频道中用户点击的频道放入用户频道中

      // TODO：数据持久化
      if (this.user) { // 判断是否登录
        // 登录了：数据存储到线上
        await addUserChannel({
          // 后端要求传入的名称、类型
          channels: [
            { id: channel.id, seq: this.userChannels.length }
          ]
        })
      } else {
        // 没有登录：数据存储到本地
        console.log('本地')
        // 我们直接使用封装的storage方法，设置 localStorage
        setItem('user-channels', this.userChannels)
      }
    },

    onUserChannelClick(channel, index) {
      // 是编辑状态且索引不为0
      if (this.isEdit && index !== 0) {
        // 编辑状态 删除频道
        this.deleteChannel(channel, index)
      } else {
        this.switchChannel(index)
        // 非编辑状态，切换频道
      }
    },

    // 删除频道
    async deleteChannel(channel, index) {
      // 如果删除的是当前激活频道之前的频道
      if (index <= this.active) { // index 删除频道的索引。this.active 激活频道的索引
        // 更新激活频道的索引
        this.$emit('update-active', this.active - 1) // 让激活频道的索引 -1
      }
      // 删除数组中的元素，从 index 开始
      this.userChannels.splice(index, 1)

      // 数据持久化
      if (this.user) { // 判断是否登录
        // 登录了，持久化到线上
        await deleteUserChannel(channel.id) // 传入要删除的频道id
      } else {
        // 没有登录，持久化到本地
        setItem('user-channels', this.userChannels)
      }
    },

    switchChannel(index) {
      // 切换频道
      this.$emit('update-active', index) // 更新激活频道的索引

      // 关闭弹出层
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding-top: 54px;

  .channel-title {
    font-size: 16px;
    color: #333333;
  }

  .van-grid-item {
    width: 80px;
    height: 43px;
    /deep/.van-grid-item__content {
      background-color: #f4f5f6;
      .van-grid-item__text {
        font-size: 14px;
        color: #222;
        margin-top: 0;
      }
    }
    /deep/.van-grid-item__icon {
      right: -5px;
      position: absolute;
      top: -5px;
      font-size: 20px;
      color: #ccc;
    }
  }

  .active {
    /deep/.van-grid-item__text {
      color: red !important;
    }
  }
}
</style>

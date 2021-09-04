<template>
  <div class="user-chat">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="小智同学"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->

    <!-- 消息列表 -->
    <van-cell-group class="message-list">
      <van-cell title="单元格" />
    </van-cell-group>
    <!-- /消息列表 -->

    <!-- 发送消息 -->
    <van-cell-group class="send-message-wrap">
      <van-field v-model="message" placeholder="请输入消息" :border="false" />
      <van-button class="btn" size="small" type="primary" @click="onSend"
        >发送</van-button
      >
    </van-cell-group>
    <!-- /发送消息 -->
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  name: 'UserChat',
  data() {
    return {
      message: '',
      socket: null, // WebSocket 通信对象
      messages: []
    }
  },
  methods: {
    onSend() {
      // 请求发送消息
      this.socket.emit('message', {
        msg: this.message,
        timestamp: Date.now()
      })
    }
  },
  created() {
    // 建立连接
    const socket = io('http://ttapi.research.itcast.cn')

    this.socket = socket

    socket.on('connect', function () {
      console.log('连接建立成功了')
    })

    socket.on('disconnect', function () {
      console.log('断开连接了')
    })

    // 监听 message 事件，接收服务端消息
    socket.on('message', function (data) {
      console.log(data)
    })

    // 发送消息
    // socket.emit('消息类型',消息内容)
    // socket.on('消息类型',function(data) { data消息 })
  }
}
</script>

<style lang="less" scoped>
.message-list {
  position: fixed;
  left: 0;
  right: 0;
  top: 46px;
  bottom: 44px;
  overflow-y: auto;
}
.send-message-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  padding: 0 14px;
}
.btn {
  width: 50px;
}
</style>

<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="修改昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <!-- /导航栏 -->

    <!-- 输入框 -->
    <div class="name-field-wrap">
      <van-field
        v-model="localName"
        rows="1"
        autosize
        type="textarea"
        maxlength="7"
        show-word-limit
      />
    </div>
    <!-- /输入框 -->

    <!-- 这里触发的自定义事件 update:gender 其中 update是固定的，gender 是使用了 .sync 的数据名 -->
    <!-- <button @click="$emit('update:gender', 0)">修改 gender</button> -->
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateName',
  props: {
    // 声明接收父组件 v-model 传递的 value 数据
    value: {
      type: String,
      required: true
    }
    // gender: {
    //   type: Number,
    //   required: true
    // }
  },
  data() {
    return {
      localName: this.value
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true // 禁止背景点击
      })
      try {
        // 请求提交更新用户昵称
        await updateUserProfile({
          name: this.localName
        })

        // 更新成功 => 修改父组件的 name => 关闭弹出层
        // this.$emit('update-name', this.localName)
        // 发布 input 事件，更新父组件 v-model 绑定的数据
        this.$emit('input', this.localName)
        this.$emit('close')

        this.$toast.success('保存成功')
      } catch (err) {
        if (err && err.response && err.response.status === 409) {
          this.$toast.fail('昵称已经存在')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.name-field-wrap {
  padding: 10px;
}
</style>

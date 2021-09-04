<template>
  <div class="update-gender">
    <van-picker
      show-toolbar
      :columns="columns"
      :default-index="defaultIndex"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      @change="onGenderChange"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  name: 'UpdateGender',
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      columns: ['男', '女'],
      defaultIndex: this.value // 初始值。注意这里的默认值要和 数组中的男女对应
    }
  },
  methods: {
    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true // 禁止背景点击
      })

      // 请求提交更新用户性别
      await updateUserProfile({
        gender: this.defaultIndex
      })

      this.$emit('input', this.defaultIndex)
      this.$emit('close')

      this.$toast.success('保存成功')
    },

    onGenderChange(picker, value, index) {
      this.defaultIndex = index
    }
  }
}
</script>

<style lang="less" scoped>
</style>

<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @confirm="onConfirm"
      @cancel="$emit('close')"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'

export default {
  name: 'UpdateBirthday',
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },

  data() {
    return {
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(),
      // 当前时间 传入的是父组件传递过来的时间
      currentDate: new Date(this.value)
    }
  },
  methods: {

    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true // 禁止背景点击
      })

      // 处理时间格式
      // const date = `${this.currentDate.getFullYear()}-${this.currentDate.getMonth() + 1}-${this.currentDate.getDate()}`
      //  使用第三方包 dayjs 来格式化年月日
      const date = dayjs(this.currentDate).format('YYYY-MM-DD')

      console.log(date)
      // 请求提交更新用户生日
      await updateUserProfile({
        birthday: date
      })

      // 更新父组件中的用户生日
      this.$emit('input', date)
      // 更新成功关闭弹出层
      this.$emit('close')

      this.$toast.success('保存成功')
    }
  }
}
</script>

<style lang="less" scoped>
</style>

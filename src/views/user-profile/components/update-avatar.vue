<template>
  <div class="UpdateAvatar">
    <img class="image" :src="image" alt="头像" ref="image" />
    <van-nav-bar
      class="toolbar"
      left-text="取消"
      right-text="确认"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    ></van-nav-bar>
  </div>
</template>

<script>

import { updateUserAvatar } from '@/api/user'
// 对图像裁切的引用
// 加载样式，加载js
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

export default {
  name: 'UpdateAvatar',
  props: {
    file: {
      required: true
    }
  },
  data() {
    return {
      image: window.URL.createObjectURL(this.file), // 转换成 blob 数据
      cropper: null // 裁切器实例
    }
  },
  methods: {
    getCroppedCanvas() {
      // 我们把它包装成为 Promise方便后续使用
      return new Promise(resolve => {
        // toBlob 不支持 promise
        this.cropper.getCroppedCanvas().toBlob((file) => {
          resolve(file) // 裁切之后的文件对象 file
        }
        )
      })
    },

    async onConfirm() {
      this.$toast.loading({
        message: '保存中',
        forbidClick: true,
        duration: 0 // 展示事件，0 表示持续展示
      })

      const file = await this.getCroppedCanvas()
      const fd = new FormData()
      fd.append('photo', file)

      //  如果要求而 Content-Type是 multipart/form-data ，则一定要提交 FromData 数据对象，专门用于文件上传的，不能提交 {}，没用
      // const fd = new FormData()
      // fd.append('photo', this.file)
      await updateUserAvatar(fd)

      // 更新父组件中的用户头像
      this.$emit('update-avatar', window.URL.createObjectURL(file)) // 更改为 裁切之后的头像

      // 关闭弹出层
      this.$emit('close')

      this.$toast.success('保存成功')
    }
  },
  // 在 mounted 组件渲染完毕后进行初始化
  mounted() {
    // 获取需要裁切的图片 DOM
    const image = this.$refs.image

    // new 出裁切的实例
    this.cropper = new Cropper(image, {
      // 配置裁切的选项
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      cropBoxMovable: false,
      cropBoxResizable: false,
      background: false,
      movable: true
    })

    console.log(this.cropper)
  }
}
</script>

<style lang="less" scoped>
.toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #000;
}

.img {
  display: block;
  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>

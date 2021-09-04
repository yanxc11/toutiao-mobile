<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="app-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 单元格 -->
    <!-- accept="image/png" 只接受 image.png 格式的图片 -->
    <input
      type="file"
      hidden
      ref="file"
      accept="image/*"
      @change="onFileChange"
    />
    <!-- center 垂直居中   -->
    <van-cell title="头像" is-link center @click="$refs.file.click()">
      <!-- fit="cover" 整个覆盖到图片当中 -->
      <van-image width="30" height="30" round fit="cover" :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      is-link
      :value="user.name"
      @click="isEditNameShow = true"
    />
    <van-cell
      title="性别"
      is-link
      :value="user.gender === 0 ? '男' : '女'"
      @click="isEditGenderShow = true"
    />
    <van-cell
      title="生日"
      is-link
      :value="user.birthday"
      @click="isEditBirthdayShow = true"
    />
    <!-- /单元格 -->

    <!-- 修改昵称弹出层 -->
    <van-popup
      v-model="isEditNameShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!--
        当我们传递给子组件的数据，既要使用又要修改，例如这里的name
        这种情况下我们可以使用 v-model 简写
       -->
      <!--
        :name="user.name"
        @update-name="user.name = $event"
       -->

      <!--
          v-model="user.name"
            默认传递一个名字叫 value 的数据
            :value="user.name"  // 默认名字叫 value
            默认监听 input 事件
            @input="user.name = $event"   // 默认监听 input 事件
          v-model 的本质还是父子组件通信，它仅仅是简化了父组件的使用
        -->
      <!--
          v-model 只能使用一次
          如果有多个数据需要保持同步，使用 .sync 修饰符
          v-model="user.name"
          :gender="user.gender"
       -->
      <!--
        .sync 属性绑定的 .sync 修饰符。就可以实现类似 v-model 的效果(.sync 帮我们自动监听了事件，把数据赋值为事件参数)。可以有任意个
            :gender = "user.gender"
            @update:gender = "user.gender = $event"   // 因为加了 .sync 修饰符 ，默认监听 update:gender 事件
              :gender.sync="user.gender"

        我们一般把最常用的数据设计为 v-model 绑定，把不太常用的数据设计为 .sync
        参考文档：https://cn.vuejs.org/v2/guide/components-custom-events.html#sync-%E4%BF%AE%E9%A5%B0%E7%AC%A6
         -->
      <UpdateName
        v-if="isEditNameShow"
        @close="isEditNameShow = false"
        v-model="user.name"
      ></UpdateName>
    </van-popup>

    <!-- 修改性别弹出层 -->
    <van-popup v-model="isEditGenderShow" position="bottom">
      <UpdateGender
        v-model="user.gender"
        @close="isEditGenderShow = false"
      ></UpdateGender>
    </van-popup>
    <!-- /修改性别弹出层 -->

    <!-- 修改生日弹出层 -->
    <van-popup v-model="isEditBirthdayShow" position="bottom">
      <!-- 直接使用 v-model 向子组件传递数据 -->
      <UpdateBirthday
        v-model="user.birthday"
        @close="isEditBirthdayShow = false"
        v-if="isEditBirthdayShow"
      ></UpdateBirthday>
    </van-popup>
    <!-- /修改生日弹出层 -->

    <!-- 修改头像 -->
    <van-popup
      class="update-avatar-popup"
      v-model="isEditAvatarShow"
      position="bottom"
      style="height: 100%"
    >
      <UpdateAvatar
        v-if="isEditAvatarShow"
        :file="previewImage"
        @close="isEditAvatarShow = false"
        @update-avatar="user.photo = $event"
      ></UpdateAvatar>
    </van-popup>
    <!-- /修改头像 -->
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdateBirthday from './components/update-birthday'
import UpdateAvatar from './components/update-avatar'

export default {
  name: 'UserProfile',
  data() {
    return {
      user: {}, // 用户数据
      isEditNameShow: false, // 编辑昵称的显示状态
      isEditGenderShow: false, // 编辑性别的显示状态
      isEditBirthdayShow: false, // 编辑生日的显示状态
      isEditAvatarShow: false, // 编辑头像的显示状态
      previewImage: null // 上传预览图片
    }
  },
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdateAvatar
  },
  created() {
    //
    this.loadUserProfile()
  },
  methods: {

    async loadUserProfile() {
      // 找到接口发送请求
      const { data } = await getUserProfile()
      // 拿到数据存储到data
      this.user = data.data
      // 模板渲染
    },
    onFileChange() {
      // 在弹出层中预览图片
      // 把选定的图片传递给子组件
      // window.URL.createObjectURL() 参数是文件对象
      // console.log(this.$refs.file.files[0])
      // const blob = window.URL.createObjectURL(this.$refs.file.files[0])
      const file = this.$refs.file.files[0]
      // 得到 blob 数据传递给子组件。子组件设置为 src
      this.previewImage = file

      // 展示弹出层
      this.isEditAvatarShow = true

      // 为了解决相同文件(图片)不触发 change 事件的问题，所以在这里手动清空 file 的 value
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.van-popup {
  background-color: #f5f7f9;
}

.update-avatar-popup {
  background-color: #000;
}
</style>

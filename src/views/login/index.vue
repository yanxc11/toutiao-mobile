<template>
  <div class="login-container">
    <!-- 编程式导航跳转，后退 -->
    <van-nav-bar
      class="app-nav-bar"
      title="登录"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 登录表单 -->
    <!--
        基于 Vant 的表单验证
          1. 使用 van-from 组件包裹所有的表单项 van-field
          2. 给 van-form 绑定 submit 事件
              当表单提交的时候会触发 submit 事件
              提示： 只有表单验证通过，它才会调用 submit
          3. 使用 Field 的 rules 属性定义校验规则。
     -->
    <van-form
      :show-error-message="false"
      :show-error="false"
      validate-first
      ref="login-form"
      @submit="onLogin"
      @failed="onFailed"
    >
      <van-field
        name="mobile"
        v-model="user.mobile"
        icon-prefix="toutiao"
        left-icon="shouji"
        center
        placeholder="请输入手机号"
        :rules="formRules.mobile"
      />
      <van-field
        name="code"
        v-model="user.code"
        clearable
        icon-prefix="toutiao"
        left-icon="yanzhengma"
        center
        placeholder="请输入验证码"
        :rules="formRules.code"
      >
        <template #button>
          <van-count-down
            style="height: 25px"
            :time="1000 * 60"
            format="ss s"
            v-if="isCountDownShow"
            @finish="isCountDownShow = false"
          />
          <van-button
            class="send-btn"
            size="small"
            round
            @click.prevent="onSendSms"
            v-else
            :loading="isSendSmsLoading"
          >
            <!-- 使用prevent修饰符阻止验证码按钮的默认提交表单行为 -->
            获取验证码
          </van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" type="info" block> 登录 </van-button>
      </div>
    </van-form>

    <!-- 登录表单end -->
  </div>
</template>

<script>
// 引入登录接口
import { login, sendSms } from '@/api/user'
// 引入 Toast 组件(轻提示)  吐司。引入 Toast 组件后会自动在Vue的prototype上挂载$toast方法，便于在组件内调用
// import { Toast } from 'vant'
export default {
  name: 'LoginIndex',
  data() {
    return {
      user: {
        mobile: '', // 手机号
        code: '' // 验证码
      },
      formRules: {
        // 配置手机号、验证码正则
        mobile: [
          { required: true, message: '请输入手机号' },
          { pattern: /0?(13|14|15|17|18|19)[0-9]{9}/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '请输入验证码' },
          { pattern: /^\d{6}/, message: '验证码格式错误' }
        ]
      },
      isCountDownShow: false, // 控制倒计时和验证码显示状态
      isSendSmsLoading: false // 发送验证码按钮的 loading 状态
    }
  },
  methods: {
    async onLogin() {
      // Toast.loading({
      this.$toast.loading({
        message: '加载中...', // 提示文本
        forbidClick: true, // 禁止背景点击
        duration: 0 // 展示时长(ms)，值为 0 时，toast 不会消失

      })
      /*
          1. 找到数据接口
          2. 封装请求方法
          3. 请求调用登录
          4. 处理响应结果
      */
      try {
        const { data } = await login(this.user)
        this.$toast.success('登录成功')

        // 将后端返回的用户登录状态(token等数据)放到 Vuex 容器中
        this.$store.commit('setUser', data.data)

        // 在登录成功之前，清除 layout 的缓存，让它重新渲染
        this.$store.commit('removeCachePage', 'LayoutIndex')

        // 登录成功，跳转回原来页面
        // 先使用这种方式，但是这种方式有缺点
        // this.$router.back()
        // 我们使用这种方式
        this.$router.push(this.$route.query.redirect || '/') // 从 a 页面跳转到登录页面，登录成功后跳转到 a 页面
      } catch (err) {
        console.log(err)
        this.$toast.fail('登录失败')
      }
    },
    // 验证失败的回调
    onFailed(error) { // err 错误信息
      console.log('验证失败', error)
      if (error.errors[0]) {
        // 提示错误信息
        this.$toast({
          message: error.errors[0].message, // 提示消息
          position: 'top' // 调整提示框位置
        })
      }
    },
    async onSendSms() {
      // 验证手机号
      try {
        // 通过 ref 获取到表单实例，使用 validate 验证name为mobile的表单项
        // 返回的是一个 Promise 实例
        await this.$refs['login-form'].validate('mobile')

        // 验证通过，请求发送验证码
        this.isSendSmsLoading = true // 展示按钮的loading状态，防止网络慢用户多次点击触发发送行为
        await sendSms(this.user.mobile) // 用户输入的手机号

        // 短信发出去了，显示倒计时
        this.isCountDownShow = true
        // 倒计时结束 => 隐藏倒计时，显示发送按钮 (监视倒计时的 finish 事件处理)
      } catch (err) {
        // try 里面任何代码的错误都会进入 catch
        // 不同的错误需要不同的提示，这时候我们就需要进行判断
        let message = '' // 消息公用
        if (err && err.response && err.response.status === 429) {
          // 发送短信失败的错误提示
          message = '发送太频繁了，请稍后重试'
        } else if (err.name === 'mobile') {
          // 表单验证失败的错误提示
          message = err.message
        } else {
          // 未知错误
          message = '发送失败，请稍后重试'
        }
        // 验证失败提示用户
        this.$toast({
          message,
          position: 'top'
        })
      }

      // 无论发送验证码成功还是失败，最后都要关闭这个发送按钮的loading状态
      this.isSendSmsLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  .send-btn {
    width: 78px;
    height: 16px;
    background-color: #ededed;
    .van-button__text {
      font-size: 11px;
      color: #666666;
    }
  }
  .login-btn-wrap {
    padding: 26px 16px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
      .van-button__text {
        font-size: 15px;
      }
    }
  }
}
</style>

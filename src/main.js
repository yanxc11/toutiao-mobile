// 入口文件
// 引入vue
import Vue from 'vue'
// 引入 App 组件
import App from './App.vue'
// 引入路由
import router from './router'
// 引入vuex
import store from './store'
// 加载 Vant 组件库
import Vant from 'vant'

// 先加载第三方样式库，再加载自己的样式库
// 加载 Vant 组件库
import 'vant/lib/index.css'

// 自动设置 REM 基准值 (html 标签字体大小)  需要先安装 npm i amfe-flexible
import 'amfe-flexible'

// 加载全局样式
import './style/index.less'

import './utils/dayjs'

// 关闭生产提示
Vue.config.productionTip = false

// 全局注册 Vant 中的组件
Vue.use(Vant)

// 创建 Vue 跟实例，将 router、store 配置到跟实例当中
// 把 App 跟组件渲染到 #app 节点
new Vue({
  router,
  store,
  // 安装全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this
  },
  render: h => h(App)
}).$mount('#app')

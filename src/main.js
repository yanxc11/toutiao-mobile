// 入口文件
// 引入vue
import Vue from 'vue'
// 引入 App 组件
import App from './App.vue'
// 引入路由
import router from './router'
// 引入vuex
import store from './store'
// 加载全局样式
import './style/index.less'

// 关闭生产提示
Vue.config.productionTip = false

// 创建 Vue 跟实例，将 router、store 配置到跟实例当中
// 把 App 跟组件渲染到 #app 节点
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

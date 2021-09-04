// 状态管理容器
import Vue from 'vue'
import Vuex from 'vuex'
// 引入封装的 localStorage 方法
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

// 定义一个常量来保证 存和取的是同一个数据
const USER_KEY = 'toutiao-user'

export default new Vuex.Store({
  state: {
    // 使用 Vuex 结合 本地存储 来实现对用户登录状态的存储
    // user: JSON.parse(window.localStorage.getItem('user')) // 当前登录用户的登录状态(登录等状态)
    user: getItem(USER_KEY), // 当前登录用户的登录状态(登录等状态)

    /*
      通过控制 vuex 中的cachePages 来实现是否缓存
    */
    cachePages: ['LayoutIndex'] // 缓存页面
  },
  mutations: {
    setUser(state, data) {
      state.user = data

      // 为了防止页面刷新数据丢失，我们还需要把数据放到本地存储中，这里仅仅是为了持久化数据
      // 注意 localStorage 中不可以存储对象，这里我们把它转化为字符串存进去
      // window.localStorage.setItem('user', JSON.stringify(state.user))
      setItem(USER_KEY, state.user)
    },

    // 添加缓存页面
    addCachePage(state, pageName) {
      if (!state.cachePages.includes(pageName)) {
        state.cachePages.push(pageName)
      }
    },

    // 移除缓存页面
    removeCachePage(state, pageName) {
      const index = state.cachePages.indexOf(pageName)
      if (index !== -1) {
        state.cachePages.splice(index, 1)
      }
    }
  },
  actions: {
  },
  modules: {
  }
})

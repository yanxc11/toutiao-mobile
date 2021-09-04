// 路由模块
import Vue from 'vue'
import VueRouter from 'vue-router'
// 因为这是路由表，用户配置路由信息，不是组件，不可以使用this。所以我们单独加载 dialog
import { Dialog } from 'vant'
import store from '@/store/'

Vue.use(VueRouter)

// 路由表
const routes = [
  // 登录
  {
    path: '/login',
    name: 'login',
    // 路由懒加载
    component: () => import('@/views/login/'),
    // 路由元信息
    // meta 是一个固定的名字，是一个对象，里面想放什么就放什么。可以给路由添加一些额外的自定义数据
    meta: {
      requiresAuth: false // 这个字段表示是否需要登录
    }
  },
  {
    path: '/', // 通常情况下我们把 / 作为项目的首页
    // 如果有默认子路由，父路由没必要起名字。没有意义
    // name: 'layout'
    component: () => import('@/views/layout/'), // 加个 / 表示是一个目录
    // 配置首页子路由
    children: [
      {
        // 当我们访问 layout 的时候，先把layout渲染出来，接着就把home渲染到组件当中
        path: '', // 首页默认子路由。只能有一个
        name: 'home',
        component: () => import('@/views/home/'),
        meta: { requiresAuth: false }
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/'),
        meta: { requiresAuth: false }
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/'),
        meta: { requiresAuth: true }
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/'),
        meta: { requiresAuth: false }
      }
    ]
  },
  {
    // 搜索
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/'),
    meta: { requiresAuth: false }
  },
  {
    // 详情
    // 需要把文章的id 通过路由动态传递过来
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article/'),
    meta: { requiresAuth: false },
    // 在路由里面开启一个路由选项
    // 将动态路由参数映射到组件中的 props 中，无论是访问还是维护都很方便
    props: true
  },
  {
    // 用户
    path: '/user/profile',
    name: 'user-profile',
    component: () => import('@/views/user-profile'),
    meta: { requiresAuth: false }
  },
  // 配置路由
  {
    path: '/user/chat',
    name: 'user-chat',
    component: () => import('@/views/user-chat'),
    meta: { requiresAuth: true }
  }
]

// 创建路由实例
const router = new VueRouter({
  routes
})

// 全局前置路由守卫
// to: 要访问的路由信息
// form: 来自哪个页面的路由信息
// next: 放行的标记
router.beforeEach((to, from, next) => {
  // 判断页面是否需要登录才能访问
  if (to.meta.requiresAuth) {
    // 如果已经登录，则放行
    if (store.state.user) {
      return next()
    }

    // 没有登录，提示是否登录
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问，确认登录吗'
    })
      .then(() => {
        // 确认执行这里
        router.replace({
          name: 'login',
          query: {
            // 携带当前路由路径跳转到 login 登录页面
            redirect: router.currentRoute.fullPath
          }
        })
        next()
      })
      .catch(() => {
        // 取消执行这里
        // 取消了，停止路由导航
        next(false) // 停留在当前页面
      })
  } else {
    // 不需要登录状态的页面，直接放行
    next()
  }
})

export default router

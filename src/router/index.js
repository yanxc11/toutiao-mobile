// 路由模块
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    // 路由懒加载
    component: () => import('@/views/login/')
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
        component: () => import('@/views/home/')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa/')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video/')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my/')
      }
    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search/')
  }
]

// 创建路由实例
const router = new VueRouter({
  routes
})

export default router

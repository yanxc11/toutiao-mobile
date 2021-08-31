/*
    请求模块
*/

import axios from 'axios'

// 因为在store中暴露了容器实例。在非组件模块中获取 store 必须通过这种方式
// 这里单独加载 store 和在组件中 this.$store 是一个东西
import store from '@/store/'
// 引入 json-bigint
import JSONbig from 'json-bigint'

// 创建axios实例
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn', // 配置基础路径
  transformResponse: [function (data) {
    // 后端返回的数据可能不是 JSON 格式的字符串
    // 如果不是的话，name JSONbig.parse 调用就会报错
    // 所以我们使用 try-catch 来捕获异常，处理异常的发生
    try {
      // 如果转换成功，则直接把结果返回
      return JSONbig.parse(data)
    } catch (err) {
      console.log('转换失败', err)
      // 如果转换失败了，则进入这里
      // 我们在这里把数据原封不动的直接返回给请求使用
      return data
    }

    // axios 默认在内部使用 JSON.parse 来转换处理原始数据
    // return JSON.parse(data)
  }]
})

// 使用request接收axios实例。

// 请求拦截器
// 任何请求发送之前都会经过这个拦截器
// 注意我们要使用 request(axios的实例)
request.interceptors.request.use(function (config) { // config 是本次请求的数据
  // Do something before request is sent
  const { user } = store.state

  // 如果用户已登录，统一给接口设置 token 信息
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }

  // 处理完之后一定要把 config 返回，否则请求就会停在这里。相当于放行的标志
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 响应拦截器

// 导出

export default request

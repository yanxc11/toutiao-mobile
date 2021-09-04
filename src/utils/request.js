/*
    请求模块
*/
import axios from 'axios'
// 因为在store中暴露了容器实例。在非组件模块中获取 store 必须通过这种方式
// 这里单独加载 store 和在组件中 this.$store 是一个东西
import store from '@/store/'
// 在这里面使用 vant 中的 toast 提示需要单独加载
import { Toast } from 'vant'
// 引入 src 文件夹下的 router 拿到 路由器实例
import router from '@/router'
/*
    JS 能够表示的整数返回在 -2^53 到 2^53 次方之间。超过这个范围，无法精确表示这个值。
    此时需要用到 json.bigint 将后端返回数据处理之后才可以正常使用。
        npm i json-bigint
        import JSONbig form 'json-bigint'
        transformResponse是将后端返回的原始数据进行处理。
        使用 try-catch 来捕获异常
*/
// 引入 json-bigint
import JSONbig from 'json-bigint'

// 单独创建一个 请求对象。他不会进入请求拦截器
const refreshTokenReq = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

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
request.interceptors.response.use(function (response) {
  // 如果响应成功进入这里
  return response
}, async function (error) {
  // 如果请求响应失败进入这里
  // 任何超过 2xx 的状态码都会进入到这里

  console.dir(error)
  const status = error.response.status
  if (status === 400) {
    // 客户端请求参数错误
    Toast.fail('客户端请求参数异常')
  } else if (status === 401) {
    //  token 无效
    // 如果没有 user 或者 user.token，直接重新登录
    const { user } = store.state
    if (!user || !user.token) {
      // 直接跳转到登录页面
      return redirectLogin()
    }

    // 使用 refresh_token 请求获取新的 token
    try {
      const { data } = await refreshTokenReq({
        method: 'PUT',
        url: '/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })

      // 拿到新的 token 之后把它更新到容器中
      user.token = data.data.token
      store.commit('setUser', user)

      // 把失败的请求重新发出去
      // error.config 是本次请求的相关配置信息对象
      // 这里使用 request 发请求，它会走自己的请求拦截器
      // 它的请求拦截器通过 store 容器访问 token 数据
      return request(error.config)
    } catch (err) {
      // 刷新 token 失败，直接跳转到登录页
      redirectLogin()
      return err
    }
  } else if (status === 403) {
    // 没有权限操作
    Toast.fail('没有权限操作')
  } else if (status >= 500) {
    // 服务端异常
    Toast.fail('服务端异常，请稍后重试')
  }

  // 抛出异常
  return Promise.reject(error)
})

// 重定向到 登录页面 (一般是 token 失效的情况下)
function redirectLogin() {
  router.replace({
    name: 'login', // 通过 name 来进行跳转

    // 传递查询参数，查询参数会以 ？ 作为分隔符放到 url 后面
    // 登录成功返回原来页面
    query: {
      // 数据名是随便起的
      // router.currentRoute 和我们在组件中获取的 this.$route 是一个东西。得到当前路由对象
      redirect: router.currentRoute.fullPath // fullPath 当前路由路径
      // 当我们点击跳转后，url 上就会携带 redirect。
      // 例如：我们从首页进入的 登录页面， redirect 保存的就是首页的路由路径
    }
  })
}

// 导出
export default request

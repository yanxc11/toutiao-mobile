/*
  用户相关的请求模块
*/

import request from '@/utils/request'

/*
  登录/注册
*/

export const login = data => { // 接收传递过来的参数data
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}
/*
  发送短信验证码
*/
export const sendSms = mobile => { // 接收传递过来的参数data
  return request({
    method: 'GET',
    url: '/app/v1_0/sms/codes/' + mobile
  })
}

/*
  获取登录用户信息
*/

export const getCurrentUser = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
    // 设置请求头
    /* headers: {
      // 需要授权。需要提供当前登录用户的身份(token)，放在请求头中
      Authorization: `Bearer ${store.state.user.token}` // 可以配置到拦截器中统一添加
    } */
  })
}

/*
    获取用户频道列表
*/

export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

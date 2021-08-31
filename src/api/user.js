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

/*
    关注用户
*/

export const addFollow = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    // 因为是POST请求，所以我们在body请求体中携带参数
    data: {
      target: userId // 要关注的用户id
    }
  })
}

/*
    取消关注用户
*/

export const deleteFollow = userId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${userId}`
  })
}

/*
    收藏文章
*/

export const addCollect = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/collections',
    // 因为是POST请求，所以我们在body请求体中携带参数
    data: {
      target: articleId
    }
  })
}

/*
    取消收藏
*/

export const deleteCollect = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/collections/${articleId}`
  })
}

/*
    点赞
*/

export const addLike = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/likings',
    data: {
      target: articleId
    }
  })
}

/*
    取消点赞
*/

export const deleteLike = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${articleId}`
  })
}

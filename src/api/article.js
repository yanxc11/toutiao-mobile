/*
  文章相关请求模块
*/
import request from '@/utils/request'

/*
  获取文章列表
*/
export const getAritcle = params => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params // 配置 params 查询参数
  })
}

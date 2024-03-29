/*
  初始化 dayjs 相关配置
*/
import dayjs from 'dayjs'
// 加载使用中文语言包
import 'dayjs/locale/zh-cn'
// 加载相对时间
import relativeTime from 'dayjs/plugin/relativeTime'
import Vue from 'vue'

// 配置使用处理相对时间
dayjs.extend(relativeTime)
// 全局配置中文语言包
dayjs.locale('zh-cn')

// 把处理相对时间的代码包装为全局过滤器
// 然后就可以在任何组件的模板中使用了
// 所谓的过滤器，就是一个可以在模板中调用的函数而已
// 在组件的模板中使用过滤器: {{ xxx | relativeTime }}
// 管道符前面的内容会作为参数传递给过滤器函数
// 过滤器的返回值会渲染到使用过滤器的模板中
Vue.filter('relativeTime', value => {
  return dayjs(value).from(dayjs())
})

//
Vue.filter('datetime', (value, format = 'YYYY-MM-DD HH:mm:ss') => { // 如果不传递参数，我们这里使用一个默认的时间格式。如果传递了参数，则以传递的参数时间格式为准
  return dayjs(value).format(format)
})

// 例如日期格式化
// console.log(dayjs().format('YYYY^MM-DD HH:mm:ss'))
// 得到2008年1月1号到现在时间的相对时间
// console.log(dayjs('2021-08-23 15:30').from(dayjs()))

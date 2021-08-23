import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import Vue from 'vue'
dayjs.extend(relativeTime)
// 配置使用中文语言包
dayjs.locale('zh-cn')

Vue.filter('datetime', (value, format = 'YYYY-MM-DD HH:mm') => {
  return dayjs(value).format(format)
})

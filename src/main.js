import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'

import './util/day'

import { ElementTiptapPlugin } from 'element-tiptap'
// import element-tiptap 样式
import 'element-tiptap/lib/index.css'
// 安装 element-tiptap 插件
Vue.use(ElementTiptapPlugin, { /* 插件配置项 */ lang: 'zh' })
// 现在你已经在全局注册了 `el-tiptap` 组件。

Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  beforeCreate () {
    Vue.prototype.$bus = this
  },
  router,
  render: h => h(App)
}).$mount('#app')

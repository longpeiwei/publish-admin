import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Layout from '@/views/layout'
import Home from '@/views/home'
import Article from '@/views/article'
import Publish from '@/views/publish'
import Comment from '@/views/comment'
import Settings from '@/views/settings'
import Image from '@/views/image'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  //     name: 'layout' 有子路由可以父路由不起名字
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      },
      {
        path: '/settings',
        name: 'settings',
        component: Settings
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      }
    ]
  }

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(window.localStorage.getItem('user'))
  if (to.path !== '/login') {
    if (user) {
      // 已经登录过， 允许通过
      next()
    } else {
    // 未登录 跳转到登录页面
      next('/login')
    }
  } else {
    // 登录页面, 手机号码密码正确正常通过
    next()
  }
})

export default router

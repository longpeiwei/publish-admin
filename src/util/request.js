import axios from 'axios'

// 登录post
export function apiLogin (data = {}) {
  return axios
    .post('/res/api/users/login', {
      mobile: data.mobile,
      password: data.password
    })
}

// 获取当前登录用户
export function getCurrentUser () {
  // const token = JSON.parse(window.localStorage.getItem('user')).token
  return axios
    .get('/res/api/user', {
      // headers: {
      //   Authorization: `Bearer ${token}`
      // }
    })
}

// 获取所有文章
export function getArticles (obj = {}) {
  return axios
    .get(`/res/api/articles?curPage=${obj.curPage}&pageSize=${obj.pageSize}&status=${obj.status}&channel_id=${obj.channel_id}&begin_date=${obj.begin_date}&end_date=${obj.end_date}`)
}

// 获取所有频道
export function getchannels () {
  return axios
    .get('/res/api/channels')
}

// 请求拦截器  统一设置token
axios.interceptors.request.use(function (config) {
  const user = JSON.parse(window.localStorage.getItem('user'))

  // 如果有登录用户信息， 则统一设置token
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }

  // config.headers.Authorization = token
  // return 之后请求才真正发出去
  return config
}, function (error) {
  return Promise.reject(error)
})

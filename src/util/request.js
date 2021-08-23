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
    .get('/res/api/user')
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

// 发布文章
export function postArticle (obj, draft = false) {
  return axios
    .post(`/res/api/article/publish?draft=${draft}`, obj)
}
// 获取要修改的文章 id
export function getArticleById (id) {
  return axios
    .get(`/res/api/articles/${id}`)
}
// 修改文章
export function upadteArticle (id, obj, draft = false) {
  return axios
    .post(`/res/api/article/upadte/${id}?draft=${draft}`, obj)
}

// 上传图片返回一个地址
export function uploadImage (data) {
  return axios
    .post('/load/avatar', data)
}

// 获取全部素材、图片
export function getAllImages () {
  return axios
    .get('/res/api/images')
}

// 更新头像
export function updateImages (obj = {}) {
  return axios
    .post('/res/api/image/upadte', obj)
}

// 更新信息
export function updateInfo (user = {}) {
  return axios
    .post('/res/api/user/info', user)
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

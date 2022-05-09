import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, getRefreshToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (store.getters.token) {
      // 让每个请求携带token-- ['Authorization']为自定义key 请根据实际情况自行修改
      config.headers['Authorization'] = 'Bearer ' + getToken()
      // console.log('getToken', getToken())
    }
    // 监听 是否 /sys/user/refreshtoken 是则重置token为刷新token
    const url = config.url
    if (url.split('/').pop() === 'refresh') {
      // console.log('config.url', config.url, getRefreshToken())
      config.headers['Authorization'] = 'Bearer ' + getRefreshToken()
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired; 50015: refresh Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50015) {
        // to re-login
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
  // Error对象可能log出来并不是你想象的那种以对象的样子出现
    console.log(error.response) // console.log(error) 401 再判断 error.response.data.code
    // let config = error.response.config
    // console.log('err' + error) // for debug

    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })

    // 拦截网络连接非 200 及 401 响应的错误, eg. Status Code: 500 Internal Server Error
    if (error.response.status !== 200 && error.response.status !== 401) {
      Message({
        message: 'Status Code: ' + error.response.status + ' ' + error.response.statusText,
        type: 'error',
        duration: 3 * 1000
      })
      return
    }

    if (error.response.status === 401 && error.response.data.code === 50008) {
      Message({
        message: '用户已被强制注销,重定向登录',
        type: 'error',
        duration: 3 * 1000
      })

      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/logout').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    }

    if (error.response.status === 401 && error.response.data.code === 50014) {
      Message({
        message: 'access_token过期,自动续期',
        type: 'error',
        duration: 3 * 1000
      })
      return againRequest(error)
    }

    if (error.response.status === 401 && error.response.data.code === 50015) {
      Message({
        message: 'refresh_token过期,重定向登录',
        type: 'error',
        duration: 3 * 1000
      })

      // console.log('refresh_token过期 超时......')

      MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/logout').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    }

    return Promise.reject(error)
  }
) // response 拦截结束

async function againRequest(error) {
  await store.dispatch('user/refreshToken')

  const config = error.response.config
  config.headers['Authorization'] = 'Bearer ' + getToken()

  const res = await axios.request(config)
  // console.log('againRequest...............................', res)
  return res.data // 以error.response.config重新请求返回的数据包是在函数内是 被封装在data里面
}

export default service

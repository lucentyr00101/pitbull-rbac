import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { REFRESH_TOKEN, ACCESS_TOKEN } from '@/store/mutation-types'

import { autoLogout } from './util'
import { errorMessage } from './errorMessage'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 30000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = async (error) => {
  if (error.response) {
    if (error.response.data) {
      error.response.data.message = errorMessage(error.response.data.code) || error.response.data.message
    }

    // const data = error.response.data
    // 从 localstorage 获取 token
    // const token = storage.get(ACCESS_TOKEN)
    const refreshToken = storage.get(REFRESH_TOKEN)

    // if (error.response.status === 403) {
    //   notification.error({
    //     message: 'Forbidden',
    //     description: data.message
    //   })
    // }

    if (error.response.status === 401 && refreshToken) {
      // notification.error({
      //   message: 'Unauthorized',
      //   description: 'Authorization verification failed'
      // })

      // call endpoint again after refreshing token
      return request(error.config)
      // if (token) {
      //   store.dispatch('Logout').then(() => {
      //     setTimeout(() => {
      //       window.location.reload()
      //     }, 1500)
      //   })
      // }
    } else if (error.response.status === 400000) {
      store.dispatch('Logout').then(() => {
        setTimeout(() => window.location.reload(), 1500)
      })
    } else if (error.response.status === 400) {
      const messages = ['Token is not valid', 'User has no permission']
      if (messages.includes(error.response.data.message)) {
        if (refreshToken) {
          await store.dispatch('RefreshToken', refreshToken)
          return request(error.config)
        }
        notification.error({
          message: 'Refresh Token Expired! Please login again. Logging out in 5 secs.'
        })
        autoLogout()
      }
      // if (error.response)
      // notification.error({
      //   message: 'Unauthorized',
      //   description:
      //     'You are no longer allowed to access this site. You will be logged out automatically <5 seconds countdown>.'
      // })
      // if (token) {
      //   store.dispatch('Logout').then(() => {
      //     setTimeout(() => {
      //       window.location.reload()
      //     }, 5000)
      //   })
      // }
    } else if (error.response.status === 500) {
      notification.error({
        message: '500 Internal Server Error',
        description: error.response.data.message
      })
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(async (config) => {
  let token = storage.get(ACCESS_TOKEN)
  const refreshToken = storage.get(REFRESH_TOKEN)
  const noRefresh = ['refreshToken', 'login', 'logout']

  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (!token && refreshToken && !noRefresh.some((apiName) => config.url.includes(apiName))) {
    await store.dispatch('RefreshToken', refreshToken)
    token = storage.get(ACCESS_TOKEN)
  }
  if (config.url === '/auth/login' && !token) return config
  else if (config.url !== '/auth/refreshToken' && token) config.headers.Authorization = `Bearer ${storage.get(ACCESS_TOKEN)}`
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  return response.data
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export { installer as VueAxios, request as axios }

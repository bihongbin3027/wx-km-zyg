import axios from 'axios'
import envconfig from '../envconfig/envconfig'
import { Toast } from 'antd-mobile'

// http 请求拦截器
axios.interceptors.request.use(request => {
  return request
}, error => {
  return Promise.reject(error)
})

// http 响应拦截器
axios.interceptors.response.use(response => {
  const {resultCode, msg} = response.data
  if (resultCode === '0') {
    Toast.info(msg, 1)
  }
  return Promise.resolve(response)
}, error => {
  if (error.response) {
    Toast.info(error.response.statusText, 1)
    return Promise.reject(error.response)
  }
})

export default class Server {
  axios(method, url, params) {
    return new Promise((resolve, reject) => {
      let _option = params
      _option = {
        method,
        url,
        baseURL: envconfig.baseUrl,
        timeout: 10000,
        params: null,
        data: null,
        // 是否携带cookies发起请求
        withCredentials: false,
        validateStatus: (status) => {
          return status >= 200 && status < 300
        },
        ...params
      }
      axios.request(_option).then(res => {
        resolve(res && (typeof res.data === 'object' ? res.data : JSON.parse(res.data)))
      }, error => {
        if (error.response) {
          reject(error.response.data)
        } else {
          reject(error)
        }
      })
    })
  }
}

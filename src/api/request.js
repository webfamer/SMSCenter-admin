import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import qs from 'qs'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import router from '@/router';

let baseURL = '/api';
// if (process.env.NODE_ENV === "production") {
//   baseURL = process.env.VUE_APP_BASE_API
// }

const service = axios.create({
  baseURL, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['token'] = getToken()
      config.headers['locale'] = 'zh'
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.tokenCode == 5000) {
      Message({
        message: '登陆超时，请重新登陆',
        type: 'error',
        duration: 3 * 1000
      })
      // 清除本地数据
      removeToken();
      router.replace({ path: '/login' });
      return Promise.reject()
    } else {
      return res
    }
  },
  error => {
    // if (error.response.status === 401) {
    //   if (router.history.current.path === '/login') {
    //     Message({
    //       message: '用户名或密码错误',
    //       type: 'error',
    //       duration: 3 * 1000
    //     });
    //   } else {
    //     store.dispatch('user/refreshAuth').then(() => {
    //       location.reload();
    //     });
    //   }
    // }
    return Promise.reject(error);
  }
)
function processData(data) { //处理对象空值
  for (let key in data) {
    //如果是对象，在继续遍历
    if (Object.prototype.toString.call(data[key]) === '[object Object]') {
      if (Object.keys(data[key]).length === 0) { //如果是空对象，删除
        delete data[key]
      } else {
        processData(data[key])
      }
    } else if (!data[key]&&data[key]!=0) {
      delete data[key]
    }
  }
  return data;
}
// 请求分为get/post
// axios对于get和post的参数的处理方式是不同的
function http(config) {
  if (config.method.toLowerCase() === 'post') {
    // 针对对象 是无法直接处理的 ; qs是一个js库,可以方便的对对象进行序列化处理
    // myAjax  {name:'zx',age:20} ==> name=zs&age=20
    if (config.url === '/oauth/token') {
      config.params = config.data
    } else {
      config.data = processData(config.data);
    }
  } else {
    config.params = config.data;
  }
  return service(config);
}

export default http;
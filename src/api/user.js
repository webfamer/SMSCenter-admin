import request from '@/api/request'

export function login(data) {
  return request({
    url: '/manage/account/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}

export function sendVerifyCode(data) {
  return request({
    url: '/manage/account/send/login/verification/code',
    method: 'post',
    data:data
  })
}

export default{
  login
}
// 使用自己封装的api
import request from '@/api/request'
function addAccount(data) {
  return request({
    url: '/manage/sys/admin/addAdmin',
    method: 'post',
    data: { ...data }
  })
}

function delAccount(data) {
  return request({
    url: '/manage/sys/admin/deleteAdmin',
    method: 'post',
    data: { ...data}
  })
}
function eidtAccount(data) {
  return request({
    url: '/manage/sys/admin/modifyAdmin',
    method: 'post',
    data: { ...data }
  })
}
function getAccount(data) {
  return request({
    url: '/manage/sys/admin/adminList',
    method: 'post',
    data: { ...data }
  })
}

function resetAccountPwd(data) {
    return request({
      url: '/manage/sys/admin/resetPwd',
      method: 'post',
      data: { ...data }
    })
  }

export default {
  addAccount,
  delAccount,
  eidtAccount,
  getAccount,
  resetAccountPwd
}


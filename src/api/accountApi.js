// 使用自己封装的api
import request from '@/api/request'
function addAccount(data) {
  return request({
    url: '/sys/admin/addAdmin',
    method: 'post',
    data: { ...data }
  })
}

function delAccount(data) {
  return request({
    url: '/sys/admin/deleteAdmin',
    method: 'post',
    data: { ...data}
  })
}
function eidtAccount(data) {
  return request({
    url: '/sys/admin/modifyAdmin',
    method: 'post',
    data: { ...data }
  })
}
function getAccount(data) {
  return request({
    url: '/sys/admin/adminList',
    method: 'post',
    data: { ...data }
  })
}

function resetAccountPwd(data) {
    return request({
      url: '/sys/admin/resetPwd',
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


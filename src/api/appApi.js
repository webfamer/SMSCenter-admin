// 使用自己封装的api
import request from '@/api/request'
function addApp(data) {
  return request({
    url: '/manage/application/add',
    method: 'post',
    data: { ...data }
  })
}

function delApp(data) {
  return request({
    url: '/manage/application/delete',
    method: 'get',
    data: data
  })
}
function eidtApp(data) {
  return request({
    url: '/manage/application/update',
    method: 'post',
    data: { ...data }
  })
}
function getAppList(data) {
  return request({
    url: '/manage/application/listByPage',
    method: 'post',
    data: { ...data }
  })
}
function getAppAll(data) {
  return request({
    url: '/manage/application/listAll',
    method: 'get',
    data: data
  })
}

function getAppDetail(data) {
  return request({
    url: '/manage/application/get',
    method: 'get',
    data: data
  })
}




export default {
  addApp,
  delApp,
  eidtApp,
  getAppList,
  getAppAll,
  getAppDetail
}


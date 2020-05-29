// 使用自己封装的api
import request from '@/api/request'
function addorgani(data) {
  return request({
    url: '/manage/sms/channel/add',
    method: 'post',
    data: { ...data }
  })
}

function delorgani(data) {
  return request({
    url: '/manage/sms/channel/deleteById',
    method: get,
    data: data
  })
}
function eidtorgani(data) {
  return request({
    url: '/manage/sms/channel/update',
    method: 'post',
    data: { ...data }
  })
}
function getorganiDetail(data) {
  return request({
    url: '/manage/sms/channel/getById',
    method: 'get',
    data: data
  })
}
function getorganiList(data) {
  return request({
    url: '/manage/sms/channel/listByPage',
    method: 'post',
    data: { ...data }
  })
}
function getorganiAll(data) {
  return request({
    url: '/manage/sms/channel/listAll',
    method: 'get',
    data: data
  })
}



export default {
  addorgani,
  delorgani,
  eidtorgani,
  getorganiDetail,
  getorganiList,
  getorganiAll
}


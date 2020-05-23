// 使用自己封装的api
import request from '@/api/request'
function addCooperation(data) {
  return request({
    url: '/manage/sms/cooperation/add',
    method: 'post',
    data: { ...data }
  })
}

function delCooperation(data) {
  return request({
    url: '/manage/sms/cooperation/deleteById',
    method: 'get',
    data: data
  })
}
function eidtCooperation(data) {
  return request({
    url: '/manage/sms/cooperation/update',
    method: 'post',
    data: { ...data }
  })
}
function getCooperationDetail(data) {
  return request({
    url: '/manage/sms/cooperation/getById',
    method: 'get',
    data: data
  })
}
function getCooperationData(data) {
  return request({
    url: '/manage/sms/cooperation/listByPage',
    method: 'post',
    data: { ...data }
  })
}




export default {
  addCooperation,
  delCooperation,
  eidtCooperation,
  getCooperationDetail,
  getCooperationData
}


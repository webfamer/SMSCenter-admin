// 使用自己封装的api
import request from '@/api/request'
function addCompany(data) {
  return request({
    url: '/manage/department/add',
    method: 'post',
    data: { ...data }
  })
}

function delCompany(data) {
  return request({
    url: '/manage/department/delete',
    method: 'get',
    data: data
  })
}
function eidtCompany(data) {
  return request({
    url: '/manage/department/update',
    method: 'post',
    data: { ...data }
  })
}
function getCompanyList(data) {
  return request({
    url: '/manage/department/listByPage',
    method: 'post',
    data: { ...data }
  })
}
function getAllCompany(data) {
  return request({
    url: '/manage/department/listAll',
    method: 'post',
    data: { ...data }
  })
}



export default {
  addCompany,
  delCompany,
  eidtCompany,
  getCompanyList,
  getAllCompany
}


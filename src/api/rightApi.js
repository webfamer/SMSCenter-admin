// 使用自己封装的api
import request from '@/api/request'
function addright(data) {
  return request({
    url: '/sys/right/addRight',
    method: 'post',
    data: { ...data }
  })
}

function delright(data) {
  return request({
    url: '/sys/right/delete',
    method: 'post',
    data: { ...data}
  })
}
function eidtright(data) {
  return request({
    url: '/sys/right/modifyRight',
    method: 'post',
    data: { ...data }
  })
}
function getrightDetail(data) {
  return request({
    url: '/sys/right/detail',
    method: 'post',
    data: { ...data }
  })
}
function getrightTree(data) {
  return request({
    url: '/sys/right/rightTree',
    method: 'post',
    data: { ...data }
  })
}




export default {
  addright,
  delright,
  eidtright,
  getrightDetail,
  getrightTree
}


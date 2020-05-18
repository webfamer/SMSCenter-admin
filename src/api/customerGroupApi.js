// 使用自己封装的api
import request from '@/api/request'
import store from '@/store/index'
function addApiGroup(data) {
  console.log(store)
    return request({
      url: '/operation/group/add',
      method: 'post',
      data:{...data,username:store.state.userInfo.username}
    })
}

function delApiGroup(data) {
    return request({
      url: '/operation/group/delete',
      method: 'post',
      data:{...data,username:store.state.userInfo.username}
    })
}
function eidtApiGroup(data) {
    return request({
      url: '/operation/group/modify',
      method: 'post',
      data:{...data,username:store.state.userInfo.username}
    })
}
function getApiGroup(data) {
  return request({
    url: '/operation/group/page',
    method: 'post',
    data:{...data,username:store.state.userInfo.username}
  })
}

export default {
    addApiGroup,
    delApiGroup,
    eidtApiGroup,
    getApiGroup,
}


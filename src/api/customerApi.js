// 使用自己封装的api
import request from '@/api/request'
import store from '@/store/index'



function addApi(data) {
  console.log(store)
    return request({
      url: '/operation/api/add',
      method: 'post',
      data:{...data,username:store.state.userInfo.username}
    })
}

function delApi(data) {
    return request({
      url: '/operation/api/delete',
      method: 'post',
      data:{...data,username:store.state.userInfo.username}
    })
}
function editApi(data) {
    return request({
      url: '/operation/api/modify',
      method: 'post',
      data:{...data,username:store.state.userInfo.username}
    })
}
function getApi(data) {
  return request({
    url: '/operation/api/apiList',
    method: 'post',
    data:{...data,username:store.state.userInfo.username}
  })
}
function getSetApiTree(data){
  return request({
    url: '/operation/api/groupTree',
    method: 'post',
    data:{...data,username:store.state.userInfo.username}
  })
}



function getApiOperation(data){
  return request({
    url: '/operation/api/operationPage',
    method: 'post',
    data:{...data,username:store.state.userInfo.username}
  })
}
export default {
    addApi,
    delApi,
    editApi,
    getApi,
    getSetApiTree,
    getApiOperation
}


// 使用自己封装的api
import request from '@/api/request'
import store from '@/store/index'
function addCustomer(data) {
  console.log(request,'1211')
    return request({
      url: '/operation/merchant/add',
      method: 'post',
      data:{...data,username:store.state.userInfo.username}
    })
}

function delCustomer(data) {
    return request({
      url: '/operation/merchant/delete',
      method: 'post',
      data:{...data,username:store.state.userInfo.username}
    })
}
function eidtCustomer(data) {
    return request({
      url: '/operation/merchant/modify',
      method: 'post',
      data:{...data,username:store.state.userInfo.username}
    })
}
function getCustomer(data) {
  return request({
    url: '/operation/merchant/page',
    method: 'post',
    data:{...data,username:store.state.userInfo.username}
  })
}

function getCustomerDetail(data){
  return request({
    url: '/operation/merchant/detail',
    method: 'post',
    data:{...data,username:store.state.userInfo.username}
  })
}

function getCustomerApi(data){
  return request({
    url: '/operation/agreement/agreementDetail',
    method: 'post',
    data:{...data,username:store.state.userInfo.username}
  })
}
function getCustomerApiTree(data){
  return request({
    url: '/operation/api/groupApiTree',
    method: 'post',
    data:{...data,username:store.state.userInfo.username}
  })
}

function generateApiTree(data){
  return request({
    url: '/operation/agreement/produce',
    method: 'post',
    data:{...data,username:store.state.userInfo.username}
  })
}


export default {
    addCustomer,
    delCustomer,
    eidtCustomer,
    getCustomer,
    getCustomerDetail,
    getCustomerApi,
    getCustomerApiTree,
    generateApiTree
    
}


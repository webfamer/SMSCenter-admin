// 使用自己封装的api
import request from '@/api/request'
import store from '@/store/index'


function addApp(data) {
  console.log(store)
    return request({
      url: '/operation/merchant/app/add',
      method: 'post',
      data:{...data,username:store.state.userInfo.username}
    })
}

function delApp(data) {
    return request({
      url: '/operation/merchant/app/delete',
      method: 'post',
      data:{...data,username:store.state.userInfo.username}
    })
}
function eidtApp(data) {
    return request({
      url: '/operation/merchant/app/modify',
      method: 'post',
      data:{...data,username:store.state.userInfo.username}
    })
}
function getApp(data) {
  return request({
    url: '/operation/merchant/appDetail',
    method: 'post',
    data:{...data,username:store.state.userInfo.username}
  })
}


function getCustomerSecret(data){ //获取app秘钥
  return request({
    url: '/operation/viewAppSecret',
    method: 'post',
    data:{...data,username:store.state.userInfo.username}
  })
}
function getAppDetail(data){
  return request({
    url: 'merchant/detail',
    method: 'get',
    data:{...data,username:store.state.userInfo.username}
  })
}

export default {
    addApp,
    delApp,
    eidtApp,
    getApp,
    getAppDetail,
    getCustomerSecret
}


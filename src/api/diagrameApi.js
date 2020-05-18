// 使用自己封装的api
import request from '@/api/request'
import store from '@/store/index'   
function getApiopration(data) {
    //操作记录
  return request({
    url: '/operation/api/operationPage',
    method: 'post',
    data:{...data,username:store.state.userInfo.username}
  })
}


export default {
    getApiopration
}


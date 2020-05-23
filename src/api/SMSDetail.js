// 使用自己封装的api
import request from '@/api/request'
function getMsgDetail(data) {
  return request({
    url: '/sms-send-log/list',
    method: 'post',
    data: { ...data }
  })
}




export default {
    getMsgDetail
}


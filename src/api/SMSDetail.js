// 使用自己封装的api
import request from '@/api/request'
function getMsgSendLog(data) {
  return request({
    url: '/manage/sms-send-log/list',
    method: 'post',
    data: { ...data }
  })
}

function getMsgSendCount(data) {
  return request({
    url: '/manage/sms-statistics/list',
    method: 'post',
    data: { ...data }
  })
}



export default {
  getMsgSendLog,getMsgSendCount
}


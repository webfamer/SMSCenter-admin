// 使用自己封装的api
import request from '@/api/request'
function getRolesList(data) {
    return request({
        url: '/sys/role/roleList',
        method: 'post',
        data: { ...data }
    })
}
function addRoles(data) {
    return request({
        url: '/sys/role/addRole',
        method: 'post',
        data: { ...data }
    })
}
function delRoles(data) {
    return request({
        url: '/sys/role/deleteRole',
        method: 'post',
        data: { ...data }
    })
}
function eidtRoles(data) {
    return request({
        url: '/sys/role/modifyRole',
        method: 'post',
        data: { ...data }
    })
}

function getRolesTree(data) {
    return request({
        url: '/sys/role/roleRightTree',
        method: 'post',
        data: { ...data }
    })
}




export default {
    getRolesList,
    addRoles,
    delRoles,
    eidtRoles,
    getRolesTree
}

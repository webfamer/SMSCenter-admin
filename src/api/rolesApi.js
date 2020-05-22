// 使用自己封装的api
import request from '@/api/request'
function getRolesList(data) {
    return request({
        url: '/manage/sys/role/roleList',
        method: 'post',
        data: { ...data }
    })
}
function addRoles(data) {
    return request({
        url: '/manage/sys/role/addRole',
        method: 'post',
        data: { ...data }
    })
}
function delRoles(data) {
    return request({
        url: '/manage/sys/role/deleteRole',
        method: 'post',
        data: { ...data }
    })
}
function eidtRoles(data) {
    return request({
        url: '/manage/sys/role/modifyRole',
        method: 'post',
        data: { ...data }
    })
}

function getRolesTree(data) {
    return request({
        url: '/manage/sys/role/roleRightTree',
        method: 'post',
        data: { ...data }
    })
}
function getRoleNameList(data) {
    return request({
        url: '/manage/sys/role/roleNameList',
        method: 'post',
        data: { ...data }
    })
}




export default {
    getRolesList,
    addRoles,
    delRoles,
    eidtRoles,
    getRolesTree,
    getRoleNameList
}


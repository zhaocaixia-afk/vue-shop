import { request } from './request'

// 1.用户列表
export function getUsersList(params){
    return request({
        url:'/users',
        params: params
    })
}

// 2.添加用户
export function addUsers(form){
    return request({
        url: 'users',
        method: 'post',
        data: form
    })
}

// 3.修改用户状态
export function updateStateChanged(id,mg_state){
    return request({
        url: `users/${id}/state/${mg_state}`,
        method: 'put'
    })
}

// 4.1.修改用户,显示编辑
export function showEditDialog(id){
    return request({
        url:`users/${id}`
    })
}

// 4.2.修改用户,提交更新数据
export function editUserInfo(id,data){
    return request({
        url: `users/${id}`,
        method: 'put',
        data: data
    })
}

// 5.删除用户
export function deleteUserInfo(id){
    return request({
        url: `users/${id}`,
        method: 'delete'
    })
}

// 6.1.分配权限,展示
export function setRole(){
    return request({
        url: 'roles'
    })
}

// 6.2.分配权限,确定
export function saveRoleInfo(id,data){
    return request({
        url: `users/${id}/role`,
        method: 'put',
        data: data
    })
}

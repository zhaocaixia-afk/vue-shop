import { request } from '../request'

// 1.权限列表
export function getRolesList(){
    return request({
        url:'roles'
    })
}

// 2.1.分配权限数据
export function showSetRightDialog(){
    return request({
        url: 'rights/tree'
    })
}

// 2.2.分配权限
export function allotRights(id,data){
    return request({
        url: `roles/${id}/rights`,
        method: 'post',
        data: data
    })
}

// 2.3.tag删除
export function deleteRightById(roleId,rightId){
    return request({
        url: `roles/${roleId}/rights/${rightId}`,
        method: 'delete'
    })
}

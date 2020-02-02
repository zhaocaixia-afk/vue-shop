import { request } from '../request'

// 1.权限列表
export function getRightsList(){
    return request({
        url:'rights/list'
    })
}

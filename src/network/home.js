import { request } from './request.js'

export function getMenuList(){
    return request({
        url:'menus'
    })
}

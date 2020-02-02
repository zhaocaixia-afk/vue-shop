import { request } from './request'

export function login(form){
    return request({
        url: 'login',
        method: 'post',
        data: form
    })
}

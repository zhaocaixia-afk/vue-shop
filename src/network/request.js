import axios from 'axios'
import { getSession } from 'common/utils'
// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export function request(config){
    // console.log(config)
    const type = config.method ? config.method : 'get'
    const data = config.data ? config.data : ''
    const params = config.params ? config.params : ''
    // 1.创建axios实例
    const instance = axios.create({
        baseURL : "http://127.0.0.1:8888/api/private/v1/",
        timeout: 5000,
        method: type,
        data: data, //对象{}
        // axios.get('/user', {
        //     params: {
        //       ID: 12345
        //     }
        //   })
        // axios.post('/user', {
        //     firstName: 'Fred',
        //     lastName: 'Flintstone'
        //   })
    });

    // 3.请求拦截器
    instance.interceptors.request.use(config => {
        NProgress.start()
        config.headers.Authorization = getSession('token')
        return config
    },err => {
        console.log(err)
    })

    // 4.响应拦截器
    instance.interceptors.response.use(config => {
        NProgress.done()
        return config
    },err => {
        console.log(err)
    })

    // 2.发送真正的网络请求
    return instance(config)
}

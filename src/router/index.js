import Vue from 'vue'
import VueRouter from 'vue-router'

import { getSession } from 'common/utils'

// 1.引入组件
const Login = () => import('views/login/Login')
const Home = () => import('views/home/Home')
const Welcome = () => import('views/home/child/Welcome')

Vue.use(VueRouter)

const routes = [
  { path: '', redirect: '/login' },
  { path: '/login', component: Login },
  { 
    path: '/home', 
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 2.挂载路由导航守卫
router.beforeEach((to,from,next) => {
  if(to.path === '/login') return next()
  // 获取token
  const tokenStr = getSession("token")
  if(!tokenStr) return next('/login')
  next()
})

export default router

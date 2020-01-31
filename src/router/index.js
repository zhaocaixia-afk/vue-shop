import Vue from 'vue'
import VueRouter from 'vue-router'

import { getSession } from 'common/utils'

// 1.引入组件
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ 'views/login/Login')
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ 'views/home/Home')
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ 'views/home/child/Welcome')

const Users = () => import(/* webpackChunkName: "user" */ 'views/home/child/users/Users')
const Rights = () => import(/* webpackChunkName: "rights_roles" */ 'views/home/child/power/Rights')
const Roles = () => import(/* webpackChunkName: "rights_roles" */ 'views/home/child/power/Roles')
const Cate = () => import(/* webpackChunkName: "cate_params_goods" */ 'views/home/child/goods/Cate')
const Params = () => import(/* webpackChunkName: "cate_params_goods" */ 'views/home/child/goods/Params')
const Goods = () => import(/* webpackChunkName: "cate_params_goods" */ 'views/home/child/goods/Goods')
const AddGood = () => import(/* webpackChunkName: "cate_params_goods" */ 'views/home/child/goods/AddGood')
const Order = () => import(/* webpackChunkName: "order" */ 'views/home/child/order/Order')
const Report = () => import(/* webpackChunkName: "report" */ 'views/home/child/report/Report')

Vue.use(VueRouter)

const routes = [
  { path: '', redirect: '/login' },
  { path: '/login', component: Login },
  { 
    path: '/home', 
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: Goods },
      { path: '/goods/add', component: AddGood },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
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

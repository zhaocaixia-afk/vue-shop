import Vue from 'vue'
import VueRouter from 'vue-router'

// 1.引入组件
const Login = () => import('views/login/Login')

Vue.use(VueRouter)

const routes = [
  { path: '', redirect: '/login' },
  { path: '/login', component:Login }
]

const router = new VueRouter({
  routes
})

export default router

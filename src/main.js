import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

// 1.引入normalize.css
import 'normalize.css/normalize.css'
// 2.引入全局css
import './assets/css/basic.css'
// 3.引入字体
import './assets/fonts/iconfont.css'
// 4.配置axios
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 5.设置请求头,带token
import { getSession } from 'common/utils'
axios.interceptors.request.use(config => {
  config.headers.Authorization = getSession('token')
  return config
})
Vue.prototype.$http = axios
// 6.全局引入treeTable
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)
// 7.过滤器
// 方式一
// Vue.filter('dateFormat',function(originVal){
// 	const dt = new Date(originVal)
// 	const y = dt.getFullYear()
// 	const m = (dt.getMonth() + 1 + '').padStart(2,'0')
// 	const d = (dt.getDate() + '').padStart(2,'0')	

// 	const hh = (dt.getHours() + '').padStart(2,'0')
// 	const mm = (dt.getMinutes() + '').padStart(2,'0')
//   const ss = (dt.getSeconds() + '').padStart(2,'0')
//   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
// })
// 方式二
import './filters'
// 8.富文本
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

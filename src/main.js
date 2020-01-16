import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

// 1.引入normalize.css
import 'normalize.css/normalize.css'
// 2.引入全局css
import './assets/css/basic.css'
// 3.
import './assets/fonts/iconfont.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

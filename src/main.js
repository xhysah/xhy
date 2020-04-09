// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import './elementUi/element'
import '../src/assets/global.css'
import './assets/font/iconfont.css'

axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

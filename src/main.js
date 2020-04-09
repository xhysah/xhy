// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import './elementUi/element'
import '../src/assets/global.css'
import './assets/font/iconfont.css'

// Axios 是一个基于 promise 的 HTTP 库
// baseURL设置请求不同域名的接口，baseURL的值将自动加在 `url` 前面，除非 `url` 是一个绝对 URL
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1/'
// interceptors.request 请求拦截器，在发送请求之前做些什么
// axios请求拦截相当于一个预处理的过程，针对要发送的请求，给他加上一个token
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

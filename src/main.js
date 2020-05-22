// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import './plugins/element.js'
import Axios from 'axios'
import VueSocketIO from 'vue-socket.io'
import '../static/css/main.css'
import 'babel-polyfill'

import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'

Vue.use(VueVideoPlayer)

const host = 'https://iot2.sz-luoding.com:2888'
// const host = 'http://localhost:8365'

var eventBus = {
  install (Vue, options) {
    Vue.prototype.$EventBus = new Vue()
  }
}
Vue.use(eventBus)

Vue.prototype.$axios = Axios
Axios.defaults.baseURL = host + '/api'
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
Axios.defaults.withCredentials = true
Axios.interceptors.request.use(
  config => {
    let tokenString = localStorage.getItem('tokenInfo')
    let tokenInfo
    try {
      tokenInfo = JSON.parse(tokenString)
    } catch (e) {
    }
    if (tokenInfo) {
      if (tokenInfo.token) {
        config.headers['X-Auth-Token'] = `${tokenInfo.token}`
      }
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
Axios.interceptors.response.use(
  response => {
    return response
  },
  err => {
    if (err.response) {
      if (err.response.status === 401) {
        router.replace('/login')
      }
    }
    return Promise.reject(err)
  }
)

Vue.config.productionTip = false

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'https://iot2.sz-luoding.com:888'
}))

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

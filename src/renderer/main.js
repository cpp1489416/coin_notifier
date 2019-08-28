import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import '@/assets/css/element-ui/theme/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import '@/mock'
import request from '@/utils/request'

import sqlite3 from 'sqlite3'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

Vue.prototype.$sqlite3 = sqlite3.verbose()
Vue.prototype.$axios = request


new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import './element/elment'
import router from './router'
import store from './store'
import VueRx from 'vue-rx'
import Rx from 'rxjs/Rx'
import './element/element-variables.scss'
import 'xe-utils'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import './utils/tagcanvas.js'
Vue.use(VXETable)
Vue.use(VueRx, Rx)
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

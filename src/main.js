// webpack入口文件
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from './util/http'
import store from './store'
import '../src/assets/css/global.less'
// 引入ElementUI全部组件，也可以部分引入
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'babel-polyfill'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
    el: '#app',
    axios,
    store,
    router,
    components: {App},
    template: '<App/>'
})

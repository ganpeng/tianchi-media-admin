// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import service from './service';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'assets/css/global.less';
import 'assets/css/global.scss';
import 'babel-polyfill';
import util from '@/util/extend';
import authority from '@/util/authority';
import '@/util/filters';
import '@/util/directives';
import 'sysComponents/custom_components/global/install';
import './icons';
import VCharts from 'v-charts';
import dragula from 'dragula';
import wsCache from '@/util/webStorage';
import VueCarousel from 'vue-carousel';

const VueScrollTo = require('vue-scrollto');
Vue.use(VueScrollTo, {
    container: '#global-content'
});

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueCarousel);
Vue.prototype.$service = service;
Vue.prototype.$util = util;
Vue.prototype.$authority = authority;
Vue.prototype.$dragula = dragula;
Vue.prototype.$wsCache = wsCache;
Vue.use(VCharts);

window.eventBus = new Vue(); // 注册全局事件对象

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: {App},
    template: '<App/>'
});

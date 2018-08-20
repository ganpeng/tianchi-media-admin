// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import service from './service';
import store from './store';
import 'assets/css/global.less';
import 'assets/css/global.scss';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'babel-polyfill';
import util from '@/util/extend';
import '@/util/filters';
import '@/util/directives';
import 'sysComponents/custom_components/global/install';
import './icons';
import dragula from 'dragula';
import wsCache from '@/util/webStorage';
import Icon from 'vue-awesome/components/Icon';
import 'vue-awesome/icons';

Vue.component('icon', Icon);

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.prototype.$service = service;
Vue.prototype.$util = util;
Vue.prototype.$dragula = dragula;
Vue.prototype.$wsCache = wsCache;

window.Hls = require('hls.js');

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: {App},
    template: '<App/>'
});

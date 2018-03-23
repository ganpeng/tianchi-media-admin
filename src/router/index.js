import Vue from 'vue'
import Router from 'vue-router'
import login from '../page/login/login'
import register from '../page/register/register'
import home from '../page/home/home'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'login',
            alias: '/login',
            component: login
        }, {
            path: '/register',
            name: 'register',
            component: register
        }, {
            path: '/home',
            name: 'home',
            component: home
        }
    ]
})

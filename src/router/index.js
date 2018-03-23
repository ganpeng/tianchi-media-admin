import Vue from 'vue'
import Router from 'vue-router'
import login from '../page/login/login'
import register from '../page/register/register'

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
        }
    ]
})

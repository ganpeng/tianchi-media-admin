import Vue from 'vue'
import Router from 'vue-router'
import login from '../page/login/login'
import register from '../page/register/register'
import layout from '../page/layout/layout'
import home from '../page/home/home'

Vue.use(Router)

export default new Router({
    routes: [
        // 登录页面
        {
            path: '/',
            name: 'login',
            alias: '/login',
            component: login
        },
        // 注册页面
        {
            path: '/register',
            name: 'register',
            component: register
        },
        // 网站内容页面
        {
            path: '/layout',
            name: 'layout',
            component: layout,
            // 首页
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component: home
                }
            ]
        }
    ]
})

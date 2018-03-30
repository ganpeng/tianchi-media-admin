import Vue from 'vue'
import Router from 'vue-router'
import login from '../page/login/login'
import retrievePassword from '../page/retrievePassword/retrievePassword'
import layout from '../page/layout/layout'
import home from '../page/home/home'
import infoSetting from '../page/personalCenter/infoSetting'
import modifyPassword from '../page/personalCenter/modifyPassword'
import userList from '../page/userCenter/userList'

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
        // 找回密码页面
        {
            path: '/retrieve-password',
            name: 'retrievePassword',
            component: retrievePassword
        },
        // 网站内容结构
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
                },
                {
                    path: '/personal-center/info-setting',
                    name: 'infoSetting',
                    component: infoSetting
                },
                {
                    path: '/personal-center/modify-password',
                    name: 'modifyPassword',
                    component: modifyPassword
                },
                {
                    path: '/user-center/list',
                    name: 'userList',
                    component: userList
                }
            ]
        }
    ]
})

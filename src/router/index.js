import Vue from 'vue'
import Router from 'vue-router'
import login from '../page/login/login'
import retrievePassword from '../page/retrievePassword/retrievePassword'
import layout from '../page/layout/layout'
import home from '../page/home/home'
import infoSetting from '../page/personalCenter/infoSetting'
import modifyPassword from '../page/personalCenter/modifyPassword'
import userList from '../page/userCenter/userList'
import adminList from '../page/adminManage/adminList'
import createAdmin from '../page/adminManage/createAdmin'
import adminDetail from '../page/adminManage/adminDetail'

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
                // 个人中心-信息设置页面
                {
                    path: '/personal-center/info-setting',
                    name: 'infoSetting',
                    component: infoSetting
                },
                // 个人中心-修改密码页面
                {
                    path: '/personal-center/modify-password',
                    name: 'modifyPassword',
                    component: modifyPassword
                },
                // 管理员中心——管理员列表页面
                {
                    path: '/admin-manage/list',
                    name: 'adminList',
                    component: adminList
                },
                // 管理员管理——创建管理员页面
                {
                    path: '/admin-manage/create',
                    name: 'createAdmin',
                    component: createAdmin
                },
                // 管理员管理——管理员详情
                {
                    path: '/admin-manage/detail',
                    name: 'adminDetail',
                    component: adminDetail
                },
                // 用户中心-用户列表页面
                {
                    path: '/user-center/list',
                    name: 'userList',
                    component: userList
                }
            ]
        }
    ]
})

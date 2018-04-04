import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import Cookies from 'js-cookie'
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
import errorLayout from '../page/error/error'
import errorNotFound from '../page/error/404'

Vue.use(Router)

// 定义不需要token与权限的页面名称集合
const whitePagesList = ['login', 'retrievePassword']

// 刷新页面时，保存Cookie信息到store中
if (Cookies.get('token')) {
    store.dispatch('user/reLogin',
        {
            uid: Cookies.get('uid'),
            username: Cookies.get('username'),
            token: Cookies.get('token')
        })
}

// 定义路由
let router = new Router({
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
        },
        // 错误页面布局
        {
            path: '/error-layout',
            name: 'errorLayout',
            component: errorLayout,
            // 404页面
            children: [
                {
                    path: '/error/404',
                    name: 'errorNotFound',
                    component: errorNotFound
                }
            ]
        }
    ]
})

/**
 * 关于路由的方法集合
 * @type {{isWhitePage: ((value))}}
 */
let routerUtil = {
    /**
     *Judge the current page if somebody can access to without token and permission
     * @param routerName a router name
     * @return {Boolean}
     */
    isWhitePage(routerName) {
        for (let i = 0; i < whitePagesList.length; i++) {
            if (routerName === whitePagesList[i]) {
                return true
            }
        }
        return false
    }
}

// 定义路由钩子函数，跳转时定义路由导航
router.beforeEach((to, from, next) => {
    // 白名单而且没有token,直接跳转
    if (routerUtil.isWhitePage(to.name) && !store.state.user.token) {
        next()
        // 白名单但是存在token,跳转到首页,防止手动更改url
    } else if (routerUtil.isWhitePage(to.name) && store.state.user.token) {
        next({name: 'home'})
        // 非白名单且不存在token，跳转到登录页面
    } else if (!store.state.user.token) {
        next({name: 'login'})
        // 非白名单、存在token、存在跳转路由，直接跳转
    } else if (to.name) {
        next()
        // 非白名单、存在token、不存在跳转路由，跳转到404页面
    } else {
        next({name: 'errorNotFound'})
    }
})

export default router

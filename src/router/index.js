import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import Cookies from 'js-cookie';
import Login from '../page/login/Login';
import RetrievePassword from '../page/retrieve_password/RetrievePassword';
import Layout from '../page/layout/Layout';
import Home from '../page/home/Home';
import InfoSetting from '../page/personal_center/InfoSetting';
import ModifyPassword from '../page/personal_center/ModifyPassword';
import UserList from '../page/user_center/UserList';
import AdminList from '../page/admin_manage/AdminList';
import CreateAdmin from '../page/admin_manage/CreateAdmin';
import AdminDetail from '../page/admin_manage/AdminDetail';
import EditAdmin from '../page/admin_manage/EditAdmin';
import ErrorLayout from '../page/error/ErrorLayout';
import ErrorNotFound from '../page/error/404';
import ColumnsSetting from '../page/content_manage/column_manage/ColumnsSetting';
import TodayRecommended from '../page/content_manage/column_manage/TodayRecommended';

Vue.use(Router);

// 定义不需要token与权限的页面名称集合
const whitePagesList = ['Login', 'RetrievePassword'];

// 刷新页面时，保存Cookie信息到store中
if (Cookies.get('token')) {
    store.dispatch('user/reLogin',
        {
            uid: Cookies.get('uid'),
            name: Cookies.get('name'),
            token: Cookies.get('token')
        });
}

// 定义路由
let router = new Router({
    mode: 'history',
    routes: [
        // 登录页面
        {
            path: '/',
            alias: '/login',
            name: 'Login',
            component: Login
        },
        // 找回密码页面
        {
            path: '/retrieve-password',
            name: 'RetrievePassword',
            component: RetrievePassword
        },
        // 网站内容结构
        {
            path: '/layout',
            name: 'Layout',
            component: Layout,
            // 首页
            children: [
                {
                    path: '/home',
                    name: 'Home',
                    component: Home
                },
                // 个人中心-信息设置页面
                {
                    path: '/personal-center/info-setting',
                    name: 'InfoSetting',
                    component: InfoSetting
                },
                // 个人中心-修改密码页面
                {
                    path: '/personal-center/modify-password',
                    name: 'ModifyPassword',
                    component: ModifyPassword
                },
                // 管理员中心——管理员列表页面
                {
                    path: '/admin-manage/list',
                    name: 'AdminList',
                    component: AdminList
                },
                // 管理员管理——创建管理员页面
                {
                    path: '/admin-manage/create',
                    name: 'CreateAdmin',
                    component: CreateAdmin
                },
                // 管理员管理——管理员详情
                {
                    path: '/admin-manage/detail/:id',
                    name: 'AdminDetail',
                    component: AdminDetail
                },
                // 管理员管理——管理员信息编辑
                {
                    path: '/admin-manage/edit/:id',
                    name: 'EditAdmin',
                    component: EditAdmin
                },
                // 用户中心-用户列表页面
                {
                    path: '/user-center/list',
                    name: 'UserList',
                    component: UserList
                },
                // 内容管理-栏目管理-栏目项设置
                {
                    path: '/content-manage/column-manage/setting',
                    name: 'ColumnsSetting',
                    component: ColumnsSetting
                },
                // 内容管理-栏目管理-今日推荐设置
                {
                    path: '/content-manage/column-manage/today-recommended',
                    name: 'TodayRecommended',
                    component: TodayRecommended
                }
            ]
        },
        // 错误页面布局
        {
            path: '/error-layout',
            name: 'ErrorLayout',
            component: ErrorLayout,
            // 404页面
            children: [
                {
                    path: '/error/404',
                    name: 'ErrorNotFound',
                    component: ErrorNotFound
                }
            ]
        }
    ]
});

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
                return true;
            }
        }
        return false;
    }
};

// 定义路由钩子函数，跳转时定义路由导航
router.beforeEach((to, from, next) => {
    // 白名单而且没有token,直接跳转
    if (routerUtil.isWhitePage(to.name) && !store.state.user.token) {
        next();
        // 白名单但是存在token,跳转到首页,防止手动更改url
    } else if (routerUtil.isWhitePage(to.name) && store.state.user.token) {
        next({name: 'Home'});
        // 非白名单且不存在token，跳转到登录页面
    } else if (!store.state.user.token) {
        next({name: 'Login'});
        // 非白名单、存在token、存在跳转路由，直接跳转
    } else if (to.name) {
        next();
        // 非白名单、存在token、不存在跳转路由，跳转到404页面
    } else {
        next({name: 'ErrorNotFound'});
    }
});

export default router;

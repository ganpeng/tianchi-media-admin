import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import './reload';
import Login from 'sysPage/login/Login';
import RetrievePassword from 'sysPage/retrieve_password/RetrievePassword';
import Layout from 'sysPage/layout/Layout';
import Home from 'sysPage/home/Home';
import InfoSetting from 'sysPage/personal_center/InfoSetting';
import ModifyPassword from 'sysPage/personal_center/ModifyPassword';
import UserList from 'sysPage/user_center/UserList';
import AdminList from 'sysPage/admin_manage/AdminList';
import CreateAdmin from 'sysPage/admin_manage/CreateAdmin';
import AdminDetail from 'sysPage/admin_manage/AdminDetail';
import EditAdmin from 'sysPage/admin_manage/EditAdmin';
import ErrorLayout from 'sysPage/error/ErrorLayout';
import ErrorNotFound from 'sysPage/error/404';
import NavBarSetting from 'sysPage/content_manage/nav_bar_manage/NavBarSetting';
import TodayRecommended from 'sysPage/content_manage/nav_bar_manage/TodayRecommended';
import PersonList from 'sysPage/person_manage/PersonList';
import CreatePerson from 'sysPage/person_manage/CreatePerson';
import EditPerson from 'sysPage/person_manage/EditPerson';
import DisplayPerson from 'sysPage/person_manage/DisplayPerson';
import CreateProgramme from 'sysPage/programme_manage/CreateProgramme';
import ProgrammeTypeManage from 'sysPage/programme_manage/ProgrammeTypeManage';
import EditProgramme from 'sysPage/programme_manage/EditProgramme';
import DisplayProgramme from 'sysPage/programme_manage/DisplayProgramme';
import ProgrammeList from 'sysPage/programme_manage/ProgrammeList';
import SetChannel from 'sysPage/content_manage/layout_manage/SetChannel';
import AdGroup from 'sysPage/content_manage/layout_manage/AdGroup';
import AppendAd from 'sysPage/content_manage/layout_manage/AppendAd';
import AppendProgramme from 'sysPage/content_manage/layout_manage/AppendProgramme';
import SingleAppendSubject from 'sysPage/content_manage/layout_manage/SingleAppendSubject';
import ModelAppendProgrammeSubject from 'sysPage/content_manage/layout_manage/ModelAppendProgrammeSubject';
import ModelAppendPersonSubject from 'sysPage/content_manage/layout_manage/ModelAppendPersonSubject';
import CreateProgrammeSubject from 'sysPage/content_manage/subject_manage/programme_subject/CreateProgrammeSubject';
import CreatePersonSubject from 'sysPage/content_manage/subject_manage/person_subject/CreatePersonSubject';
import SubjectList from 'sysPage/content_manage/subject_manage/SubjectList';
import AdvertResourceList from 'sysPage/advert_manage/advert_resources_manage/AdvertResourceList';
import PersonSubjectDetail from 'sysPage/content_manage/subject_manage/person_subject/PersonSubjectDetail';
import EditPersonSubject from 'sysPage/content_manage/subject_manage/person_subject/EditPersonSubjectBasicInfo';
import EditSubjectPersons from 'sysPage/content_manage/subject_manage/person_subject/EditSubjectPersons';
import ProgrammeSubjectDetail from 'sysPage/content_manage/subject_manage/programme_subject/ProgrammeSubjectDetail';
import StartingAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/StartingAdvertGroupList';
import EditProgrammeSubject from 'sysPage/content_manage/subject_manage/programme_subject/EditProgrammeSubjectBasicInfo';
import EditSubjectProgrammes from 'sysPage/content_manage/subject_manage/programme_subject/EditSubjectProgrammes';
import PreProgrammeAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/PreProgrammeAdvertGroupList';
import ScreensaverAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/ScreensaverAdvertGroupList';
import PauseAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/PauseAdvertGroupList';
import LiveAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/LiveAdvertGroupList';
import VolumeBarAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/VolumeBarAdvertGroupList';
import DialogAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/DialogAdvertGroupList';
import DetailPageAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/DetailPageAdvertGroupList';
import VideoList from 'sysPage/video_manage/VideoList';

Vue.use(Router);

// 定义不需要token与权限的页面名称集合
const whitePagesList = ['Login', 'RetrievePassword'];

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
                    path: '/nav-bar-manage/setting',
                    name: 'NavBarSetting',
                    component: NavBarSetting
                },
                // 内容管理-栏目管理-今日推荐设置
                {
                    path: '/nav-bar-manage/today-recommended',
                    name: 'TodayRecommended',
                    component: TodayRecommended
                },
                // 内容管理-栏目管理-直播频道设置(根据navBarId设置对应的直播频道)
                {
                    path: '/layout-manage/channel/:navBarId',
                    name: 'SetChannel',
                    component: SetChannel
                },
                // 内容管理-栏目管理-广告组设置
                {
                    path: '/layout-manage/ad-group',
                    name: 'AdGroup',
                    component: AdGroup
                },
                // 内容管理-栏目管理-单个广告设置
                {
                    path: '/layout-manage/ad',
                    name: 'AppendAd',
                    component: AppendAd
                },
                // 内容管理-栏目管理-节目选择设置
                {
                    path: '/layout-manage/programme/:model/:row/:index',
                    name: 'AppendProgramme',
                    component: AppendProgramme
                },
                // 内容管理-栏目管理-单个推荐位选择专题
                {
                    path: '/layout-manage/single-append-subject/:model/:row/:index',
                    name: 'SingleAppendSubject',
                    component: SingleAppendSubject
                },
                // 内容管理-栏目管理-模块推荐位选择节目专题
                {
                    path: '/layout-manage/model-append-programme-subject/:row',
                    name: 'ModelAppendProgrammeSubject',
                    component: ModelAppendProgrammeSubject
                },
                // 内容管理-栏目管理-模块推荐位选择人物专题
                {
                    path: '/layout-manage/model-append-person-subject/:row',
                    name: 'ModelAppendPersonSubject',
                    component: ModelAppendPersonSubject
                },
                // 内容管理-专题管理-新增节目专题
                {
                    path: '/subject-manage/programme/create',
                    name: 'CreateProgrammeSubject',
                    component: CreateProgrammeSubject
                },
                // 内容管理-专题管理-新增人物专题
                {
                    path: '/subject-manage/person/create',
                    name: 'CreatePersonSubject',
                    component: CreatePersonSubject
                },
                // 内容管理-专题管理-专题列表
                {
                    path: '/subject-manage/list',
                    name: 'SubjectList',
                    component: SubjectList
                },
                // 内容管理-专题管理-人物专题-详情
                {
                    path: '/subject-manage/person/detail/:id',
                    name: 'PersonSubjectDetail',
                    component: PersonSubjectDetail
                },
                // 内容管理-专题管理-节目专题-详情
                {
                    path: '/subject-manage/programme/detail/:id',
                    name: 'ProgrammeSubjectDetail',
                    component: ProgrammeSubjectDetail
                },
                // 内容管理-专题管理-人物专题-编辑基本信息
                {
                    path: '/subject-manage/person/edit-basic/:id',
                    name: 'EditPersonSubject',
                    component: EditPersonSubject
                },
                // 内容管理-专题管理-节目专题-编辑基本信息
                {
                    path: '/subject-manage/programme/edit-basic/:id',
                    name: 'EditProgrammeSubject',
                    component: EditProgrammeSubject
                },
                // 内容管理-专题管理-人物专题-编辑内容
                {
                    path: '/subject-manage/person/edit-content/:id',
                    name: 'EditSubjectPersons',
                    component: EditSubjectPersons
                },
                // 内容管理-专题管理-节目专题-编辑内容
                {
                    path: '/subject-manage/programme/edit-content/:id',
                    name: 'EditSubjectProgrammes',
                    component: EditSubjectProgrammes
                },
                // 人物管理-新增人物
                {
                    path: '/person-manage/create',
                    name: 'CreatePerson',
                    component: CreatePerson
                },
                // 人物管理-编辑人物
                {
                    path: '/person-manage/edit/:id',
                    name: 'EditPerson',
                    component: EditPerson
                },
                // 人物管理-人物详情
                {
                    path: '/person-manage/display/:id',
                    name: 'DisplayPerson',
                    component: DisplayPerson
                },
                // 人物管理-人物列表
                {
                    path: '/person-manage/list',
                    name: 'PersonList',
                    component: PersonList
                },
                // 节目管理
                // 新增节目
                {
                    path: '/programme-manage/create',
                    name: 'CreateProgramme',
                    component: CreateProgramme
                },
                // 节目管理-编辑节目
                {
                    path: '/progrmme-manage/edit/:id',
                    name: 'EditProgramme',
                    component: EditProgramme
                },
                // 节目管理-节目详情
                {
                    path: '/progrmme-manage/display/:id',
                    name: 'DisplayProgramme',
                    component: DisplayProgramme
                },
                // 节目管理-节目列表
                {
                    path: '/programme-manage/list',
                    name: 'ProgrammeList',
                    component: ProgrammeList
                },
                // 节目类别管理
                {
                    path: '/programme-manage/type',
                    name: 'ProgrammeTypeManage',
                    component: ProgrammeTypeManage
                },
                //  广告管理
                // 广告资源列表
                {
                    path: '/advert-resource/list',
                    name: 'AdvertResourceList',
                    component: AdvertResourceList
                },
                // 开机广告列表
                {
                    path: '/advert-launch/starting/list',
                    name: 'StartingAdvertGroupList',
                    component: StartingAdvertGroupList
                },
                //  前置节目广告列表
                {
                    path: '/advert-launch/preprogramme/list',
                    name: 'PreProgrammeAdvertGroupList',
                    component: PreProgrammeAdvertGroupList
                },
                //  屏保广告列表
                {
                    path: '/advert-launch/screensaver/list',
                    name: 'ScreensaverrammeAdvertGroupList',
                    component: ScreensaverAdvertGroupList
                },
                //  暂停广告列表
                {
                    path: '/advert-launch/pause/list',
                    name: 'PauseAdvertGroupList',
                    component: PauseAdvertGroupList
                },
                //  直播换台广告列表
                {
                    path: '/advert-launch/live/list',
                    name: 'LiveAdvertGroupList',
                    component: LiveAdvertGroupList
                },
                //  音量条广告列表
                {
                    path: '/advert-launch/volumebar/list',
                    name: 'VolumeBarAdvertGroupList',
                    component: VolumeBarAdvertGroupList
                },
                //  弹窗广告列表
                {
                    path: '/advert-launch/dialog/list',
                    name: 'DialogAdvertGroupList',
                    component: DialogAdvertGroupList
                },
                //  详情页广告列表
                {
                    path: '/advert-launch/detailpage/list',
                    name: 'DetailPageAdvertList',
                    component: DetailPageAdvertGroupList
                },
                //  视频管理
                {
                    path: '/video-manage/list',
                    name: 'VideoList',
                    component: VideoList
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

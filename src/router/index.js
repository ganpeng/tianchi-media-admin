import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import './reload';
import Login from 'sysPage/login/Login';
// import Layout from 'sysPage/layout/Layout';
import GlobalLayout from 'sysPage/layout/GlobalLayout';
import Home from 'sysPage/home/Home';
import InfoSetting from 'sysPage/personal_center/InfoSetting';
import MyInfo from 'sysPage/personal_center/MyInfo';
import ModifyPassword from 'sysPage/personal_center/ModifyPassword';
import UserList from 'sysPage/user_center/UserList';
import CreateUser from 'sysPage/user_center/CreateUser';
import EditUserInfo from 'sysPage/user_center/EditUserInfo';
import UserDetailInfo from 'sysPage/user_center/UserDetailInfo';
import Kits from 'sysPage/user_center/Kits';
import AdminList from 'sysPage/admin_manage/AdminList';
import CreateAdmin from 'sysPage/admin_manage/CreateAdmin';
import AdminDetail from 'sysPage/admin_manage/AdminDetail';
import EditAdmin from 'sysPage/admin_manage/EditAdmin';
import ErrorLayout from 'sysPage/error/ErrorLayout';
import ErrorNotFound from 'sysPage/error/404';
import NavBarSetting from 'sysPage/nav_bar_manage/NavBarSetting';
import CreateNavBar from 'sysPage/nav_bar_manage/CreateNavBarForm';
import NavBarLayoutSetting from 'sysPage/nav_bar_manage/NavBarLayoutSetting';
import PersonList from 'sysPage/person_manage/PersonList';
import CreatePerson from 'sysPage/person_manage/CreatePerson';
import EditPerson from 'sysPage/person_manage/EditPerson';
import DisplayPerson from 'sysPage/person_manage/DisplayPerson';
import CreateProgramme from 'sysPage/programme_manage/CreateProgramme';
import ProgrammeTypeManage from 'sysPage/programme_manage/ProgrammeTypeManage';
import EditProgramme from 'sysPage/programme_manage/EditProgramme';
import DisplayProgramme from 'sysPage/programme_manage/DisplayProgramme';
import ProgrammeList from 'sysPage/programme_manage/ProgrammeList';
import AppendProgramme from 'sysPage/layout_manage/AppendProgramme';
import AppendSingleSubject from 'sysPage/layout_manage/AppendSingleSubject';
import ModelAppendShuffle from 'sysPage/layout_manage/ModelAppendShuffle';
import ModelAppendProgrammeSubject from 'sysPage/layout_manage/ModelAppendProgrammeSubject';
import ModelAppendPersonSubject from 'sysPage/layout_manage/ModelAppendPersonSubject';
// 专题模块
import CreateProgrammeSubject from 'sysPage/subject_manage/CreateProgrammeSubject';
import CreateFigureSubject from 'sysPage/subject_manage/CreateFigureSubject';
import EditProgrammeSubject from 'sysPage/subject_manage/EditProgrammeSubject';
import EditFigureSubject from 'sysPage/subject_manage/EditFigureSubject';
import ProgrammeSubjectDetail from 'sysPage/subject_manage/ProgrammeSubjectDetail';
import FigureSubjectDetail from 'sysPage/subject_manage/FigureSubjectDetail';
import SubjectList from 'sysPage/subject_manage/SubjectList';
// 广告模块
import StartingAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/StartingAdvertGroupList';
import AdvertResourceList from 'sysPage/advert_manage/advert_resources_manage/AdvertResourceList';
import PreProgrammeAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/PreProgrammeAdvertGroupList';
import ScreensaverAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/ScreensaverAdvertGroupList';
import PauseAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/PauseAdvertGroupList';
import LiveAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/LiveAdvertGroupList';
import VolumeBarAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/VolumeBarAdvertGroupList';
import DialogAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/DialogAdvertGroupList';
import DetailPageAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/DetailPageAdvertGroupList';
import VideoList from 'sysPage/video_manage/VideoList';
import LiveChannelList from 'sysPage/channel_manage/LiveChannelList';
import EditLiveChannelByImportExcel from 'sysPage/channel_manage/EditLiveChannelByImportExcel';
import CarouselChannelList from 'sysPage/channel_manage/carousel_channel_manage/CarouselChannelList';
import CreateCarouselChannel from 'sysPage/channel_manage/carousel_channel_manage/CreateCarouselChannel';
import CreateChannelByImportExcel from 'sysPage/channel_manage/carousel_channel_manage/CreateChannelByImportExcel';
import EditChannelByImportExcel from 'sysPage/channel_manage/carousel_channel_manage/EditChannelByImportExcel';
import CarouselChannelDetail from 'sysPage/channel_manage/carousel_channel_manage/CarouselChannelDetail';
import EditCarouselChannel from 'sysPage/channel_manage/carousel_channel_manage/EditCarouselChannel';
import ChannelCategory from 'sysPage/channel_manage/ChannelCategory';
import ModelAppendChannel from 'sysPage/layout_manage/ModelAppendChannel';
import AppendChannel from 'sysPage/layout_manage/AppendChannel';
import AppendViewChannel from 'sysPage/layout_manage/AppendViewChannel';
import VersionList from 'sysPage/version_manage/VersionList';
import HotPerson from 'sysPage/person_manage/HotPerson';
import PreviewProgrammeList from 'sysPage/channel_manage/PreviewProgrammeList';
import DeviceList from 'sysPage/device_manage/DeviceList';
import DuplicateList from 'sysPage/person_manage/DuplicateList';
import Worktop from 'sysPage/worktop/Worktop';
import ClientLogList from 'sysPage/client_log/ClientLogList';
import Category from 'sysPage/category_manage/Category';
import Search from 'sysPage/search_manage/Search';
import PageLayout from 'sysPage/page_layout/PageLayout';
import CreateDevice from 'sysPage/device_manage/CreateDevice';
import EditDevice from 'sysPage/device_manage/EditDevice';
import CreateLiveChannel from 'sysPage/channel_manage/CreateLiveChannel';
import EditLiveChannel from 'sysPage/channel_manage/EditLiveChannel';
import CreateVersion from 'sysPage/version_manage/CreateVersion';
import ProgrammeImport from 'sysPage/programme_manage/ProgrammeImport';
import PersonImport from 'sysPage/person_manage/PersonImport';
// 角标管理
import CornerMarkIndex from 'sysPage/corner_mark_manage/CornerMarkIndex';
import LiveChannelImport from 'sysPage/channel_manage/LiveChannelImport';
import VideoImport from 'sysPage/video_manage/VideoImport';

//  页面布局
import EditFixedModule from 'sysPage/page_layout/add_edit_module/EditFixedModule';
import PersonModule from 'sysPage/page_layout/add_edit_module/PersonModule';
import EditSpecialModule from 'sysPage/page_layout/add_edit_module/EditSpecialModule';

Vue.use(Router);

// 定义不需要token与权限的页面名称集合
const whitePagesList = ['Login'];

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
        // 网站内容结构
        {
            path: '/layout',
            name: 'GlobalLayout',
            component: GlobalLayout,
            // path: '/layout',
            // name: 'Layout',
            // component: Layout,
            // 首页
            children: [
                {
                    path: '/home',
                    name: 'Home',
                    component: Home
                },
                // 项目小工具，上线时会删除
                {
                    path: '/kits',
                    name: 'Kits',
                    component: Kits
                },
                // 个人中心-我的信息
                {
                    path: '/my-info',
                    name: 'MyInfo',
                    component: MyInfo
                },
                // 个人中心-信息设置页面
                {
                    path: '/info-setting',
                    name: 'InfoSetting',
                    component: InfoSetting
                },
                // 个人中心-修改密码页面
                {
                    path: '/modify-password',
                    name: 'ModifyPassword',
                    component: ModifyPassword
                },
                // 管理员中心——管理员列表页面
                {
                    path: '/manage-admin/list',
                    name: 'AdminList',
                    component: AdminList
                },
                // 管理员管理——创建管理员页面
                {
                    path: '/manage-admin/create',
                    name: 'CreateAdmin',
                    component: CreateAdmin
                },
                // 管理员管理——管理员详情
                {
                    path: '/manage-admin/detail/:id',
                    name: 'AdminDetail',
                    component: AdminDetail
                },
                // 管理员管理——管理员信息编辑
                {
                    path: '/manage-admin/edit/:id',
                    name: 'EditAdmin',
                    component: EditAdmin
                },
                // 用户中心-用户列表页面
                {
                    path: '/user-center/list',
                    name: 'UserList',
                    component: UserList
                },
                // 用户中心-用户创建页面
                {
                    path: '/user-center/create',
                    name: 'CreateUser',
                    component: CreateUser
                },
                // 用户中心-用户编辑页面
                {
                    path: '/user-center/edit/:id',
                    name: 'EditUserInfo',
                    component: EditUserInfo
                },
                // 用户中心-用户详情页面
                {
                    path: '/user-center/detail/:id',
                    name: 'UserDetailInfo',
                    component: UserDetailInfo
                },
                // 内容管理-栏目管理-栏目项设置
                {
                    path: '/nav-bar-manage/setting',
                    name: 'NavBarSetting',
                    component: NavBarSetting
                },
                // 内容管理-栏目管理-新增
                {
                    path: '/nav-bar-manage/create',
                    name: 'CreateNavBar',
                    component: CreateNavBar
                },
                // 内容管理-栏目管理-布局设置
                {
                    path: '/nav-bar-manage/layout-setting/:navBarSignCode/:navBarId',
                    name: 'NavBarLayoutSetting',
                    component: NavBarLayoutSetting
                },
                // 内容管理-栏目管理-节目选择设置
                {
                    path: '/layout-manage/programme/:navBarId/:navBarSignCode/:model/:row/:index/:imageSpec',
                    name: 'AppendProgramme',
                    component: AppendProgramme
                },
                // 内容管理-栏目管理-单个推荐位选择专题
                {
                    path: '/layout-manage/append-single-subject/:navBarId/:navBarSignCode/:model/:row/:index/:imageSpec',
                    name: 'AppendSingleSubject',
                    component: AppendSingleSubject
                },
                // 内容管理-栏目管理-混排模块
                {
                    path: '/layout-manage/model-append-shuffle/:navBarId/:navBarSignCode/:model/:operate',
                    name: 'ModelAppendShuffle',
                    component: ModelAppendShuffle
                },
                // 内容管理-栏目管理-模块推荐位选择节目专题
                {
                    path: '/layout-manage/model-append-programme-subject/:navBarId/:navBarSignCode/:model/:operate',
                    name: 'ModelAppendProgrammeSubject',
                    component: ModelAppendProgrammeSubject
                },
                // 内容管理-栏目管理-模块推荐位选择人物专题
                {
                    path: '/layout-manage/model-append-person-subject/:navBarId/:navBarSignCode/:model/:operate',
                    name: 'ModelAppendPersonSubject',
                    component: ModelAppendPersonSubject
                },
                // 内容管理-栏目管理-单个频道设置
                {
                    path: '/layout-manage/append-channel/:navBarId/:navBarSignCode/:model/:row/:index/:imageSpec',
                    name: 'AppendChannel',
                    component: AppendChannel
                },
                // 内容管理-栏目管理-单个频道设置
                {
                    path: '/layout-manage/append-view-channel/:navBarId/:navBarSignCode',
                    name: 'AppendViewChannel',
                    component: AppendViewChannel
                },
                // 内容管理-栏目管理-模块频道管理
                {
                    path: '/layout-manage/model-append-channel/:navBarId/:navBarSignCode/:model/:operate',
                    name: 'ModelAppendChannel',
                    component: ModelAppendChannel
                },
                // 内容管理-专题管理-新增节目专题
                {
                    path: '/subject-manage/programme/create',
                    name: 'CreateProgrammeSubject',
                    component: CreateProgrammeSubject
                },
                // 内容管理-专题管理-新增人物专题
                {
                    path: '/subject-manage/figure/create',
                    name: 'CreateFigureSubject',
                    component: CreateFigureSubject
                },
                // 内容管理-专题管理-人物专题-编辑
                {
                    path: '/subject-manage/figure/edit/:id',
                    name: 'EditFigureSubject',
                    component: EditFigureSubject
                },
                // 内容管理-专题管理-节目专题-编辑
                {
                    path: '/subject-manage/programme/edit/:id',
                    name: 'EditProgrammeSubject',
                    component: EditProgrammeSubject
                },
                // 内容管理-专题管理-人物专题-详情
                {
                    path: '/subject-manage/figure/detail/:id',
                    name: 'FigureSubjectDetail',
                    component: FigureSubjectDetail
                },
                // 内容管理-专题管理-节目专题-详情
                {
                    path: '/subject-manage/programme/detail/:id',
                    name: 'ProgrammeSubjectDetail',
                    component: ProgrammeSubjectDetail
                },
                // 内容管理-专题管理-专题列表
                {
                    path: '/subject-manage/list',
                    name: 'SubjectList',
                    component: SubjectList
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
                {
                    path: '/person-manage/hot',
                    name: 'HotPerson',
                    component: HotPerson
                },
                {
                    path: '/person-manage/duplicate',
                    name: 'DuplicateList',
                    component: DuplicateList
                },
                {
                    path: '/person-manage/import',
                    name: 'PersonImport',
                    component: PersonImport
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
                    path: '/programme-manage/edit/:id',
                    name: 'EditProgramme',
                    component: EditProgramme
                },
                // 节目管理-节目详情
                {
                    path: '/programme-manage/display/:id',
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
                // 节目导入
                {
                    path: '/programme-manage/import',
                    name: 'ProgrammeImport',
                    component: ProgrammeImport
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
                    path: '/manage-video/list',
                    name: 'VideoList',
                    component: VideoList
                },
                {
                    path: '/manage-video/import',
                    name: 'VideoImport',
                    component: VideoImport
                },
                //  直播频道管理
                {
                    path: '/channel-manage/live/list',
                    name: 'LiveChannelList',
                    component: LiveChannelList
                },
                {
                    path: '/channel-manage/live/create',
                    name: 'CreateLiveChannel',
                    component: CreateLiveChannel
                },
                {
                    path: '/channel-manage/live/edit/:id',
                    name: 'EditLiveChannel',
                    component: EditLiveChannel
                },
                {
                    path: '/channel-manage/live/import',
                    name: 'LiveChannelImport',
                    component: LiveChannelImport
                },
                //  直播频道管理-批量修改
                {
                    path: '/channel-manage/live/import-edit',
                    name: 'EditLiveChannelByImportExcel',
                    component: EditLiveChannelByImportExcel
                },
                {
                    path: '/channel-manage/live/preview/:id',
                    name: 'PreviewProgrammeList',
                    component: PreviewProgrammeList
                },
                // 轮播频道列表
                {
                    path: '/channel-manage/carousel/list',
                    name: 'CarouselChannelList',
                    component: CarouselChannelList
                },
                // 轮播频道-批量创建轮播频道
                {
                    path: '/channel-manage/carousel/import-create/:category',
                    name: 'CreateChannelByImportExcel',
                    component: CreateChannelByImportExcel
                },
                // 轮播频道-创建单个轮播频道
                {
                    path: '/channel-manage/carousel/create',
                    name: 'CreateCarouselChannel',
                    component: CreateCarouselChannel
                },
                // 轮播频道-批量修改轮播频道
                {
                    path: '/channel-manage/carousel/import-edit',
                    name: 'EditChannelByImportExcel',
                    component: EditChannelByImportExcel
                },
                // 轮播频道详情
                {
                    path: '/channel-manage/carousel/detail/:id',
                    name: 'CarouselChannelDetail',
                    component: CarouselChannelDetail
                },
                // 编辑轮播频道
                {
                    path: '/channel-manage/carousel/edit/:id',
                    name: 'EditCarouselChannel',
                    component: EditCarouselChannel
                },
                //  频道类别管理
                {
                    path: '/channel-manage/category',
                    name: 'ChannelCategory',
                    component: ChannelCategory
                },
                //  版本管理
                {
                    path: '/manage-version/list',
                    name: 'VersionList',
                    component: VersionList
                },
                {
                    path: '/manage-version/create',
                    name: 'CreateVersion',
                    component: CreateVersion
                },
                //  设备管理
                {
                    path: '/manage-device/list',
                    name: 'DeviceList',
                    component: DeviceList
                },
                {
                    path: '/manage-device/create',
                    name: 'CreateDevice',
                    component: CreateDevice
                },
                {
                    path: '/manage-device/edit/:id',
                    name: 'EditDevice',
                    component: EditDevice
                },
                //  操作台管理
                {
                    path: '/worktop-manage',
                    name: 'Worktop',
                    component: Worktop
                },
                //  客户端日志管理
                {
                    path: '/clientlog/list',
                    name: 'ClientLogList',
                    component: ClientLogList
                },
                {
                    path: '/category-manage',
                    name: 'Category',
                    component: Category
                },
                {
                    path: '/search-manage',
                    name: 'Search',
                    component: Search
                },
                //  角标管理
                {
                    path: '/corner-mark-manage/index',
                    name: 'CornerMarkIndex',
                    component: CornerMarkIndex
                },
                //  页面布局
                {
                    path: '/page-layout/:navbarId',
                    name: 'PageLayout',
                    component: PageLayout
                },
                {
                    path: '/page-layout/:navbarId/edit-fixed/:index',
                    name: 'EditFixedModule',
                    component: EditFixedModule
                },
                /**
                 *
                    FIGURE
                    SPECIAL
                    FIGURE_SUBJECT
                    PROGRAMME
                    FIGURE_SUBJECT'
                 */
                {
                    path: '/page-layout/:navbarId/add/shuffle/:index'
                },
                {
                    path: '/page-layout/:navbarId/:operator/figure/:index',
                    name: 'PersonModule',
                    component: PersonModule
                },
                {
                    path: '/page-layout/:navbarId/add/special/:index',
                    name: 'EditSpecialModule',
                    component: EditSpecialModule
                },
                {
                    path: '/page-layout/:navbarId/add/figure_subject/:index'
                },
                {
                    path: '/page-layout/:navbarId/add/programme_subject/:index'
                },
                {
                    path: '/page-layout/:navbarId/add/programme/:index'
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
    next();
});

export default router;

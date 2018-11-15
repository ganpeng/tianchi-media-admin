import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import './reload';
import Login from 'sysPage/login/Login';
import Layout from 'sysPage/layout/Layout';
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
import CreateProgrammeSubject from 'sysPage/subject_manage/programme_subject/CreateProgrammeSubject';
import CreatePersonSubject from 'sysPage/subject_manage/person_subject/CreatePersonSubject';
import SubjectList from 'sysPage/subject_manage/SubjectList';
import AdvertResourceList from 'sysPage/advert_manage/advert_resources_manage/AdvertResourceList';
import PersonSubjectDetail from 'sysPage/subject_manage/person_subject/PersonSubjectDetail';
import EditPersonSubject from 'sysPage/subject_manage/person_subject/EditPersonSubjectBasicInfo';
import EditSubjectPersons from 'sysPage/subject_manage/person_subject/EditSubjectPersons';
import ProgrammeSubjectDetail from 'sysPage/subject_manage/programme_subject/ProgrammeSubjectDetail';
import StartingAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/StartingAdvertGroupList';
import EditProgrammeSubject from 'sysPage/subject_manage/programme_subject/EditProgrammeSubjectBasicInfo';
import EditSubjectProgrammes from 'sysPage/subject_manage/programme_subject/EditSubjectProgrammes';
import PreProgrammeAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/PreProgrammeAdvertGroupList';
import ScreensaverAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/ScreensaverAdvertGroupList';
import PauseAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/PauseAdvertGroupList';
import LiveAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/LiveAdvertGroupList';
import VolumeBarAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/VolumeBarAdvertGroupList';
import DialogAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/DialogAdvertGroupList';
import DetailPageAdvertGroupList from 'sysPage/advert_manage/advert_launch_manage/DetailPageAdvertGroupList';
import VideoList from 'sysPage/video_manage/VideoList';
import DownloadVideoList from 'sysPage/video_manage/DownloadVideoList';
import DiffTimeVideoList from 'sysPage/video_manage/DiffTimeVideoList';
import LiveChannelList from 'sysPage/channel_manage/LiveChannelList';
import EditLiveChannelByImportExcel from 'sysPage/channel_manage/EditLiveChannelByImportExcel';
import CarouselChannelList from 'sysPage/channel_manage/carousel_channel_manage/CarouselChannelList';
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
import ProductList from 'sysPage/product_manage/ProductList';
import CreateCategoryProduct from 'sysPage/product_manage/category_product/CreateCategoryProduct';
import EditCategoryProduct from 'sysPage/product_manage/category_product/EditCategoryProduct';
import CreateProgrammeProduct from 'sysPage/product_manage/programme_product/CreateProgrammeProduct';
import EditProgrammeProduct from 'sysPage/product_manage/programme_product/EditProgrammeProduct';
import CreateCarouselProduct from 'sysPage/product_manage/carousel_product/CreateCarouselProduct';
import EditCarouselProduct from 'sysPage/product_manage/carousel_product/EditCarouselProduct';
import CreateRecordProduct from 'sysPage/product_manage/record_product/CreateRecordProduct';
import EditRecordProduct from 'sysPage/product_manage/record_product/EditRecordProduct';
import CategoryProductDetail from 'sysPage/product_manage/category_product/CategoryProductDetail';
import ProgrammeProductDetail from 'sysPage/product_manage/programme_product/ProgrammeProductDetail';
import CarouselProductDetail from 'sysPage/product_manage/carousel_product/CarouselProductDetail';
import RecordProductDetail from 'sysPage/product_manage/record_product/RecordProductDetail';
import DuplicateList from 'sysPage/person_manage/DuplicateList';

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
            name: 'Layout',
            component: Layout,
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
                    path: '/personal-center/my-info',
                    name: 'MyInfo',
                    component: MyInfo
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
                    path: '/manage-video/list',
                    name: 'VideoList',
                    component: VideoList
                },
                //  视频下载列表
                {
                    path: '/manage-video/download-list',
                    name: 'DownloadVideoList',
                    component: DownloadVideoList
                },
                //  视频管理-检查视频时长
                {
                    path: '/manage-video/diff-list',
                    name: 'DiffTimeVideoList',
                    component: DiffTimeVideoList
                },
                //  直播频道管理
                {
                    path: '/channel-manage/live/list',
                    name: 'LiveChannelList',
                    component: LiveChannelList
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
                //  设备管理
                {
                    path: '/manage-device/list',
                    name: 'DeviceList',
                    component: DeviceList
                },
                //  产品管理-产品包列表
                {
                    path: '/product-manage/list',
                    name: 'ProductList',
                    component: ProductList
                },
                //  产品管理-创建类型包
                {
                    path: '/product-manage/create-category',
                    name: 'CreateCategoryProduct',
                    component: CreateCategoryProduct
                },
                //  产品管理-编辑类型包
                {
                    path: '/product-manage/edit-category/:id',
                    name: 'EditCategoryProduct',
                    component: EditCategoryProduct
                },
                //  产品管理-创建节目包
                {
                    path: '/product-manage/create-programme',
                    name: 'CreateProgrammeProduct',
                    component: CreateProgrammeProduct
                },
                //  产品管理-编辑节目包
                {
                    path: '/product-manage/edit-programme/:id',
                    name: 'EditProgrammeProduct',
                    component: EditProgrammeProduct
                },
                //  产品管理-创建轮播频道包
                {
                    path: '/product-manage/create-carousel',
                    name: 'CreateCarouselProduct',
                    component: CreateCarouselProduct
                },
                //  产品管理-编辑轮播频道包
                {
                    path: '/product-manage/edit-carousel/:id',
                    name: 'EditCarouselProduct',
                    component: EditCarouselProduct
                },
                //  产品管理-创建直播回看包
                {
                    path: '/product-manage/create-record',
                    name: 'CreateRecordProduct',
                    component: CreateRecordProduct
                },
                //  产品管理-编辑直播回看包
                {
                    path: '/product-manage/edit-record/:id',
                    name: 'EditRecordProduct',
                    component: EditRecordProduct
                },
                //  产品管理-类别包详情
                {
                    path: '/product-manage/detail-category/:id',
                    name: 'CategoryProductDetail',
                    component: CategoryProductDetail
                },
                //  产品管理-节目包详情
                {
                    path: '/product-manage/detail-programme/:id',
                    name: 'ProgrammeProductDetail',
                    component: ProgrammeProductDetail
                },
                //  产品管理-轮播频道包详情
                {
                    path: '/product-manage/detail-carousel/:id',
                    name: 'CarouselProductDetail',
                    component: CarouselProductDetail
                },
                //  产品管理-直播回看包详情
                {
                    path: '/product-manage/detail-record/:id',
                    name: 'RecordProductDetail',
                    component: RecordProductDetail
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

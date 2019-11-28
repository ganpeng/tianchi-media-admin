import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
import './reload';
import Login from 'sysPage/login/Login';
import ForceResetPassword from 'sysPage/login/ForceResetPassword';
import GlobalLayout from 'sysPage/layout/GlobalLayout';
import Home from 'sysPage/home/Home';
import InfoSetting from 'sysPage/personal_center/InfoSetting';
import MyInfo from 'sysPage/personal_center/MyInfo';
import ModifyPassword from 'sysPage/personal_center/ModifyPassword';
import UserList from 'sysPage/user_manage/UserList';
import UserDetail from 'sysPage/user_manage/UserDetail';
import AdminList from 'sysPage/admin_manage/AdminList';
import CreateAdmin from 'sysPage/admin_manage/CreateAdmin';
import AdminDetail from 'sysPage/admin_manage/AdminDetail';
import EditAdmin from 'sysPage/admin_manage/EditAdmin';
import ErrorLayout from 'sysPage/error/ErrorLayout';
import ErrorNotFound from 'sysPage/error/404';
import NavBarSetting from 'sysPage/nav_bar_manage/NavBarSetting';
import CreateNavBar from 'sysPage/nav_bar_manage/CreateNavBar';
import EditNavBar from 'sysPage/nav_bar_manage/EditNavBar';
import PersonList from 'sysPage/person_manage/PersonList';
import CreatePerson from 'sysPage/person_manage/CreatePerson';
import EditPerson from 'sysPage/person_manage/EditPerson';
import DisplayPerson from 'sysPage/person_manage/DisplayPerson';
import CreateProgramme from 'sysPage/programme_manage/CreateProgramme';
import ProgrammeTypeManage from 'sysPage/programme_manage/ProgrammeTypeManage';
import EditProgramme from 'sysPage/programme_manage/EditProgramme';
import DisplayProgramme from 'sysPage/programme_manage/DisplayProgramme';
import ProgrammeList from 'sysPage/programme_manage/ProgrammeList';
// 专题模块
import CreateProgrammeSubject from 'sysPage/subject_manage/CreateProgrammeSubject';
import CreateFigureSubject from 'sysPage/subject_manage/CreateFigureSubject';
import EditProgrammeSubject from 'sysPage/subject_manage/EditProgrammeSubject';
import EditFigureSubject from 'sysPage/subject_manage/EditFigureSubject';
import ProgrammeSubjectDetail from 'sysPage/subject_manage/ProgrammeSubjectDetail';
import FigureSubjectDetail from 'sysPage/subject_manage/FigureSubjectDetail';
import SubjectList from 'sysPage/subject_manage/SubjectList';
import VideoList from 'sysPage/video_manage/VideoList';
import DownloadVideoList from 'sysPage/video_manage/DownloadVideoList';
import DiffTimeVideoList from 'sysPage/video_manage/DiffTimeVideoList';
import LiveChannelList from 'sysPage/channel_manage/LiveChannelList';
import LiveChannelDetail from 'sysPage/channel_manage/LiveChannelDetail';
import EditLiveChannelByImportExcel from 'sysPage/channel_manage/EditLiveChannelByImportExcel';
import CarouselChannelList from 'sysPage/channel_manage/carousel_channel_manage/CarouselChannelList';
import CreateCarouselChannel from 'sysPage/channel_manage/carousel_channel_manage/CreateCarouselChannel';
import CreateChannelByImportExcel from 'sysPage/channel_manage/carousel_channel_manage/CreateChannelByImportExcel';
import EditChannelByImportExcel from 'sysPage/channel_manage/carousel_channel_manage/EditChannelByImportExcel';
import CarouselChannelDetail from 'sysPage/channel_manage/carousel_channel_manage/CarouselChannelDetail';
import EditCarouselChannel from 'sysPage/channel_manage/carousel_channel_manage/EditCarouselChannel';
// 插播系统
import InterCutList from 'sysPage/channel_manage/inter_cut_manage/InterCutList';
import CreateInterCut from 'sysPage/channel_manage/inter_cut_manage/CreateInterCut';
import EditInterCut from 'sysPage/channel_manage/inter_cut_manage/EditInterCut';
import InterCutDetail from 'sysPage/channel_manage/inter_cut_manage/InterCutDetail';
import ChannelCategory from 'sysPage/channel_manage/ChannelCategory';
import VersionList from 'sysPage/version_manage/VersionList';
import VersionDetail from 'sysPage/version_manage/VersionDetail';
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
import Worktop from 'sysPage/worktop/Worktop';
import ClientLogList from 'sysPage/client_log/ClientLogList';
// 商品
import GoodsList from 'sysPage/goods_manage/GoodsList';
import GoodsDetail from 'sysPage/goods_manage/GoodsDetail';
import CreateGoods from 'sysPage/goods_manage/CreateGoods';
import EditGoods from 'sysPage/goods_manage/EditGoods';
// 部门
import DepartmentList from 'sysPage/department_manage/DepartmentList';
import DepartmentDetail from 'sysPage/department_manage/DepartmentDetail';
import CreateDepartment from 'sysPage/department_manage/CreateDepartment';
import EditDepartment from 'sysPage/department_manage/EditDepartment';
// 角色
import RoleList from 'sysPage/role_manage/RoleList';
import RoleDetail from 'sysPage/role_manage/RoleDetail';
import CreateRole from 'sysPage/role_manage/CreateRole';
import EditRole from 'sysPage/role_manage/EditRole';
// 套餐
import ComboList from 'sysPage/combo_manage/ComboList';
import ComboDetail from 'sysPage/combo_manage/ComboDetail';
import CreateCombo from 'sysPage/combo_manage/CreateCombo';
import EditCombo from 'sysPage/combo_manage/EditCombo';
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
import PersonSubjectModule from 'sysPage/page_layout/add_edit_module/PersonSubjectModule';
import ShuffleModule from 'sysPage/page_layout/add_edit_module/ShuffleModule';
import ProgrammeSubjectModule from 'sysPage/page_layout/add_edit_module/ProgrammeSubjectModule';
import SiteList from 'sysPage/site_manage/SiteList';
import ConfigSite from 'sysPage/site_manage/ConfigSite';

//  广告主
import AdvertisingOwnerList from 'sysPage/advertising_manage/advertising_owner/AdvertisingOwnerList';
import AddAdvertisingOwner from 'sysPage/advertising_manage/advertising_owner/AddAdvertisingOwner';
import EditAdvertisingOwner from 'sysPage/advertising_manage/advertising_owner/EditAdvertisingOwner';
import DisplayAdvertisingOwner from 'sysPage/advertising_manage/advertising_owner/DisplayAdvertisingOwner';
import ADList from 'sysPage/advertising_manage/ad_manage/ADList';
import CreateBootAD from 'sysPage/advertising_manage/ad_manage/CreateBootAD';
import EditBootAD from 'sysPage/advertising_manage/ad_manage/EditBootAD';
import CreatePauseAD from 'sysPage/advertising_manage/ad_manage/CreatePauseAD';
import EditPauseAD from 'sysPage/advertising_manage/ad_manage/EditPauseAD';
import CreatePrepositionAD from 'sysPage/advertising_manage/ad_manage/CreatePrepositionAD';
import EditPrepositionAD from 'sysPage/advertising_manage/ad_manage/EditPrepositionAD';
import CreateVolumeAD from 'sysPage/advertising_manage/ad_manage/CreateVolumeAD';
import EditVolumeAD from 'sysPage/advertising_manage/ad_manage/EditVolumeAD';
import CreateScreenSaverAD from 'sysPage/advertising_manage/ad_manage/CreateScreenSaverAD';
import EditScreenSaverAD from 'sysPage/advertising_manage/ad_manage/EditScreenSaverAD';
import CreateChannelSwitchAD from 'sysPage/advertising_manage/ad_manage/CreateChannelSwitchAD';
import EditChannelSwitchAD from 'sysPage/advertising_manage/ad_manage/EditChannelSwitchAD';
import CreateProgrammeDetailAD from 'sysPage/advertising_manage/ad_manage/CreateProgrammeDetailAD';
import EditProgrammeDetailAD from 'sysPage/advertising_manage/ad_manage/EditProgrammeDetailAD';
import ADDetail from 'sysPage/advertising_manage/ad_manage/ADDetail';
// 订单管理
import OrderList from 'sysPage/order_manage/OrderList';
import OrderDetail from 'sysPage/order_manage/OrderDetail';
import ServerSpace from 'sysPage/server_manage/ServerSpace';

Vue.use(Router);

// 定义不需要token与权限的页面名称集合
const whitePagesList = ['Login'];

// 定义路由

export const routes = [
    // 登录页面
    {
        path: '/',
        alias: '/login',
        name: 'Login',
        component: Login
    },
    // 强制更改密码页面
    {
        path: '/force-reset-password',
        name: 'ForceResetPassword',
        component: ForceResetPassword
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
    //  直播频道管理-批量修改
    {
        path: '/channel-manage/live/import-edit',
        name: 'EditLiveChannelByImportExcel',
        component: EditLiveChannelByImportExcel
    },
    // 视频导入
    {
        path: '/manage-video/import',
        name: 'VideoImport',
        component: VideoImport
    },
    // 节目导入
    {
        path: '/programme-manage/import',
        name: 'ProgrammeImport',
        component: ProgrammeImport
    },
    // 人物导入
    {
        path: '/person-manage/import',
        name: 'PersonImport',
        component: PersonImport
    },
    {
        path: '/channel-live/import',
        name: 'LiveChannelImport',
        component: LiveChannelImport
    },
    // 网站内容结构
    {
        path: '/layout',
        name: 'GlobalLayout',
        component: GlobalLayout,
        // 首页
        children: [
            {
                path: '/home',
                name: 'Home',
                component: Home
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
            // 服务器存储空间
            {
                path: '/server/space',
                name: 'ServerSpace',
                component: ServerSpace
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
            // 用户中心-用户详情页面
            {
                path: '/user-center/detail/:id',
                name: 'UserDetail',
                component: UserDetail
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
            // 内容管理-栏目管理-编辑
            {
                path: '/nav-bar-manage/edit/:id',
                name: 'EditNavBar',
                component: EditNavBar
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
            //  广告管理
            // 广告主列表
            {
                path: '/adsowner-manage/list',
                name: 'AdvertisingOwnerList',
                component: AdvertisingOwnerList
            },
            // 新增广告主资源
            {
                path: '/adsowner-manage/add',
                name: 'AddAdvertisingOwner',
                component: AddAdvertisingOwner
            },
            // 编辑广告主资源
            {
                path: '/adsowner-manage/edit/:id',
                name: 'EditAdvertisingOwner',
                component: EditAdvertisingOwner
            },
            // 显示广告主资源
            {
                path: '/adsowner-manage/display/:id',
                name: 'DisplayAdvertisingOwner',
                component: DisplayAdvertisingOwner
            },
            // 广告列表
            {
                path: '/ads-manage/list',
                name: 'ADList',
                component: ADList
            },
            // 创建开机广告
            {
                path: '/ads-manage/create-boot-ad',
                name: 'CreateBootAD',
                component: CreateBootAD
            },
            // 编辑开机广告
            {
                path: '/ads-manage/edit-boot-ad/:id',
                name: 'EditBootAD',
                component: EditBootAD
            },
            // 创建暂停广告
            {
                path: '/ads-manage/create-pause-ad',
                name: 'CreatePauseAD',
                component: CreatePauseAD
            },
            // 编辑暂停广告
            {
                path: '/ads-manage/edit-pause-ad/:id',
                name: 'EditPauseAD',
                component: EditPauseAD
            },
            // 创建片头广告
            {
                path: '/ads-manage/create-preposition-ad',
                name: 'CreatePrepositionAD',
                component: CreatePrepositionAD
            },
            // 编辑片头广告
            {
                path: '/ads-manage/edit-preposition-ad/:id',
                name: 'EditPrepositionAD',
                component: EditPrepositionAD
            },
            // 创建音量条广告
            {
                path: '/ads-manage/create-volume-ad',
                name: 'CreateVolumeAD',
                component: CreateVolumeAD
            },
            // 编辑音量条广告
            {
                path: '/ads-manage/edit-volume-ad/:id',
                name: 'EditVolumeAD',
                component: EditVolumeAD
            },
            // 创建屏保广告
            {
                path: '/ads-manage/create-screen-saver-ad',
                name: 'CreateScreenSaverAD',
                component: CreateScreenSaverAD
            },
            // 编辑屏保广告
            {
                path: '/ads-manage/edit-screen-saver-ad/:id',
                name: 'EditScreenSaverAD',
                component: EditScreenSaverAD
            },
            // 创建节目详情广告
            {
                path: '/ads-manage/create-programme-detail-ad',
                name: 'CreateProgrammeDetailAD',
                component: CreateProgrammeDetailAD
            },
            // 编辑节目详情广告
            {
                path: '/ads-manage/edit-programme-detail-ad/:id',
                name: 'EditProgrammeDetailAD',
                component: EditProgrammeDetailAD
            },
            // 创建换台广告
            {
                path: '/ads-manage/create-channel-switch-ad',
                name: 'CreateChannelSwitchAD',
                component: CreateChannelSwitchAD
            },
            // 编辑换台广告
            {
                path: '/ads-manage/edit-channel-switch-ad/:id',
                name: 'EditChannelSwitchAD',
                component: EditChannelSwitchAD
            },
            // 广告详情
            {
                path: '/ads-manage/ad-detail/:id',
                name: 'ADDetail',
                component: ADDetail
            },
            // 视频管理
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
                path: '/channel-live/list',
                name: 'LiveChannelList',
                component: LiveChannelList
            },
            {
                path: '/channel-live/create',
                name: 'CreateLiveChannel',
                component: CreateLiveChannel
            },
            {
                path: '/channel-live/edit/:id',
                name: 'EditLiveChannel',
                component: EditLiveChannel
            },
            {
                path: '/channel-live/display/:id',
                name: 'LiveChannelDetail',
                component: LiveChannelDetail
            },
            {
                path: '/channel-live/preview/:id',
                name: 'PreviewProgrammeList',
                component: PreviewProgrammeList
            },
            // 轮播频道列表
            {
                path: '/channel-carousel/list',
                name: 'CarouselChannelList',
                component: CarouselChannelList
            },
            // 轮播频道-创建单个轮播频道
            {
                path: '/channel-carousel/create',
                name: 'CreateCarouselChannel',
                component: CreateCarouselChannel
            },
            // 轮播频道详情
            {
                path: '/channel-carousel/detail/:id',
                name: 'CarouselChannelDetail',
                component: CarouselChannelDetail
            },
            // 编辑轮播频道
            {
                path: '/channel-carousel/edit/:id',
                name: 'EditCarouselChannel',
                component: EditCarouselChannel
            },
            // 插播频道列表
            {
                path: '/channel-inter-cut/list',
                name: 'InterCutList',
                component: InterCutList
            },
            // 创建插播频道
            {
                path: '/channel-inter-cut/create',
                name: 'CreateInterCut',
                component: CreateInterCut
            },
            // 编辑插播频道
            {
                path: '/channel-inter-cut/edit/:id',
                name: 'EditInterCut',
                component: EditInterCut
            },
            // 插播频道详情
            {
                path: '/channel-inter-cut/detail/:id',
                name: 'InterCutDetail',
                component: InterCutDetail
            },
            //  频道类别管理
            {
                path: '/channel-category',
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
            {
                path: '/manage-version/edit/:id',
                name: 'EditVersion',
                component: () => import('@/page/version_manage/EditVersion')
            },
            {
                path: '/manage-version/edit-released/:id',
                name: 'EditVersionReleased',
                component: () => import('@/page/version_manage/EditVersionReleased')
            },
            {
                path: '/manage-version/display/:id',
                name: 'VersionDetail',
                component: VersionDetail
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
                path: '/page-layout/:navbarId/:operator/figure/:index',
                name: 'PersonModule',
                component: PersonModule
            },
            {
                path: '/page-layout/:navbarId/:operator/special/:index',
                name: 'EditSpecialModule',
                component: EditSpecialModule
            },
            {
                path: '/page-layout/:navbarId/:operator/figure_subject/:index',
                name: 'PersonSubjectModule',
                component: PersonSubjectModule
            },
            {
                path: '/page-layout/:navbarId/:operator/shuffle/:index',
                name: 'ShuffleModule',
                component: ShuffleModule
            },
            {
                path: '/page-layout/:navbarId/:operator/programme_subject/:index',
                name: 'ProgrammeSubjectModule',
                component: ProgrammeSubjectModule
            },
            {
                path: '/page-layout/:navbarId/add/programme/:index'
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
            },
            //  商品管理-商品列表
            {
                path: '/goods-manage/list',
                name: 'GoodsList',
                component: GoodsList
            },
            //  商品管理-商品详情
            {
                path: '/goods-manage/detail/:id',
                name: 'GoodsDetail',
                component: GoodsDetail
            },
            //  商品管理-创建商品
            {
                path: '/goods-manage/create',
                name: 'CreateGoods',
                component: CreateGoods
            },
            //  商品管理-编辑商品
            {
                path: '/goods-manage/edit/:id',
                name: 'EditGoods',
                component: EditGoods
            },
            //  套餐管理-套餐列表
            {
                path: '/combo-manage/list',
                name: 'ComboList',
                component: ComboList
            },
            //  套餐管理-套餐详情
            {
                path: '/combo-manage/detail/:id',
                name: 'ComboDetail',
                component: ComboDetail
            },
            //  套餐管理-套餐商品
            {
                path: '/combo-manage/create',
                name: 'CreateCombo',
                component: CreateCombo
            },
            //  套餐管理-套餐商品
            {
                path: '/combo-manage/edit/:id',
                name: 'EditCombo',
                component: EditCombo
            },
            //  套餐管理-套餐图管理
            {
                path: '/combopicture-manage/list',
                name: 'ComboPicture',
                component: () => import('@/page/combo_manage/ComboPicture')
            },
            //  站点管理-配置站点
            {
                path: '/site-manage/config',
                name: 'ConfigSite',
                component: ConfigSite
            },
            //  站点管理-站点列表
            {
                path: '/site-manage/list',
                name: 'SiteList',
                component: SiteList
            },
            //  订单管理
            {
                path: '/order-manage/list',
                name: 'OrderList',
                component: OrderList
            },
            //  订单详情
            {
                path: '/order-manage/detail/:id',
                name: 'OrderDetail',
                component: OrderDetail
            },
            //  部门管理-部门列表
            {
                path: '/department-manage/list',
                name: 'DepartmentList',
                component: DepartmentList
            },
            //  部门管理-部门详情
            {
                path: '/department-manage/detail/:id',
                name: 'DepartmentDetail',
                component: DepartmentDetail
            },
            //  部门管理-创建部门
            {
                path: '/department-manage/create',
                name: 'CreateDepartment',
                component: CreateDepartment
            },
            //  部门管理-编辑部门
            {
                path: '/department-manage/edit/:id',
                name: 'EditDepartment',
                component: EditDepartment
            },
            //  角色管理-角色列表
            {
                path: '/role-manage/list',
                name: 'RoleList',
                component: RoleList
            },
            //  角色管理-角色详情
            {
                path: '/role-manage/detail/:id',
                name: 'RoleDetail',
                component: RoleDetail
            },
            //  角色管理-创建角色
            {
                path: '/role-manage/create',
                name: 'CreateRole',
                component: CreateRole
            },
            //  角色管理-编辑角色
            {
                path: '/role-manage/edit/:id',
                name: 'EditRole',
                component: EditRole
            }
        ]
    },
    // 错误页面布局
    {
        path: '/error-layout',
        name: 'ErrorLayout',
        component:
        ErrorLayout,
        // 404页面
        children:
            [
                {
                    path: '/error/404',
                    name: 'ErrorNotFound',
                    component: ErrorNotFound
                }
            ]
    }
];

export const appRoutes = [
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
        // 首页
        children: [
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
            // 内容管理-栏目管理-编辑
            {
                path: '/nav-bar-manage/edit/:id',
                name: 'EditNavBar',
                component: EditNavBar
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
            {
                path: '/manage-version/edit/:id',
                name: 'EditVersion',
                component: () => import('@/page/version_manage/EditVersion')
            },
            {
                path: '/manage-version/edit-released/:id',
                name: 'EditVersionReleased',
                component: () => import('@/page/version_manage/EditVersionReleased')
            },
            {
                path: '/manage-version/display/:id',
                name: 'VersionDetail',
                component: VersionDetail
            },
            //  页面布局
            {
                path: '/app-page-layout/:navbarId',
                name: 'AppPageLayout',
                component: () => import('@/page/app/page_layout/AppPageLayout')
            },
            {
                path: '/page-layout/:navbarId/edit-fixed/:index',
                name: 'EditFixedModule',
                component: EditFixedModule
            }
        ]
    },
    // 错误页面布局
    {
        path: '/error-layout',
        name: 'ErrorLayout',
        component:
        ErrorLayout,
        // 404页面
        children: [
            {
                path: '/error/404',
                name: 'ErrorNotFound',
                component: ErrorNotFound
            }
        ]
    }
];

const router = new Router({
    mode: 'history',
    routes
});

export const createRouter = routes => new Router({
    mode: 'history',
    routes
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
        // 如果重置密码reset为1，需要强制重置密码
        if (parseInt(store.state.user.reset) === 1 && to.name !== 'ForceResetPassword') {
            next({name: 'ForceResetPassword'});
        } else {
            next({name: 'Home'});
        }
        // 非白名单且不存在token，跳转到登录页面
    } else if (!store.state.user.token) {
        next({name: 'Login'});
        // 非白名单、存在token、存在跳转路由，直接跳转
    } else if (to.name) {
        // 如果重置密码reset为1，需要强制重置密码
        if (parseInt(store.state.user.reset) === 1 && to.name !== 'ForceResetPassword') {
            next({name: 'ForceResetPassword'});
        } else {
            next();
        }
        // 非白名单、存在token、不存在跳转路由，跳转到404页面
    } else {
        // 如果重置密码reset为1，需要强制重置密码
        if (parseInt(store.state.user.reset) === 1 && to.name !== 'ForceResetPassword') {
            next({name: 'ForceResetPassword'});
        } else {
            next({name: 'ErrorNotFound'});
        }
    }
    next();
});

export default router;

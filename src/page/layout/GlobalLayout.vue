<template>
    <div class="app-container">
        <div v-show="showHeaderAndAside" class="header clearfix">
            <ul class="nav-list clearfix float-left" :class="{'is-center-site': (isCenterSite && !appActive)}">
                <li v-for="(item, index) in activeNavList" :key="index"
                    :class="['nav-item', active === index ? 'active' : '']"
                    @click="changeActive(index)">
                    {{item.title}}
                </li>
            </ul>
            <div :class="[active === navList.length - 1 ? 'active' : '']"
                 class="user-info float-right clearfix">
                <svg-icon icon-class="avatar_icon"></svg-icon>
                <svg-icon icon-class="avatar_icon_active"></svg-icon>
                <label @click="changeActive(navList.length - 1)">{{name}}</label>
                <div class="logout" @click="logout">
                    <svg-icon
                        icon-class="logout">
                    </svg-icon>
                </div>
            </div>
            <div v-if="!appActive" class="float-right">
                <el-button
                    type="text"
                    class="site-name"
                    @click="toConfigSite">
                    {{siteName ? siteName:'站点未配置，点击配置'}}
                </el-button>
            </div>
        </div>
        <div v-show="showHeaderAndAside" class="aside">
            <div class="logo">
                <span @click="toggleTvApp(false)" :class="['tv-btn', !appActive && 'active']">
                    <svg-icon v-if="appActive" icon-class="tv_icon"></svg-icon>
                    <svg-icon v-else icon-class="tv_icon_active"></svg-icon>
                </span>
                <span @click="toggleTvApp(true)" :class="['app-btn', appActive && 'active']">
                    <svg-icon v-if="appActive" icon-class="app_icon_active"></svg-icon>
                    <svg-icon v-else icon-class="app_icon"></svg-icon>
                </span>
            </div>
            <div class="aside-list">
                <ul class="el-menu">
                    <li v-for="(item, index) in activeAsideList"
                        :key="index"
                        @click="menuChangeHandler(item)"
                        :class="['el-menu-item', defaultActive === item.uri && 'is-active']">
                        <svg-icon
                            :icon-class="item.icon">
                        </svg-icon>
                        <span class="title">{{item.text}}</span>
                    </li>
                </ul>
            </div>
            <div class="left-bottom-logo">
                <svg-icon icon-class="left_bottom_logo"></svg-icon>
            </div>
        </div>
        <div :style="contentStyleStr()" id="global-content" class="content">
            <div class="content-wrapper" :style="`min-height: ${minHeight}px`">
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';
    import _ from 'lodash';
    import store from 'store';
    import role from '@/util/config/role';

    export default {
        data() {
            return {
                layoutId: '',
                active: 0,
                defaultActive: '',
                minHeight: 400,
                top: 60,
                left: 200,
                showHeaderAndAside: true,
                isCenterSite: !!(this.$wsCache.localStorage.get('siteInfo') && this.$wsCache.localStorage.get('siteInfo').siteMasterEnable),
                siteName: '',
                // dev_v2.6
                appActive: false
            };
        },
        watch: {
            $route(to, from) {
                let {active, activePath} = this.getActivePath();
                this.active = active;
                this.defaultActive = activePath;
            }
        },
        computed: {
            ...mapGetters({
                name: 'user/name'
            }),
            navList() {
                let isCenterSite = !!(this.$wsCache.localStorage.get('siteInfo') && this.$wsCache.localStorage.get('siteInfo').siteMasterEnable);
                let centerNavList = role.NAV_LIST.filter((item) => item.status === 0 || item.status === 1);
                let childNavList = role.NAV_LIST.filter((item) => item.status === 0 || item.status === 2);
                let navList = isCenterSite ? centerNavList : childNavList;
                return this.appActive ? role.APP_NAV_LIST : navList;
            },
            activeNavList() {
                return this.navList.filter((_, index) => index !== this.navList.length - 1);
            },
            activeAsideList() {
                return this.navList[this.active].children;
            }
        },
        mounted() {
        },
        async created() {
            try {
                await this.$nextTick();
                let content = document.querySelector('.content-wrapper');
                content.addEventListener('scroll', this.$util.toggleFixedBtnContainer.bind(this), false);

                let isApp = store.get('isApp');
                this.appActive = isApp;
                //  菜单初始化
                if (this.appActive) {
                    await this.appMenuInit();
                } else {
                    await this.menuInit();
                }
                // this.setMinHeight();
                // window.addEventListener('resize', this.setMinHeight, false);
            } catch (err) {
                console.log(err);
            }
            this.initSiteInfo();
        },
        methods: {
            ...mapActions({
                getNavbarList: 'pageLayout/getNavbarList',
                getAppNavbarList: 'appPageLayout/getAppNavbarList'
            }),
            async menuInit() {
                try {
                    let res = await this.getNavbarList();
                    if (res && res.code === 0) {
                        let recomendNavbar = res.data.find((item) => item.isDefault);
                        this.layoutId = _.get(recomendNavbar, 'id') || _.get(res.data, '2.id');

                        let {active, activePath} = this.getActivePath();
                        this.active = active;
                        this.defaultActive = activePath;
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            async appMenuInit() {
                try {
                    let res = await this.getAppNavbarList();
                    if (res && res.code === 0) {
                        let recomendNavbar = res.data.find((item) => item.name === '推荐');
                        this.layoutId = recomendNavbar.id || _.get(res.data, '2.id');

                        let {active, activePath} = this.getActivePath();
                        this.active = active;
                        this.defaultActive = activePath;
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            initSiteInfo() {
                // 初始化站点名称
                this.$service.getSiteInfo().then(response => {
                    if (response && response.code === 0) {
                        this.siteName = response.data.siteName;
                        this.$wsCache.localStorage.set('siteInfo', response.data);
                    }
                });
            },
            contentStyleStr() {
                return `top: ${this.top}px;left: ${this.left}px;`;
            },
            getActivePath() {
                let {path} = this.$route;
                if (path === '/home') {
                    this.$router.push('/worktop-manage');
                    path = '/worktop-manage';
                }
                let leftPart = path.split('/')[1];
                let active = 0;
                let activePath = '';
                for (let i = 0; i < this.navList.length; i++) {
                    let asideList = this.navList[i].children;
                    for (let j = 0; j < asideList.length; j++) {
                        let {uri} = asideList[j];
                        if (leftPart === uri.split('/')[1]) {
                            active = i;
                            activePath = uri;
                            break;
                        }
                    }
                }
                return {active, activePath};
            },
            changeActive(index) {
                if (index === this.active) {
                    window.location.reload();
                } else {
                    this.active = index;
                    let newPath = this.navList[this.active].children[0].uri;
                    this.defaultActive = newPath;
                    this.$router.push(newPath);
                }
            },
            setMinHeight() {
                let minHeight = window.innerHeight - 60;
                this.minHeight = minHeight;
            },
            logout() {
                this.$store.dispatch('user/logout', true);
            },
            async menuChangeHandler(pathObj) {
                try {
                    let path = _.get(pathObj, 'uri');
                    if (path === '/page-layout' || path === '/app-page-layout') {
                        if (this.appActive) {
                            await this.appMenuInit();
                        } else {
                            await this.menuInit();
                        }
                        path = `${path}/${this.layoutId}`;
                        this.$router.push({path});
                    } else {
                        this.$router.push({path});
                    }
                } catch (err) {
                    console.log(err);
                }
            },
            // 如果是子站，点击跳转到设置子站点页面;中心站点跳转到站点列表
            toConfigSite() {
                if (this.$wsCache.localStorage.get('siteInfo') && !this.$wsCache.localStorage.get('siteInfo').siteMasterEnable) {
                    this.$router.push({name: 'ConfigSite'});
                } else {
                    this.$router.push({name: 'SiteList'});
                }
            },
            //  dev_v2.6
            toggleTvApp(flag) {
                store.set('isApp', flag);
                this.appActive = flag;
                if (flag) {
                    if (!this.$authority.isHasAuthority('app:all')) {
                        return false;
                    } else {
                        this.$router.push({path: `/app-nav-bar-manage/setting`});
                    }
                } else {
                    this.$router.push({path: `/worktop-manage`});
                }
            },
            gotoUserCenter() {
                this.$router.push({name: 'MyInfo'});
            }
        }
    };
</script>

<style lang="scss" scoped>
    .app-container {
        position: relative;
        width: 100%;
        height: 100%;
        .header {
            position: absolute;
            top: 0;
            left: 200px;
            right: 0;
            height: $headerHeight;
            background: $headerBg;
            color: $navText;
            .nav-list {
                line-height: $headerHeight;
                padding-left: 80px;
                .nav-item {
                    float: left;
                    min-width: 110px;
                    text-align: center;
                    // padding: 0 12px;
                    cursor: pointer;
                    font-size: 20px;
                    color: $navText;
                    &:hover {
                        background: $headerNavHoverBg;
                    }
                    &.active {
                        color: #fff;
                        background: #0062C4;
                    }
                }
            }
            .user-info {
                position: relative;
                align-items: center;
                width: 184px;
                height: 60px;
                line-height: $headerHeight;
                margin-right: 20px;
                cursor: pointer;
                > .svg-icon {
                    position: absolute;
                    top: 50%;
                    left: 0;
                    transform: translateY(-50%);
                    width: 40px;
                    height: 40px;
                    z-index: 10;
                }
                label {
                    position: absolute;
                    top: 50%;
                    left: 0;
                    transform: translateY(-50%);
                    width: 140px;
                    height: 40px;
                    line-height: 40px;
                    border-radius: 20px;
                    background: rgba(255, 255, 255, 0.10);
                    font-size: 14px;
                    color: $navText;
                    text-align: center;
                    text-indent: 40px;
                    cursor: pointer;
                    &:hover {
                        background: $headerNavHoverBg;
                        color: #fff;
                    }
                }
                .svg-icon-avatar_icon {
                    display: block;
                }
                .svg-icon-avatar_icon_active {
                    display: none;
                }
                &.active {
                    label {
                        background: #0062C4;
                        color: #fff;
                    }
                    .svg-icon-avatar_icon {
                        display: none;
                    }
                    .svg-icon-avatar_icon_active {
                        display: block;
                    }
                }
                .logout {
                    position: absolute;
                    top: 50%;
                    right: 0;
                    width: 24px;
                    height: 24px;
                    transform: translateY(-50%);
                    color: #fff;
                    line-height: 60px;
                    cursor: pointer;
                    .svg-icon {
                        position: absolute;
                        left: 0;
                        fill: #6F7480;
                        width: 24px;
                        height: 24px;
                        &:hover {
                            fill: #C35757;
                        }
                    }
                }
            }
        }
        .aside {
            position: absolute;
            top: 0;
            left: 0px;
            bottom: 0px;
            width: 200px;
            background-image: linear-gradient(90deg, #152036 0%, #252F46 100%);
            .logo {
                display: flex;
                justify-content: space-around;
                align-items: center;
                width: 200px;
                height: $headerHeight;
                background-color: #0F1623;
                span {
                    flex: 1;
                    height: $headerHeight;
                    line-height: $headerHeight;
                    cursor: pointer;
                    &:hover {
                        background-color: #000;
                    }
                }
                .app-btn {
                    &.active {
                        background: #0062C4;
                    }
                    .svg-icon {
                        width: 14px;
                        height: 20px;
                        fill: #6F7480;
                    }
                }
                .tv-btn {
                    &.active {
                        background: $mainColor;
                    }
                    .svg-icon {
                        width: 20px;
                        height: 16px;
                        fill: #6F7480;
                    }
                }
            }
            .left-bottom-logo {
                position: absolute;
                bottom: 0;
                left: 0;
                .svg-icon {
                    width: 200px;
                    height: 140px;
                }
            }
        }
        .content {
            position: absolute;
            top: $headerHeight;
            left: 200px;
            right: 0px;
            bottom: 0px;
            background: $contentBg;
            .content-wrapper {
                overflow: scroll;
                height: 100%;
                padding: 20px 20px 100px 20px;
            }
        }
    }

    .el-menu {
        border-right: none;
        background: transparent;
    }

    .aside-list {
        margin-top: 50px;
        .el-menu-item {
            display: flex;
            align-items: center;
            height: 50px;
            line-height: 50px;
            font-size: 20px;
            color: $navText;
            padding-left: 30px !important;
            text-align: left;
            border-left: 4px solid transparent;
            background: transparent;
            .svg-icon {
                fill: $navText;
                margin-right: 20px;
                width: 30px;
                height: 30px;
            }
            &:hover {
                background: #0A1730 !important;
            }
            &.is-active {
                background: #0A1730 !important;
                border-left: 4px solid $mainColor;
                .svg-icon {
                    fill: $headerNavActiveText;
                }
                .title {
                    color: #fff;
                }
            }
        }
    }

    .site-name {
        margin-top: 20px;
        margin-right: 20px;
    }

</style>

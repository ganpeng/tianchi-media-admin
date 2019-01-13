<template>
    <div class="app-container">
        <div v-show="showHeaderAndAside" class="header clearfix">
            <ul class="nav-list clearfix float-left" :class="{'is-center-site' :isCenterSite}">
                <li v-if="index !== navList.length - 1" v-for="(item, index) in navList" :key="index"
                    :class="['nav-item', active === index ? 'active' : '']"
                    @click="changeActive(index)">
                    {{item}}
                </li>
            </ul>
            <div :class="[active === navList.length - 1 ? 'active' : '']"
                 class="user-info float-right clearfix">
                <svg-icon
                    icon-class="avatar_icon">
                </svg-icon>
                <label @click="changeActive(navList.length - 1)">{{name}}</label>
                <div class="logout" @click="logout">
                    <svg-icon
                        icon-class="logout">
                    </svg-icon>
                </div>
            </div>
            <div class="float-right">
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
                <svg-icon icon-class="aside_logo"></svg-icon>
            </div>
            <ul class="aside-list">
                <li v-if="index === active" v-for="(asides, index) in asideList" :key="index" class="aside-item">
                    <el-menu
                        :default-active="defaultActive"
                        class="el-menu-vertical-demo"
                        background-color="transparent"
                        text-color="#6a707c"
                        active-text-color="#fff">
                        <el-menu-item
                            v-for="(item, innerIndex) in asides"
                            :key="innerIndex"
                            :index="item.uri"
                            @click="menuChangeHandler(item)">
                            <svg-icon
                                :icon-class="item.icon">
                            </svg-icon>
                            <span slot="title">{{item.text}}</span>
                        </el-menu-item>
                    </el-menu>
                </li>
            </ul>
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
    import role from '@/util/config/role';

    export default {
        data() {
            return {
                navList: role.NAV_LIST,
                asideList: role.ASIDE_LIST,
                layoutId: '',
                active: 0,
                defaultActive: '',
                minHeight: 400,
                top: 60,
                left: 200,
                showHeaderAndAside: true,
                isCenterSite: !!(this.$wsCache.localStorage.get('siteInfo') && this.$wsCache.localStorage.get('siteInfo').siteMasterEnable),
                siteName: ''
            };
        },
        computed: {
            ...mapGetters({
                name: 'user/name'
            })
        },
        mounted() {
            let content = document.querySelector('.content');
            content.addEventListener('scroll', this.toggleFixedBtnContainer.bind(this), false);
        },
        async created() {
            try {
                let {active, activePath} = this.getActivePath();
                this.active = active;
                this.defaultActive = activePath;
                this.setMinHeight();
                window.addEventListener('resize', this.setMinHeight, false);
                // this.hideHeaderAndAside();
                let res = await this.getNavbarList();
                if (res && res.code === 0) {
                    let recomendNavbar = res.data.find((item) => item.name === '推荐');
                    this.layoutId = recomendNavbar.id || _.get(res.data, '2.id');
                }
            } catch (err) {
                console.log(err);
            }
            this.initSiteInfo();
        },
        methods: {
            ...mapActions({
                getNavbarList: 'pageLayout/getNavbarList'
            }),
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
                for (let i = 0; i < this.asideList.length; i++) {
                    for (let j = 0; j < this.asideList[i].length; j++) {
                        let {uri} = this.asideList[i][j];
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
                    let newPath = this.asideList[this.active][0].uri;
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
            hideHeaderAndAside() {
                let allowList = ['ProgrammeImport', 'PersonImport', 'LiveChannelImport', 'VideoImport'];
                let {name} = this.$route;
                if (allowList.indexOf(name) > -1) {
                    this.top = 0;
                    this.left = 0;
                    this.showHeaderAndAside = false;
                } else {
                    this.top = 60;
                    this.left = 200;
                    this.showHeaderAndAside = true;
                }
            },
            toggleFixedBtnContainer() {
                let content = document.querySelector('.content');
                let fixedBtnContainer = document.querySelector('.fixed-btn-container');
                let isBottom = content.scrollHeight - content.scrollTop === content.clientHeight;
                if (fixedBtnContainer) {
                    if (isBottom) {
                        fixedBtnContainer.style.background = 'transparent';
                    } else {
                        fixedBtnContainer.style.background = '#293550';
                    }
                }
            },
            menuChangeHandler(pathObj) {
                let path = _.get(pathObj, 'uri');
                if (path === '/page-layout') {
                    path = `${path}/${this.layoutId}`;
                }
                this.$router.push({path});
            },
            toConfigSite() {
                if (!this.siteName) {
                    this.$router.push({name: 'ConfigSite'});
                }
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
                padding-left: 60px;
                /*设置站点管理和配置中心的隐藏和展示*/
                &.is-center-site {
                    li:last-child {
                        display: none;
                    }
                    li:nth-child(7) {
                        display: inline-block;
                    }
                }
                &:not(.is-center-site) {
                    li:last-child {
                        display: inline-block;
                    }
                    li:nth-child(7) {
                        display: none;
                    }
                }
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
                    background: #252D3F;
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
                &.active {
                    label {
                        background: #0062C4;
                        color: #fff;
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
                width: 200px;
                height: 110px;
                background-image: linear-gradient(0deg, rgba(0,0,0,0.00) 0%, #000000 100%);
                .svg-icon {
                    position: absolute;
                    left: 50%;
                    top: 60px;
                    transform: translate(-50%, -40px);
                    width: 160px;
                    height: 38px;
                }
            }
        }
        .content {
            position: absolute;
            top: $headerHeight;
            left: 200px;
            right: 0px;
            bottom: 0px;
            overflow: scroll;
            background: $contentBg;
            .content-wrapper {
                padding: 20px 20px 100px 20px;
            }
        }
    }

    .el-menu {
        border-right: none;
        background: transparent;
    }

    .aside-list {
        .el-menu-item {
            display: flex;
            align-items: center;
            height: 50px;
            line-height: 50px;
            font-size: 20px;
            color: $navText;
            padding-left: 30px!important;
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
            }
        }
    }

    .site-name {
        margin-top: 20px;
        margin-right: 20px;
    }

</style>

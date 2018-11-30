<!--左侧导航栏-->
<template>
    <div class="wrap-box" id="nav-menu-box">
        <svg-icon
            v-if="isActive"
            icon-class="logo_home"
            class-name="logo-home">
        </svg-icon>
        <svg-icon
            v-else
            icon-class="logo_simple"
            class-name="logo-simple">
        </svg-icon>
        <el-menu
            unique-opened
            background-color="#222D32"
            text-color="#8AA4AF"
            router
            :default-active="$route.path"
            :class="{broad:isActive}"
            :collapse="!isActive"
            active-text-color="#fff">
            <!--内容管理-->
            <!--栏目管理-->
            <el-submenu index="1">
                <template slot="title">
                    <svg-icon
                        icon-class="nav_manage"
                        class-name="svg-box">
                    </svg-icon>
                    <span>栏目管理</span>
                </template>
                <el-menu-item index="/nav-bar-manage/setting">栏目项管理</el-menu-item>
                <el-menu-item v-if="item.signCode !== 'SEARCH'"
                              v-for="(item, index) in navBarList"
                              :key='index'
                              :index="'/nav-bar-manage/layout-setting/' + item.signCode + '/' + item.id">
                    {{item.name}}
                </el-menu-item>
            </el-submenu>
            <!--节目资源管理-->
            <el-submenu index="2">
                <template slot="title">
                    <svg-icon
                        icon-class="programme_manage"
                        class-name="svg-box">
                    </svg-icon>
                    <span>节目资源管理</span>
                </template>
                <el-menu-item index="/programme-manage/create">新增节目</el-menu-item>
                <el-menu-item index="/programme-manage/list">节目列表</el-menu-item>
                <el-menu-item index="/programme-manage/type">节目类别管理</el-menu-item>
            </el-submenu>
            <!--人物资源管理-->
            <el-submenu index="3">
                <template slot="title">
                    <svg-icon
                        icon-class="person_manage"
                        class-name="svg-box">
                    </svg-icon>
                    <span>人物资源管理</span>
                </template>
                <el-menu-item index="/person-manage/create">新增人物</el-menu-item>
                <el-menu-item index="/person-manage/list">人物列表</el-menu-item>
                <el-menu-item index="/person-manage/hot">热门人物管理</el-menu-item>
            </el-submenu>
            <!--视频资源管理-->
            <el-submenu index="4">
                <template slot="title">
                    <svg-icon
                        icon-class="video_manage"
                        class-name="svg-box">
                    </svg-icon>
                    <span>视频资源管理</span>
                </template>
                <el-menu-item index="/manage-video/list">视频列表</el-menu-item>
                <el-menu-item index="/manage-video/download-list">下载列表</el-menu-item>
            </el-submenu>
            <!--频道管理-->
            <el-submenu index="5">
                <template slot="title">
                    <svg-icon
                        icon-class="channel_manage"
                        class-name="svg-box">
                    </svg-icon>
                    <span>频道管理</span>
                </template>
                <el-menu-item index="/channel-manage/live/list">直播频道列表</el-menu-item>
                <el-menu-item index="/channel-manage/carousel/list">轮播频道列表</el-menu-item>
                <el-menu-item index="/channel-manage/category">频道类别管理</el-menu-item>
            </el-submenu>
            <!--专题管理-->
            <el-submenu index="6">
                <template slot="title">
                    <svg-icon
                        icon-class="subject_manage"
                        class-name="svg-box">
                    </svg-icon>
                    <span>专题管理</span>
                </template>
                <el-menu-item index="/subject-manage/programme/create">新增节目专题</el-menu-item>
                <el-menu-item index="/subject-manage/person/create">新增人物专题</el-menu-item>
                <el-menu-item index="/subject-manage/list">专题列表</el-menu-item>
            </el-submenu>
            <!-- 版本管理 -->
            <el-submenu index="7">
                <template slot="title">
                    <svg-icon
                        icon-class="version_manage"
                        class-name="svg-box">
                    </svg-icon>
                    <span>版本管理</span>
                </template>
                <el-menu-item index="/manage-version/list">版本列表</el-menu-item>
            </el-submenu>
            <!-- 设备管理 -->
            <el-submenu index="8">
                <template slot="title">
                    <svg-icon
                        icon-class="device_manage"
                        class-name="svg-box">
                    </svg-icon>
                    <span>设备管理</span>
                </template>
                <el-menu-item index="/manage-device/list">设备列表</el-menu-item>
            </el-submenu>
            <!--产品管理-->
            <el-submenu index="9">
                <template slot="title">
                    <svg-icon
                        icon-class="programme_manage"
                        class-name="svg-box">
                    </svg-icon>
                    <span>产品管理</span>
                </template>
                <el-menu-item index="/product-manage/create-category">新增类别包</el-menu-item>
                <el-menu-item index="/product-manage/create-programme">新增节目包</el-menu-item>
                <el-menu-item index="/product-manage/create-carousel">新增轮播频道包</el-menu-item>
                <el-menu-item index="/product-manage/create-record">新增直播回看包</el-menu-item>
                <el-menu-item index="/product-manage/list">产品包列表</el-menu-item>
            </el-submenu>
            <!--管理员管理-->
            <el-submenu index="10">
                <template slot="title">
                    <svg-icon
                        icon-class="admin_manage"
                        class-name="svg-box">
                    </svg-icon>
                    <span>管理员管理</span>
                </template>
                <el-menu-item
                    index="/manage-admin/create">
                    创建管理员
                </el-menu-item>
                <el-menu-item
                    index="/manage-admin/list">
                    管理员列表
                </el-menu-item>
            </el-submenu>
            <!--用户管理-->
            <el-submenu index="11">
                <template slot="title">
                    <svg-icon
                        icon-class="user_manage"
                        class-name="svg-box">
                    </svg-icon>
                    <span>用户管理</span>
                </template>
                <el-menu-item index="/user-center/create">创建用户</el-menu-item>
                <el-menu-item index="/user-center/list">用户列表</el-menu-item>
                <el-menu-item index="/kits">小功能</el-menu-item>
            </el-submenu>
            <!--站点管理-->
            <el-submenu index="12">
                <template slot="title">
                    <svg-icon
                        icon-class="programme_manage"
                        class-name="svg-box">
                    </svg-icon>
                    <span>站点管理</span>
                </template>
                <!--站点配置只在子站点中存在-->
                <el-menu-item
                    index="/site-manage/config"
                    v-if="!$wsCache.localStorage.get('siteInfo').siteMasterEnable">
                    站点配置
                </el-menu-item>
                <!--站点列表只在中心站点中存在-->
                <el-menu-item index="/site-manage/list" v-else>站点列表</el-menu-item>
            </el-submenu>
            <!--个人中心-->
            <el-submenu index="13">
                <template slot="title">
                    <svg-icon
                        icon-class="personal_center"
                        class-name="svg-box">
                    </svg-icon>
                    <span>个人中心</span>
                </template>
                <el-menu-item index="/personal-center/my-info">我的信息</el-menu-item>
                <el-menu-item index="/personal-center/modify-password">修改密码
                </el-menu-item>
                <el-menu-item index="/" @click="logout">退出登录</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>

    export default {
        name: 'VAside',
        data() {
            return {
                isActive: true,
                navBarList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getNavBarList().then(response => {
                    if (response && response.code === 0) {
                        this.navBarList = response.data;
                        // 将导航栏数据保存在store中
                        this.$store.commit('layout/setNavBarList', {
                            navBarList: this.navBarList
                        });
                    }
                });
            },
            setIsActive(isActive) {
                this.isActive = isActive;
            },
            // 退出登录
            logout() {
                this.$store.dispatch('user/logout', false);
            }
        }
    };
</script>

<style scoped lang="scss">

    .wrap-box {
        overflow-y: scroll;
        .logo-home {
            width: 240px !important;
            height: 64px !important;
        }

        .logo-simple {
            width: 64px !important;
            height: 64px !important;
        }
        .el-menu {
            text-align: left;
            border: none;
            &.broad {
                width: 240px;
            }
            i, .svg-box {
                margin-right: 18px;
            }
            .el-menu-item {
                padding-left: 65px !important;
                font-size: 18px;
                color: $loginFontColor;
            }
        }
    }

</style>

<style lang="scss">

    #nav-menu-box {
        // 一级菜单
        .el-submenu {
            .el-submenu__title {
                * {
                    font-size: 20px;
                    color: #B8C7CE;
                }
                i {
                    font-size: 12px;
                    margin-top: -6px;
                }
            }
            .svg-box {
                fill: $asideIconColor;
            }
            // 打开一级菜单
            &.is-opened {
                .el-menu {
                    background-color: #2B414B !important;
                    li {
                        background-color: #2B414B !important;
                    }
                }
                // active的二级菜单
                .el-menu-item {
                    &:hover {
                        background-color: #283841 !important;
                    }
                }
            }
            // active的一级菜单
            &.is-active {
                .el-submenu__title {
                    background-color: #1A2227 !important;
                    * {
                        color: white;
                    }
                    .svg-box {
                        fill: #fff;
                    }
                }
                // active的二级菜单
                .el-menu-item {
                    &.is-active, &:hover {
                        background-color: #283841 !important;
                    }
                }
                .el-menu {
                    background-color: #2B414B !important;
                    li {
                        background-color: #2B414B !important;
                    }
                }
            }
        }
    }

</style>

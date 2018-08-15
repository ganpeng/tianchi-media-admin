<!--左侧导航栏-->
<template>
    <div class="wrap-box">
        <img v-if="isActive" src="~assets/img/logo.png">
        <img v-else src="~assets/img/single_logo.png">
        <el-menu
            unique-opened
            background-color="#283841"
            text-color="#8AA4AF"
            router
            :default-active="$route.path"
            :class="{broad:isActive}"
            :collapse="!isActive"
            active-text-color="#fff">
            <!--内容管理-->
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>内容管理</span>
                </template>
                <!--栏目管理-->
                <el-submenu index="1-1" :style="secondLeftIndent">
                    <template slot="title">栏目管理</template>
                    <el-menu-item index="/nav-bar-manage/setting">栏目项管理</el-menu-item>
                    <el-menu-item v-if="item.signCode !== 'SEARCH'"
                                  v-for="(item, index) in navBarList"
                                  :key='index'
                                  :index="'/nav-bar-manage/layout-setting/' + item.signCode + '/' + item.id">
                        {{item.name}}
                    </el-menu-item>
                </el-submenu>
                <!--节目资源管理-->
                <el-submenu index="1-2" :style="secondLeftIndent">
                    <template slot="title">节目资源管理</template>
                    <el-menu-item index="/programme-manage/create">新增节目</el-menu-item>
                    <el-menu-item index="/programme-manage/list">节目列表</el-menu-item>
                    <el-menu-item index="/programme-manage/type">节目类别管理</el-menu-item>
                </el-submenu>
                <!--人物资源管理-->
                <el-submenu index="1-3" :style="secondLeftIndent">
                    <template slot="title">人物资源管理</template>
                    <el-menu-item index="/person-manage/create">新增人物</el-menu-item>
                    <el-menu-item index="/person-manage/list">人物列表</el-menu-item>
                    <el-menu-item index="/person-manage/hot">热门人物管理</el-menu-item>
                </el-submenu>
                <!--视频资源管理-->
                <el-submenu index="1-4" :style="secondLeftIndent">
                    <template slot="title">视频资源管理</template>
                    <el-menu-item index="/video-manage/list">视频列表</el-menu-item>
                </el-submenu>
                <!--频道管理-->
                <el-submenu index="1-5" :style="secondLeftIndent">
                    <template slot="title">频道管理</template>
                    <el-submenu index="1-5-1">
                        <template slot="title">直播频道管理</template>
                        <el-menu-item index="/channel-manage/live/list">直播频道列表</el-menu-item>
                    </el-submenu>
                    <el-submenu index="1-5-2">
                        <template slot="title">轮播频道管理</template>
                        <el-menu-item index="/channel-manage/carousel/list">轮播频道列表</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="/channel-manage/category">频道类别管理</el-menu-item>
                </el-submenu>
                <!--专题管理-->
                <el-submenu index="1-6" :style="secondLeftIndent">
                    <template slot="title">专题管理</template>
                    <el-menu-item index="/subject-manage/programme/create">新增节目专题</el-menu-item>
                    <el-menu-item index="/subject-manage/person/create">新增人物专题</el-menu-item>
                    <el-menu-item index="/subject-manage/list">专题列表</el-menu-item>
                </el-submenu>
                <!-- 版本管理 -->
                <el-submenu index="1-7" :style="secondLeftIndent">
                    <template slot="title">版本管理</template>
                    <el-menu-item index="/version-manage/list">版本列表</el-menu-item>
                </el-submenu>
            </el-submenu>
            <!--管理员管理-->
            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-setting"></i>
                    <span>管理员管理</span>
                </template>
                <el-menu-item index="/admin-manage/create" :style="directSecondLeftIndent">创建管理员</el-menu-item>
                <el-menu-item index="/admin-manage/list" :style="directSecondLeftIndent">管理员列表</el-menu-item>
            </el-submenu>
            <!--用户管理-->
            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-tickets"></i>
                    <span>用户管理</span>
                </template>
                <el-menu-item index="/user-center/create" :style="directSecondLeftIndent">创建用户</el-menu-item>
                <el-menu-item index="/user-center/list" :style="directSecondLeftIndent">用户列表</el-menu-item>
                <el-menu-item index="/kits" :style="directSecondLeftIndent">小功能</el-menu-item>
            </el-submenu>
            <!--广告管理-->
            <el-submenu v-if="false" index="4">
                <template slot="title">
                    <i class="el-icon-goods"></i>
                    <span>广告管理</span>
                </template>
                <el-submenu index="5-1" :style="secondLeftIndent">
                    <template slot="title">广告资源管理</template>
                    <el-menu-item index="/advert-resource/list">广告资源列表</el-menu-item>
                </el-submenu>
                <el-submenu index="5-2" :style="secondLeftIndent">
                    <template slot="title">广告投放管理</template>
                    <el-menu-item index="/advert-launch/starting/list">开机广告列表</el-menu-item>
                    <el-menu-item index="/advert-launch/preprogramme/list">节目前置广告列表</el-menu-item>
                    <el-menu-item index="/advert-launch/screensaver/list">屏保广告列表</el-menu-item>
                    <el-menu-item index="/advert-launch/pause/list">暂停广告列表</el-menu-item>
                    <el-menu-item index="/advert-launch/live/list">直播换台广告列表</el-menu-item>
                    <el-menu-item index="/advert-launch/volumebar/list">音量条广告列表</el-menu-item>
                    <el-menu-item index="/advert-launch/dialog/list">弹窗广告列表</el-menu-item>
                    <el-menu-item index="/advert-launch/detailpage/list">详情页广告列表</el-menu-item>
                </el-submenu>
            </el-submenu>
            <!--个人中心-->
            <el-submenu index="5">
                <template slot="title">
                    <i class="el-icon-setting"></i>
                    <span>个人中心</span>
                </template>
                <el-menu-item index="/personal-center/my-info" :style="directSecondLeftIndent">我的信息</el-menu-item>
                <el-menu-item index="/personal-center/modify-password" :style="directSecondLeftIndent">修改密码
                </el-menu-item>
                <el-menu-item index="/" @click="logout" :style="directSecondLeftIndent">退出登录</el-menu-item>
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
                secondLeftIndent: {paddingLeft: '0px'},
                directSecondLeftIndent: {},
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .wrap-box {
        background-color: $baseAsideColor;
        overflow-y: scroll;
        .el-menu {
            text-align: left;
            border: none;
            &.broad {
                width: 240px;
            }
            i {
                margin-right: 16px;
            }
        }
    }

    // 一级菜单
    .el-submenu {
        .el-submenu__title {
            * {
                font-size: 20px;
            }
        }
    }

    // active的一级菜单
    .is-active {
        div {
            * {
                color: white;
            }
        }
    }

</style>

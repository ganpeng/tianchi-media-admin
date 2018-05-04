<!--左侧导航栏-->
<template>
    <el-aside width="200px">
        <el-col :span="12">
            <el-menu
                unique-opened
                default-active="2"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#545c64"
                text-color="#fff"
                router
                active-text-color="#ffd04b">
                <el-submenu index="1">
                    <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>内容管理</span>
                    </template>
                    <el-menu-item-group>
                        <el-submenu index="1-1">
                            <template slot="title">栏目管理</template>
                            <el-menu-item index="/column-manage/setting">栏目项设置</el-menu-item>
                            <el-menu-item index="/column-manage/today-recommended">今日推荐</el-menu-item>
                        </el-submenu>
                    </el-menu-item-group>
                    <el-submenu index="1-2">
                        <template slot="title">节目资源管理</template>
                        <el-menu-item index="/programme-manage/create">新增节目</el-menu-item>
                        <el-menu-item index="/programme-manage/list">节目列表</el-menu-item>
                        <el-menu-item index="/programme-manage/type">节目类别管理</el-menu-item>
                    </el-submenu>
                    <el-submenu index="1-3">
                        <template slot="title">人物资源管理</template>
                        <el-menu-item index="/person-manage/create">新增人物</el-menu-item>
                        <el-menu-item index="/person-manage/list">人物列表</el-menu-item>
                    </el-submenu>
                    <el-menu-item-group>
                        <el-submenu index="1-4">
                            <template slot="title">专题管理</template>
                            <el-menu-item index="/subject-manage/programme-create">新增节目专题</el-menu-item>
                            <el-menu-item index="/subject-manage/person-create">新增人物专题</el-menu-item>
                            <el-menu-item index="/subject-manage/list">专题列表</el-menu-item>
                        </el-submenu>
                    </el-menu-item-group>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title">
                        <i class="el-icon-setting"></i>
                        <span>管理员管理</span>
                    </template>
                    <el-menu-item index="/admin-manage/list">管理员列表</el-menu-item>
                    <el-menu-item index="/admin-manage/create">创建管理员</el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title">
                        <i class="el-icon-tickets"></i>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item index="/user-center/list">用户列表</el-menu-item>
                </el-submenu>
                <el-submenu index="4">
                    <template slot="title">
                        <i class="el-icon-setting"></i>
                        <span>个人中心</span>
                    </template>
                    <el-menu-item index="/personal-center/info-setting">信息设置</el-menu-item>
                    <el-menu-item index="/personal-center/modify-password">修改密码</el-menu-item>
                    <el-menu-item index @click="logout">退出登录</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-col>
    </el-aside>
</template>

<script>

    export default {
        name: 'VAside',
        data() {
            return {};
        },
        methods: {
            handleOpen(key, keyPath) {
            },
            handleClose(key, keyPath) {
            },
            // 退出登录
            logout() {
                this.$store.dispatch('user/logout');
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    .el-aside {
        background-color: #545c64;
        color: #333;
        text-align: center;
        line-height: 200px;
        .el-col-12 {
            width: 100%;
        }
        .el-menu {
            border: none;
        }
    }
</style>

<!--左侧导航栏-->
<template>
    <el-aside width="200px">
        <el-col :span="12">
            <el-menu
                default-active="2"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#545c64"
                text-color="#fff"
                router
                active-text-color="#ffd04b">
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
            return {}
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath)
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath)
            },
            // 退出登录
            logout() {
                this.$store.dispatch('user/logout')
            }
        }
    }
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

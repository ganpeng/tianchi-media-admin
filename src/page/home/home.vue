<template>
    <el-container class="main-container">
        <el-header>
            <img src="../../assets/images/logo.png">
            <label>天驰传媒后台管理系统</label>
            <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">James Bond<i class="el-icon-arrow-down el-icon--right"></i></span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="set">设置</el-dropdown-item>
                    <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        <el-container>
            <el-aside width="200px">
                <el-col :span="12">
                    <el-menu
                        default-active="2"
                        class="el-menu-vertical-demo"
                        @open="handleOpen"
                        @close="handleClose"
                        background-color="#545c64"
                        text-color="#fff"
                        active-text-color="#ffd04b">
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>Dashboard</span>
                            </template>
                            <el-menu-item-group>
                                <template slot="title">分组一</template>
                                <el-menu-item index="1-1">选项1</el-menu-item>
                                <el-menu-item index="1-2">选项2</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group title="分组2">
                                <el-menu-item index="1-3">选项3</el-menu-item>
                            </el-menu-item-group>
                            <el-submenu index="1-4">
                                <template slot="title">选项4</template>
                                <el-menu-item index="1-4-1">选项1</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                        <el-menu-item index="2">
                            <i class="el-icon-menu"></i>
                            <span slot="title">导航二</span>
                        </el-menu-item>
                        <el-menu-item index="3" disabled>
                            <i class="el-icon-document"></i>
                            <span slot="title">导航三</span>
                        </el-menu-item>
                        <el-menu-item index="4">
                            <i class="el-icon-setting"></i>
                            <span slot="title">导航四</span>
                        </el-menu-item>
                    </el-menu>
                </el-col>
            </el-aside>
            <el-container>
                <el-main>
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
                        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
                        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
                    </el-breadcrumb>
                </el-main>
                <el-footer>
                    <small>天驰传媒股份有限公司 版权所有</small>
                    <small>地址：北京市朝阳区东三环中路9号33层3302</small>
                </el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        name: 'home',
        data() {
            return {}
        },
        methods: {
            handleCommand(command) {
                switch (command) {
                    // 跳转到设置页面
                    case 'set':
                        break
                    // 退出登录
                    case 'logout':
                        this.$router.push({name: 'login'})
                        break
                }
            },
            handleOpen(key, keyPath) {
                console.log(key, keyPath)
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath)
            }

        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    .main-container {
        height: 100%;
    }

    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
        img {
            float: left;
            margin-top: 20px;
            width: 25px;
            height: 25px;
        }
        label {
            float: left;
        }
        .el-dropdown {
            float: right;
            height: 60%;
            .el-dropdown-link {
                cursor: pointer;
            }
            .el-icon-arrow-down {
                font-size: 12px;
            }
        }
        small:first-child {
            margin-right: 30px;
        }
    }

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

    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }
</style>

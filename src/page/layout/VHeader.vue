<!--页头组件-->
<template>
    <div>
        <img src="~assets/img/logo.png">
        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">{{name}}<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="set">设置</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>

<script>
    import Cookies from 'js-cookie';

    export default {
        name: 'VHeader',
        data() {
            return {
                name: ''
            };
        },
        created() {
            this.name = Cookies.get('name');
        },
        methods: {
            handleCommand(command) {
                switch (command) {
                    // 跳转到设置页面
                    case 'set':
                        this.$router.push({name: 'InfoSetting'});
                        break;
                    // 退出登录
                    case 'logout':
                        this.$store.dispatch('user/logout');
                        break;
                    default:
                        break;
                }
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    img {
        float: left;
        margin-left: 30px;
        margin-top: 20px;
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
</style>

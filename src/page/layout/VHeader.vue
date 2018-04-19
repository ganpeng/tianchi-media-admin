<!--页头组件-->
<template>
    <div>
        <img src="../../assets/images/logo.png">
        <label>天驰传媒后台管理系统</label>
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
</style>

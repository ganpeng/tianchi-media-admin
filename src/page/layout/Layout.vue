<!--网页布局，包含页头、页脚、侧边栏以及主内容区-->
<template>
    <el-container class="main-container">
        <el-header>
            <!--页头-->
            <v-header></v-header>
        </el-header>
        <el-container>
            <!--侧边栏-->
            <v-aside></v-aside>
            <el-container>
                <el-main class="main-content">
                    <!--主内容区-->
                    <router-view></router-view>
                </el-main>
                <el-footer>
                    <!--页脚-->
                    <v-footer></v-footer>
                </el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import vHeader from './VHeader.vue';
    import vFooter from './VFooter.vue';
    import vAside from './VAside.vue';

    export default {
        name: 'Layout',
        components: {
            vHeader,
            vAside,
            vFooter
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    .main-container {
        height: 100%;
    }

    .el-header {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .main-content {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
        * {
            line-height: 1;
        }
    }
</style>

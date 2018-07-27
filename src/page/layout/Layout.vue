<!--网页布局，包含页头、页脚、侧边栏以及主内容区-->
<template>
    <el-container class="main-container">
        <v-aside ref="vAside">
        </v-aside>
        <el-container>
            <el-header
                height="64px">
                <v-header
                    v-on:toggleAside="toggleAside">
                </v-header>
            </el-header>
            <el-container>
                <el-main class="main-content">
                    <!--主内容区-->
                    <router-view></router-view>
                </el-main>
                <el-footer height="64px">
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
        methods: {
            toggleAside(isActive) {
                this.$refs.vAside.setIsActive(isActive);
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
    .main-container {
        height: 100%;
    }

    .el-header {
        padding: 0px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.20);
    }

    .main-content {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        * {
            line-height: 1;
        }
    }
</style>

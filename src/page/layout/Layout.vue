<!--网页布局，包含页头、页脚、侧边栏以及主内容区-->
<template>
    <el-container class="main-container">
        <el-aside :width="isActive ? '240px' : '64px'">
            <v-aside ref="vAside"></v-aside>
        </el-aside>
        <el-container>
            <el-header
                height="64px">
                <v-header
                    v-on:toggleAside="toggleAside">
                </v-header>
            </el-header>
            <el-container>
                <el-main class="main-view">
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
            return {
                isActive: true
            };
        },
        methods: {
            toggleAside(isActive) {
                this.isActive = isActive;
                this.$refs.vAside.setIsActive(isActive);
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
    .main-container {
        height: 100%;
    }

    .el-header {
        padding: 0px;
    }

    .el-aside {
        background-color: $baseAsideColor;
    }

    .main-view {
        background-color: $stillGray;
        text-align: center;
        * {
            line-height: 1;
        }
    }
</style>

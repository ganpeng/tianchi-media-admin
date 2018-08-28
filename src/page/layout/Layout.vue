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
                <el-main class="main-view" style="padding: 0;">
                    <!--主内容区-->
                    <div class="wrapper" :style="`min-height: ${minHeight}px`">
                        <upload-video></upload-video>
                        <router-view></router-view>
                    </div>
                    <v-footer id="page-footer"></v-footer>
                </el-main>
            </el-container>
        </el-container>
    </el-container>
</template>

<script>
    import vHeader from './VHeader.vue';
    import vFooter from './VFooter.vue';
    import vAside from './VAside.vue';
    import UploadVideo from '../video_manage/UploadVideo';

    export default {
        name: 'Layout',
        components: {
            vHeader,
            vAside,
            vFooter,
            UploadVideo
        },
        data() {
            return {
                isActive: true,
                minHeight: 400
            };
        },
        created() {
            let minHeight = window.innerHeight - 100 - 64 - 64;
            this.minHeight = minHeight;
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
    .wrapper {
        padding: 20px;
        background-color: $stillGray;
        text-align: center;
        * {
            line-height: 1;
        }
    }
    #page-footer {
        height: 64px;
        line-height: 64px;
        margin-top: 100px;
    }
    .main-container {
        height: 100%;
    }

    .el-header {
        position: relative;
        padding: 0px;
        box-shadow: 0px 2px 10px 0 rgba(0, 0, 0, 0.20);
        z-index: 2000;
    }

    .el-aside {
        background-color: #222D32;
    }

    .el-footer {
        position: relative;
        padding: 0px;
        z-index: 2000;
    }

    .main-view {
        background-color: $stillGray;
        text-align: center;
        * {
            line-height: 1;
        }
    }
</style>

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
    import axios from 'axios';
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
                minHeight: 400,
                isDownloading: false,
                noticer: null
            };
        },
        created() {
            this.setMinHeight();
            window.addEventListener('resize', this.setMinHeight, false);
            window.eventBus.$on('startExportVideoExecel', this.exportExecelHandler);
        },
        beforeDestroy() {
            window.removeEventListener('resize', this.setMinHeight);
        },
        methods: {
            toggleAside(isActive) {
                this.isActive = isActive;
                this.$refs.vAside.setIsActive(isActive);
            },
            setMinHeight() {
                let minHeight = window.innerHeight - 100 - 64 - 64;
                this.minHeight = minHeight;
            },
            exportExecelHandler() {
                if (!this.isDownloading) {
                    this.isDownloading = true;
                    this.noticer = this.$notify({
                        title: '提示',
                        message: '视频文件正在导出中，请稍等...',
                        duration: 0
                    });
                    axios.get('/storage/v1/storage/video/duration-diff/list', {
                        headers: this.$util.getUploadHeaders(this.$store.state.user.token),
                        responseType: 'blob'
                    }).then((res) => {
                        if (res && res.status === 200) {
                            let data = res.data;
                            if (!data) {
                                return;
                            }
                            let url = window.URL.createObjectURL(new Blob([data]));
                            let link = document.createElement('a');
                            link.style.display = 'none';
                            link.href = url;
                            link.setAttribute('download', 'excel.xlsx');

                            document.body.appendChild(link);
                            link.click();
                            this.$message.success('视频列表文件导出成功');
                        }
                    }).catch(() => {
                        this.$message.error('视频列表文件导出失败');
                    }).finally(() => {
                        setTimeout(() => {
                            this.isDownloading = false;
                            this.noticer.close();
                        }, 1000);
                    });
                }
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
        z-index: 800;
    }

    .main-view {
        background-color: $stillGray;
        text-align: center;
        * {
            line-height: 1;
        }
    }
</style>

<!--视频列表组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>视频资源管理</el-breadcrumb-item>
            <el-breadcrumb-item>视频列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" class="demo-form-inline search-form">
            <el-form-item class="search">
                <el-input
                    placeholder="搜索你想要的信息"
                    clearable
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">搜索</el-button>
            </el-form-item>
            <el-form-item class="create-account">
                <el-button type="primary" plain @click="showVideoUploadDialog">上传点播视频</el-button>
                <el-button type="primary" plain @click="showVideoUploadDialog">上传轮播视频</el-button>
            </el-form-item>
        </el-form>
        <video-table></video-table>
        <el-dialog
            title="上传视频"
            :visible.sync="videoUploadDialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-upload
                class="upload-demo"
                ref="upload"
                action="/admin/v1/media/image"
                :auto-upload="false"
                :http-request="uploadRequest"
                :show-file-list="false"
                :with-credentials="true"
                multiple>
                    <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelHandler">取 消</el-button>
                <el-button
                    type="primary"
                    @click="submitUpload"
                    v-loading.fullscreen.lock="isLoading">确 定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import VideoTable from './VideoTable';
    export default {
        name: 'PersonList',
        components: {
            VideoTable
        },
        data() {
            return {
                videoUploadDialogVisible: false,
                isLoading: false
            };
        },
        computed: {
            ...mapGetters({
                video: 'video/videoObj'
            })
        },
        methods: {
            handleSizeChange(pageSize) {
            },
            handleCurrentChange(pageNum) {
            },
            showVideoUploadDialog() {
                this.videoUploadDialogVisible = true;
            },
            cancelHandler() {
                this.videoUploadDialogVisible = false;
            },
            uploadRequest(obj) {
                let formData = new FormData();
                formData.append('file', obj.file);
                this.isLoading = true;
                this.$service.uploadVideo({formData})
                    .then((res) => {
                        if (res && (res.code === 0)) {
                            this.cancelHandler();
                        }
                    }).finally(() => {
                        this.isLoading = false;
                    });
            },
            submitUpload() {
                this.$refs.upload.submit();
            }
        }
    };
</script>
<style scoped lang="less">
</style>

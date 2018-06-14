<!-- 上传节目视频的弹窗组件 -->
<template>
    <el-dialog
        :title="title"
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
            :with-credentials="true">
                <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelHandler">取 消</el-button>
            <el-button
                type="primary"
                @click="successHandler"
                v-loading.fullscreen.lock="isLoading">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    export default {
        props: {
            videoUploadDialogVisible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isLoading: false
            };
        },
        methods: {
            cancelHandler() {
                this.$emit('changeVideoDialogStatus', false);
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
<style lang="less" scoped>
</style>

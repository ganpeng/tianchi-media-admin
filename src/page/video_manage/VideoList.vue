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
                <el-button type="primary" plain @click="showVideoUploadDialog">新增视频</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="video.list" border style="width:100%">
            <el-table-column prop="id" align="center" width="240px" label="编号"></el-table-column>
            <el-table-column prop="name" align="center" width="200px" label="视频名称"></el-table-column>
            <el-table-column prop="link" align="center" width="300px" label="视频链接"></el-table-column>
            <el-table-column prop="duration" align="center" label="视频时长"></el-table-column>
            <el-table-column align="center" width="120px" label="上传日期">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column align="center" width="120px" fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small">查看</el-button>
                    <el-button type="text" size="small">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="video.pageNum"
            :page-sizes="[5, 10, 20, 30, 50]"
            :page-size="video.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="video.total">
        </el-pagination>
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
                :with-credentials="true">
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
    export default {
        name: 'PersonList',
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
                this.$service.uploadImage({formData})
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

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
                    :value="searchFields.name"
                    placeholder="搜索你想要的信息"
                    clearable
                    @input="inputHandler($event, 'name')"
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item class="search">
                <el-select
                    :value="searchFields.videoType"
                    clearable
                    placeholder="请选择视频类型"
                    @input="inputHandler($event, 'videoType')"
                >
                    <el-option
                        v-for="(item, index) in videoTypeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchHandler">搜索</el-button>
            </el-form-item>
            <el-form-item class="create-account">
                <el-button type="primary" plain @click="showVideoUploadDialog('VOD')">上传点播视频</el-button>
                <el-button type="primary" plain @click="showVideoUploadDialog('CAROUSEL')">上传轮播视频</el-button>
            </el-form-item>
        </el-form>
        <video-table></video-table>
        <el-dialog
            title="上传视频"
            :visible.sync="videoUploadDialogVisible"
            :headers="uploadHeaders"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-upload
                class="upload-demo"
                ref="upload"
                :headers="uploadHeaders"
                action="/v1/storage/video"
                :on-success="uploadSuccessHandler"
                :on-change="uploadChangeHandler"
                :auto-upload="false"
                :data="{videoType: this.getVideoType}"
                :file-list="fileList"
                :before-upload="beforeUploadHandler"
                :with-credentials="true"
                multiple>
                    <el-button slot="trigger" size="small" type="primary">选择视频</el-button>
                    <el-button style="margin-left: 10px;" v-if="showUploadBtn" size="small" @click="submitUpload" type="success">点击上传</el-button>
            </el-upload>

            <div v-if="uploadResult.length > 0">
                <ul class="el-upload-list el-upload-list--text">
                    <li v-for="(res, index) in uploadResult" :key="index" :tabindex="index" style="overflow:hidden;" class="el-upload-list__item is-ready">
                        <a>
                            <i class="el-icon-document"></i>
                            {{res.video.originName}}
                            <span v-if="res.failCode" class="text-danger">{{res.failReason}}</span>
                            <span v-if="!res.failCode" class="text-success">上传成功</span>
                        </a>
                    </li>
                </ul>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelHandler">关闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import VideoTable from './VideoTable';
    import role from '@/util/config/role';
    export default {
        name: 'PersonList',
        components: {
            VideoTable
        },
        data() {
            return {
                videoUploadDialogVisible: false,
                videoTypeOptions: role.VIDEO_TYPE_OPTIONS,
                isLoading: false,
                timer: null,
                fileList: [],
                count: 0,
                successCount: 0,
                uploadResult: [],
                uploadHeaders: this.$util.getUploadHeaders(this.$store.state.user.token)
            };
        },
        computed: {
            ...mapGetters({
                searchFields: 'video/searchFields',
                getVideoType: 'video/getVideoType'
            }),
            showUploadBtn() {
                return (this.count === 0 && this.successCount === 0) || this.fileList.length === 0;
            },
            showUploadResult() {
                return this.count === this.successCount;
            }
        },
        created() {
            this.timer = setInterval(() => {
                this.getVideoList();
            }, 1000 * 10);
        },
        beforeRouteLeave(to, from, next) {
            clearInterval(this.timer);
            this.timer = null;
            next();
        },
        methods: {
            ...mapMutations({
                updateSearchFields: 'video/updateSearchFields',
                setVideoType: 'video/setVideoType'
            }),
            ...mapActions({
                getVideoList: 'video/getVideoList'
            }),
            showVideoUploadDialog(videoType) {
                this.videoUploadDialogVisible = true;
                this.setVideoType({videoType});
            },
            cancelHandler() {
                this.videoUploadDialogVisible = false;
                this.fileList = [];
                this.uploadResult = [];
                //  关闭按钮之后重新获取数据
                this.getVideoList();
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            inputHandler(value, key) {
                this.updateSearchFields({key, value});
            },
            searchHandler() {
                this.getVideoList();
            },
            uploadSuccessHandler(res, file, fileList) {
                this.successCount++;
                if (res && res.code === 0 && res.data[0]) {
                    this.uploadResult.push(res.data[0]);
                    if (res.data[0].failCode === 3300) {
                        let name = res.data[0].video ? res.data[0].video.originName : '';
                        this.$message({
                            type: 'error',
                            message: `[${name}], 该视频资源已存在`
                        });
                    }
                }
                if (this.showUploadResult) {
                    this.$refs.upload.clearFiles();
                }
            },
            uploadChangeHandler() {
                if (this.count === this.successCount) {
                    this.count = this.successCount = 0;
                }
            },
            beforeUploadHandler(file) {
                this.count++;
                this.uploadResult = [];
            }
        }
    };
</script>
<style scoped lang="less">
</style>

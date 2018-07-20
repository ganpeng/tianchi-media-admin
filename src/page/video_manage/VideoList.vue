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
            <el-form-item class="search">
                <el-select
                    :value="searchFields.status"
                    clearable
                    placeholder="请选择视频注入状态"
                    @input="inputHandler($event, 'status')"
                >
                    <el-option
                        v-for="(item, index) in statusOptions"
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
            :show-close="false"
            width="80%"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <div v-show="!isUploading" class="upload-file">
                <div class="wrapper">
                    <label for="upload-input">
                        <el-button size="small" type="primary">选取文件</el-button>
                    </label>
                    <input id="upload-input" class="upload-input" type="file" ref="uploadInput" @change="uploadChangeHandler" multiple>
                </div>
                <el-button style="margin-left: 10px;" size="small" @click="uploadHandler" type="success">点击上传</el-button>
            </div>
            <ul class="progress-bar-list">
                <li class="progress-bar-item" v-for="(item, index) in files" :key="index">
                    <p class="file-name">{{item.name}}</p>
                    <div class="progress-bar">
                        <el-progress
                            class="bar"
                            :stroke-width="3"
                            :percentage="getProgress(index).percent"
                            :status="getProgress(index).percent !== 100 ? 'exception' : 'success'">
                        </el-progress>
                        <i
                            v-if="!showDelete(index)"
                            @click="cancelUpload(index)"
                            class="delete-btn el-icon-close"></i>
                        <span class="percent">
                            {{ getProgress(index).percent + '% ' + uploadStatus(index) }}
                        </span>
                    </div>
                </li>
            </ul>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelHandler">关闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import axios from 'axios';
    import VideoTable from './VideoTable';
    import role from '@/util/config/role';
    const CancelToken = axios.CancelToken;

    export default {
        name: 'PersonList',
        components: {
            VideoTable
        },
        data() {
            return {
                files: [],
                progress: [],
                cancel: null,
                count: 0,
                isUploading: false,
                videoUploadDialogVisible: false,
                videoTypeOptions: role.VIDEO_TYPE_OPTIONS,
                statusOptions: role.VIDEO_UPLOAD_STATUS_OPTIONS,
                isLoading: false,
                timer: null
            };
        },
        computed: {
            ...mapGetters({
                searchFields: 'video/searchFields',
                getVideoType: 'video/getVideoType'
            }),
            getProgress() {
                return (index) => {
                    return {
                        percent: this.progress[index].percent,
                        status: this.progress[index].status
                    };
                };
            },
            showDelete() {
                return (index) => {
                    let status = this.progress[index].status;
                    let percent = this.progress[index].percent;
                    return status === 'canceled' || status === 'uploaded' || status === 'error' || status === 'fail' || percent === 100;
                };
            },
            uploadStatus() {
                return (index) => {
                    let status = this.progress[index].status;
                    let message = this.progress[index].message;
                    switch (status) {
                        // uploading canceld waiting uploaded error fail
                        case 'uploading':
                            return '上传中';
                        case 'canceled':
                            return '已取消上传';
                        case 'waiting':
                            return '等待上传';
                        case 'uploaded':
                            return '上传成功';
                        case 'error':
                            return '上传失败';
                        case 'fail':
                            return message;
                        default:
                            return '';
                    }
                };
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
                getVideoList: 'video/getVideoList',
                checkVideoMd5: 'video/checkVideoMd5'
            }),
            showVideoUploadDialog(videoType) {
                this.videoUploadDialogVisible = true;
                this.setVideoType({videoType});
            },
            cancelHandler() {
                if (this.$refs.uploadInput.value) {
                    this.$confirm('你确定要取消上传操作吗, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.$refs.uploadInput.value = '';
                        this.resetUpload();
                        this.videoUploadDialogVisible = false;
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                } else {
                    this.resetUpload();
                    this.videoUploadDialogVisible = false;
                }
            },
            inputHandler(value, key) {
                this.updateSearchFields({key, value});
            },
            searchHandler() {
                this.getVideoList();
            },
            resetUpload() {
                this.count = 0;
                this.cancel && this.cancel();
                this.cancel = null;
                this.files = [];
                this.progress = [];
                this.isUploading = false;
            },
            uploadChangeHandler(e) {
                this.resetUpload();
                this.files = Array.from(e.target.files).map((item) => item);
                this.progress = Array.from(this.files).map((item) => {
                    return {
                        percent: 0,
                        status: 'waiting',
                        message: ''
                    };
                });
            },
            uploadHandler(obj) {
                let that = this;
                if (!this.isUploading) {
                    this.isUploading = true;
                    upload();
                }
                function upload() {
                    if (typeof that.files[that.count] === 'undefined') {
                        that.$refs.uploadInput.value = '';
                        that.count = 0;
                        that.cancel = null;
                        // that.isUploading = false;
                        return false;
                    }
                    let formData = new FormData();
                    formData.append('file', that.files[that.count]);
                    formData.append('videoType', that.getVideoType);

                    axios.post('/v1/storage/video', formData, {
                        baseURL: '/',
                        headers: that.$util.getUploadHeaders(that.$store.state.user.token),
                        onUploadProgress: (progressEvent) => {
                            if (progressEvent.lengthComputable) {
                                that.progress = that.progress.map((progress, index) => {
                                    if (index === that.count) {
                                        return {
                                            percent: parseInt((progressEvent.loaded / progressEvent.total) * 100),
                                            status: 'uploading'
                                        };
                                    } else {
                                        return progress;
                                    }
                                });
                            }
                        },
                        cancelToken: new CancelToken(function executor(c) {
                            that.cancel = c;
                        })
                    }).then((res) => {
                        let result = res.data.data[0];
                        if (result.failCode === 0) {
                            that.progress = that.progress.map((progress, index) => {
                                if (index === that.count) {
                                    return {
                                        percent: progress.percent,
                                        status: 'uploaded'
                                    };
                                } else {
                                    return progress;
                                }
                            });
                        } else {
                            that.progress = that.progress.map((progress, index) => {
                                if (index === that.count) {
                                    return {
                                        percent: progress.percent,
                                        status: 'fail',
                                        message: result.failReason
                                    };
                                } else {
                                    return progress;
                                }
                            });
                        }
                    }).catch((err) => {
                        if (axios.isCancel(err)) {
                            that.progress = that.progress.map((progress, index) => {
                                if (index === that.count) {
                                    return {
                                        percent: progress.percent,
                                        status: 'canceled'
                                    };
                                } else {
                                    return progress;
                                }
                            });
                        } else {
                            that.progress = that.progress.map((progress, index) => {
                                if (index === that.count) {
                                    return {
                                        percent: progress.percent,
                                        status: 'error'
                                    };
                                } else {
                                    return progress;
                                }
                            });
                        }
                    }).finally(() => {
                        that.count++;
                        upload();
                    });
                }
            },
            cancelUpload(count) {
                if (count === this.count && this.cancel !== null) {
                    this.cancel();
                } else {
                    this.files = this.files.filter((file, index) => index !== count);
                    this.progress = this.progress.filter((progress, index) => index !== count);
                }
            }
        }
    };
</script>
<style scoped lang="less">
.upload-file {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    .upload-input {
        width: 60px;
        height: 0px;
    }
    .wrapper {
        position: relative;
        width: 80px;
        height: 32px;
        label, .upload-input {
            position: absolute;
            top: 0;
            left: 0;
            width: 80px;
            height: 32px;
        }
        .upload-input {
            opacity: 0;
            cursor: pointer;
        }
    }
}

.progress-bar {
    display: flex;
    .bar {
        flex: 1;
    }
    .percent {
        display: inline-block;
        width: 150px;
        height: 14px;
        line-height: 14px;
    }
    .delete-btn {
        margin-right: 10px;
        cursor: pointer;
    }
}
</style>

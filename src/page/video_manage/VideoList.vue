<!--视频列表组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'内容管理'},
            {name:'视频资源管理'},
            {name:'视频列表'}]">
        </custom-breadcrumb>
        <el-form :inline="true" class="demo-form-inline search-form text-left" @keyup.enter.native="searchHandler" @submit.native.prevent>
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
                <el-button type="primary" @click="searchHandler"><i class="el-icon-search"></i> 搜索</el-button>
            </el-form-item>
            <el-form-item class="create-account">
                <el-button type="primary" plain @click="showVideoUploadDialog('VOD')"><i class="el-icon-circle-plus-outline"></i> 上传视频</el-button>
                <!-- <el-button type="primary" plain @click="showVideoUploadDialog('VOD')"><i class="el-icon-circle-plus-outline"></i> 上传点播视频</el-button>
                <el-button type="primary" plain @click="showVideoUploadDialog('CAROUSEL')"><i class="el-icon-circle-plus-outline"></i> 上传轮播视频</el-button> -->
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
            <div class="upload-file">
                <div class="wrapper">
                    <label for="upload-input">
                        <el-button size="small" type="primary">选取文件</el-button>
                    </label>
                    <input id="upload-input" class="upload-input" type="file" ref="uploadInput" @change="uploadChangeHandler" multiple>
                </div>
            </div>
            <ul class="progress-bar-list">
                <li class="progress-bar-item" v-for="(item, index) in files" :key="index">
                    <p class="file-name">{{item.file.name}}</p>
                    <div class="progress-bar">
                        <el-progress
                            class="bar"
                            :stroke-width="3"
                            :percentage="item.progress.percent"
                            :status="item.progress.percent !== 100 ? 'exception' : 'success'">
                        </el-progress>
                        <i
                            v-if="!showDelete(index)"
                            @click="cancelUpload(index)"
                            class="delete-btn el-icon-close"></i>
                        <span class="percent">
                            {{ item.progress.percent + '% ' + (isChecking(index) ? '视频校验中, 请等待片刻' : uploadStatus(index)) }}
                            <i v-if="item.progress.status === 'uploading'" class="el-icon-loading"></i>
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
    import VideoTable from './VideoTable';
    import role from '@/util/config/role';
    export default {
        name: 'PersonList',
        components: {
            VideoTable
        },
        data() {
            return {
                xhr: null,
                files: [],
                count: 0,
                isUploading: false,
                videoUploadDialogVisible: false,
                videoTypeOptions: role.VIDEO_TYPE_OPTIONS,
                statusOptions: role.VIDEO_UPLOAD_STATUS_OPTIONS,
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
                        percent: this.files[index].progress.percent,
                        status: this.files[index].progress.status
                    };
                };
            },
            showDelete() {
                return (index) => {
                    let status = this.files[index].progress.status;
                    let percent = this.files[index].progress.percent;
                    return status === 'canceled' || status === 'uploaded' || status === 'error' || status === 'fail' || percent === 100;
                };
            },
            isChecking() {
                return (index) => {
                    let status = this.files[index].progress.status;
                    let percent = this.files[index].progress.percent;
                    return status === 'uploading' && percent === 100;
                };
            },
            uploadStatus() {
                return (index) => {
                    let status = this.files[index].progress.status;
                    let message = this.files[index].progress.message;
                    switch (status) {
                        // uploading checking canceld waiting uploaded error fail
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
                        case 'checking':
                            return '视频校验中，请稍候片刻';
                        case 'fail':
                            return message;
                        default:
                            return '';
                    }
                };
            }
        },
        created() {
            window.addEventListener('keyup', this.keyupHandler);
            this.timer = setInterval(() => {
                this.getVideoList();
            }, 1000 * 10);
        },
        beforeRouteLeave(to, from, next) {
            clearInterval(this.timer);
            this.timer = null;
            next();
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.keyupHandler);
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
            keyupHandler(e) {
                if (e.keyCode === 13) {
                    this.searchHandler();
                }
            },
            showVideoUploadDialog(videoType) {
                this.videoUploadDialogVisible = true;
                this.count = 0;
                this.setVideoType({videoType});
            },
            cancelHandler() {
                if (this.isUploading) {
                    this.$confirm('你确定要取消上传操作吗, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.videoUploadDialogVisible = false;
                        this.resetField();
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                } else {
                    this.videoUploadDialogVisible = false;
                    this.resetField();
                }
            },
            resetField() {
                this.count = 0;
                this.xhr && this.xhr.abort();
                this.xhr = null;
                this.files = [];
                this.isUploading = false;
                this.$refs.uploadInput.value = '';
            },
            inputHandler(value, key) {
                this.updateSearchFields({key, value});
            },
            searchHandler() {
                this.getVideoList();
            },
            uploadChangeHandler(e) {
                let files = Array.from(e.target.files);
                let newFileList = [];
                files.forEach((file) => {
                    let index = this.files.findIndex((item) => {
                        return item.file.name === file.name;
                    });
                    if (index === -1) {
                        let obj = {
                            file,
                            progress: {
                                percent: 0,
                                status: 'waiting',
                                message: ''
                            }
                        };
                        newFileList.push(obj);
                    }
                });
                this.files = this.files.concat(newFileList);
                this.uploadHandler();
            },
            uploadHandler() {
                let that = this;
                if (!that.isUploading) {
                    that.isUploading = true;
                    upload();
                }

                function upload() {
                    if (typeof that.files[that.count] === 'undefined') {
                        that.isUploading = false;
                        return false;
                    }
                    let formData = new FormData();
                    let file = that.files[that.count].file;
                    let videoType = that.getVideoType;
                    formData.append('videoType', videoType);
                    formData.append('file', file);

                    that.uploadRequest(formData)
                        .then((res) => {
                            let result = JSON.parse(res).data[0];
                            if (result.failCode === 0) {
                                that.files = that.files.map((obj, index) => {
                                    if (index === that.count) {
                                        return {
                                            file: obj.file,
                                            progress: {
                                                percent: obj.progress.percent,
                                                status: 'uploaded'
                                            }
                                        };
                                    } else {
                                        return obj;
                                    }
                                });
                            } else {
                                that.files = that.files.map((obj, index) => {
                                    if (index === that.count) {
                                        return {
                                            file: obj.file,
                                            progress: {
                                                percent: obj.progress.percent,
                                                status: 'fail',
                                                message: result.failReason
                                            }
                                        };
                                    } else {
                                        return obj;
                                    }
                                });
                            }
                            that.count++;
                            upload();
                        }).catch((err) => {
                            if (err && err.message === 'canceled_flag') {
                                that.files = that.files.map((obj, index) => {
                                    if (index === that.count) {
                                        return {
                                            file: obj.file,
                                            progress: {
                                                percent: obj.progress.percent,
                                                status: 'canceled',
                                                message: ''
                                            }
                                        };
                                    } else {
                                        return obj;
                                    }
                                });
                            } else {
                                that.files = that.files.map((obj, index) => {
                                    if (index === that.count) {
                                        return {
                                            file: obj.file,
                                            progress: {
                                                percent: obj.progress.percent,
                                                status: 'error',
                                                message: ''
                                            }
                                        };
                                    } else {
                                        return obj;
                                    }
                                });
                            }
                            that.count++;
                            upload();
                        });
                }
            },
            cancelUpload(count) {
                if (count === this.count && this.xhr !== null) {
                    this.xhr.abort();
                } else {
                    this.files = this.files.filter((file, index) => index !== count);
                }
            },
            uploadRequest(data) {
                let that = this;
                return new Promise((resolve, reject) => {
                    let url = '/v1/storage/video';
                    let xhr = new XMLHttpRequest();
                    that.xhr = xhr;
                    xhr.open('post', url);
                    let headers = that.$util.getUploadHeaders(that.$store.state.user.token);
                    for (let key in headers) {
                        xhr.setRequestHeader(key, headers[key]);
                    }
                    xhr.onload = (evt) => {
                        resolve(evt.target.responseText);
                    };
                    xhr.onerror = (err) => {
                        reject(err);
                    };
                    xhr.onabort = () => {
                        reject(new Error('canceled_flag')); // eslint-disable-line
                    };
                    xhr.upload.onprogress = (evt) => {
                        let percent = evt.loaded / evt.total * 100;
                        that.files = that.files.map((obj, index) => {
                            let progress = {
                                percent: parseInt(percent),
                                status: 'uploading',
                                message: ''
                            };
                            if (index === that.count) {
                                return {
                                    file: obj.file,
                                    progress
                                };
                            } else {
                                return obj;
                            }
                        });
                    };
                    xhr.send(data);
                });
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
        width: 220px;
        height: 14px;
        line-height: 14px;
        text-align: left;
    }
    .delete-btn {
        margin-right: 10px;
        cursor: pointer;
    }
}
</style>

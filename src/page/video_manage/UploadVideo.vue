<template>
    <div v-if="uploadState.files.length > 0" class="upload-video-container">
        <div v-if="uploadState.min" class="min-container">
            <span class="upload-status">正在上传({{uploadState.count}}/{{uploadState.files.length}}): {{currentFileName}}</span>
            <div class="btn-wrapper-min float-right">
                <span @click="toggleWindow(false)"><svg-icon class-name="max-min pointer" icon-class="max_larger"></svg-icon></span>
                <span>
                    <i @click="resetFiles" class="close-btn el-icon-close pointer"></i>
                </span>
            </div>
        </div>
        <div v-else class="max-container upload-wrapper">
            <div class="upload-file">
                <el-dropdown class="float-left">
                    <el-button
                        class="page-main-btn create-blue-btn contain-svg-icon"
                        >
                        <svg-icon icon-class="upload"></svg-icon>
                        上传视频<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <div class="wrapper">
                                <input id="upload-input-file2" class="upload-input" accept="video/*" type="file" ref="uploadInputFile" multiple>
                                <label for="upload-input-file">选择文件</label>
                            </div>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <div class="wrapper">
                                <input id="upload-input-dir2" class="upload-input" type="file" accept="video/*" ref="uploadInputDir" multiple directory webkitdirectory allowdirs>
                                <label for="upload-input-dir">选择文件夹</label>
                            </div>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <div class="btn-wrapper-max float-right">
                    <span @click="toggleWindow(true)"><svg-icon class-name="max-min pointer" icon-class="min_smaller"></svg-icon></span>
                    <span>
                        <i @click="resetFiles" class="close-btn el-icon-close pointer"></i>
                    </span>
                </div>
            </div>
            <div class="table-wrapper">
                <el-table
                    :data="uploadState.files"
                    :show-header="false"
                    :empty-text="'暂无上传内容'"
                    style="width: 100%">
                    <el-table-column
                        width="400"
                        label="文件名">
                        <template slot-scope="scope">
                            <el-tooltip class="item" effect="dark" :content="scope.row.file.name" placement="top-start">
                                <span>{{cutStr(scope.row.file.name)}}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="100"
                        label="文件大小">
                        <template slot-scope="scope">
                            {{convertFileSize(scope.row.file.size)}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="180"
                        label="上传进度">
                        <template slot-scope="scope">
                            <el-progress
                                class="bar"
                                :stroke-width="3"
                                :percentage="scope.row.progress.percent"
                                :status="scope.row.progress.percent !== 100 ? 'primary' : 'success'">
                            </el-progress>
                            <span class="percent">
                                <span>{{scope.row.progress.percent}}%</span>
                                <span :class="uploadStatusColor(scope.$index)">{{(isChecking(scope.$index) ? '视频校验中, 请等待片刻' : uploadStatus(scope.$index))}}</span>
                                <i v-if="scope.row.progress.status === 'uploading'" class="el-icon-loading"></i>
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="操作">
                        <template slot-scope="scope">
                            <i
                                v-if="!showDelete(scope.$index)"
                                @click="cancelUpload(scope.$index)"
                                class="delete-btn el-icon-close pointer"></i>
                            <el-button type="text" v-if="showRetryBtn(scope.$index)" @click="retryUploadHandler(scope.$index)">重试</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex';
import store from 'store';
import axios from 'axios';
const Uppie = require('../../assets/js/uppie');
const uppie = new Uppie();
export default {
    name: 'UploadVideo',
    data() {
        return {
            cancelFlag: 0 // 0 表示手动cancel， 1表示点击重试之后的cancel
        };
    },
    created() {
        let that = this;
        window.eventBus.$on('startUpload', that.uploadHandler);
        this.$nextTick(() => {
            let uploadInputFile = document.querySelector('#upload-input-file2');
            let uploadInputDir = document.querySelector('#upload-input-dir2');
            uploadInputFile && uppie(uploadInputFile, this.uploadChangeHandler.bind(this));
            uploadInputDir && uppie(uploadInputDir, this.uploadChangeHandler.bind(this));
        });
        window.addEventListener('beforeunload', (e) => {
            if (that.uploadState.isUploading) {
                e = e || window.event;
                if (e) {
                    e.returnValue = '当前有视频正在上传中，确定要离开吗？';
                }
                return '当前有视频正在上传中，确定要离开吗？';
            }
        }, true);
    },
    computed: {
        ...mapGetters({
            uploadState: 'uploadVideo/uploadState'
        }),
        currentFileName() {
            let obj = this.uploadState.files[this.uploadState.count];
            return obj ? obj.file.name : '上传完成';
        },
        getProgress() {
            return (index) => {
                return {
                    percent: this.uploadState.files[index].progress.percent,
                    status: this.uploadState.files[index].progress.status
                };
            };
        },
        showDelete() {
            return (index) => {
                let status = this.uploadState.files[index].progress.status;
                let percent = this.uploadState.files[index].progress.percent;
                return status === 'canceled' ||
                        status === 'uploaded' ||
                        status === 'error' ||
                        status === 'exist' ||
                        status === 'saveErr' ||
                        status === 'sizeErr' ||
                        status === 'transErr' ||
                        percent === 100;
            };
        },
        isChecking() {
            return (index) => {
                let status = this.uploadState.files[index].progress.status;
                let percent = this.uploadState.files[index].progress.percent;
                return status === 'uploading' && percent === 100;
            };
        },
        showRetryBtn() {
            return (index) => {
                let status = this.uploadState.files[index].progress.status;
                return status === 'saveErr' ||
                        status === 'canceled' ||
                        status === 'error' ||
                        status === 'transErr';
            };
        },
        uploadStatusColor() {
            return (index) => {
                let status = this.uploadState.files[index].progress.status;
                switch (status) {
                    // uploading checking canceld waiting uploaded error fail
                    //  exist 已存在， saveErr 保存失败, sizeErr, transErr 转码失败
                    case 'uploading':
                        return 'text-success';
                    case 'canceled':
                    case 'waiting':
                    case 'exist':
                        return 'text-info';
                    case 'uploaded':
                        return 'text-success';
                    case 'error':
                    case 'saveErr':
                    case 'transErr':
                        return 'text-danger';
                    case 'checking':
                        return 'text-success';
                    case 'sizeErr':
                        return 'text-warning';
                    default:
                        return '';
                }
            };
        },
        uploadStatus() {
            return (index) => {
                let status = this.uploadState.files[index].progress.status;
                let message = this.uploadState.files[index].progress.message;
                switch (status) {
                    // uploading checking canceld waiting uploaded error fail
                    //  exist 已存在， saveErr 保存失败, sizeErr, transErr 转码失败
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
                    case 'exist':
                    case 'saveErr':
                    case 'sizeErr':
                    case 'transErr':
                        return message;
                    default:
                        return '';
                }
            };
        }
    },
    methods: {
        ...mapMutations({
            updateUploadState: 'uploadVideo/updateUploadState'
        }),
        cutStr(str) {
            return str.length > 30 ? str.substring(0, 30) + '...' : str;
        },
        resetFiles() {
            if (this.uploadState.isUploading) {
                this.$confirm('当前有视频正在上传中，确定要离开吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    if (this.uploadState.isUploading) {
                        this.updateUploadState({key: 'clearFlag', value: true});
                    }
                    this.resetField();
                    this.$message.success('上传列表已清空');
                }).catch(() => {
                    this.$message.info('取消清空列表');
                });
            } else {
                this.updateUploadState({key: 'clearFlag', value: false});
                this.resetField();
                this.$message.success('上传列表已清空');
            }
        },
        uploadChangeHandler(e) {
            let files = Array.from(e.target.files).filter((file) => {
                return /(.mpg|.ts)$/.test(file.name);
            });
            if (files.length === 0) {
                this.$message.warning('本次选择没有符合要求的文件');
            }
            let newFileList = [];
            files.forEach((file) => {
                let index = this.uploadState.files.findIndex((item) => {
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
            let newFiles = this.uploadState.files.concat(newFileList);
            this.updateUploadState({key: 'files', value: newFiles});
            window.eventBus.$emit('startUpload');
            this.$refs.uploadInputFile.value = null;
            this.$refs.uploadInputDir.value = null;
        },
        checkServerIsLiving(count) {
            let that = this;
            return new Promise((resolve, reject) => {
                let servers = store.get('servers') || [];
                let totalServers = servers.reduce((res, curr) => {
                    let times = curr.weight;
                    let currServers = [];
                    for (let i = 0; i < times; i++) {
                        currServers.push(`${curr.ip}:${curr.port}`);
                    }
                    return res.concat(currServers);
                }, []);

                let index = count % totalServers.length;
                let baseUri = `http://${totalServers[index]}`;
                let timer = null;

                loopCheck();

                function loopCheck() {
                    if (index + 1 >= totalServers.length) {
                        index = 0;
                    } else {
                        index = index + 1;
                    }
                    baseUri = `http://${totalServers[index]}`;

                    that.checkServerAvailableRequest(baseUri)
                        .then((res) => {
                            if (res.status === 200) {
                                if (res && res.data && res.data.code === 0) {
                                    resolve(baseUri);
                                    clearTimeout(timer);
                                } else {
                                    clearTimeout(timer);
                                    timer = setTimeout(() => {
                                        loopCheck();
                                    }, 3000);
                                }
                            }
                        }).catch(() => {
                            clearTimeout(timer);
                            timer = setTimeout(() => {
                                loopCheck();
                            }, 3000);
                            that.$util.showNetworkErrorMessage();
                        });
                }
            });
        },
        checkServerAvailableRequest(baseUri) {
            let headers = this.$util.getUploadHeaders(this.$store.state.user.token);
            return axios.get(`${baseUri}/v1/server/available`, {
                headers,
                timeout: 2000
            });
        },
        uploadHandler() {
            let that = this;
            if (!that.uploadState.isUploading) {
                that.updateUploadState({key: 'isUploading', value: true});
                upload();
            }
            function upload() {
                if (typeof that.uploadState.files[that.uploadState.count] === 'undefined') {
                    that.updateUploadState({key: 'isUploading', value: false});
                    return false;
                }
                that.updateUploadState({key: 'isUploading', value: true});
                let obj = that.uploadState.files[that.uploadState.count];
                let status = obj.progress.status === 'saveErr' ||
                             obj.progress.status === 'canceled' ||
                             obj.progress.status === 'error' ||
                             obj.progress.status === 'waiting' ||
                             obj.progress.status === 'transErr';
                if (status) {
                    let formData = new FormData();
                    let file = that.uploadState.files[that.uploadState.count].file;
                    formData.append('videoType', 'VOD');
                    formData.append('file', file);
                    that.checkServerIsLiving(that.uploadState.count)
                        .then((baseUri) => {
                            that.uploadRequest(formData, baseUri)
                                .then((res) => {
                                    let result = JSON.parse(res).data[0];
                                    if (result.failCode === 0) {
                                        let files = that.uploadState.files.map((obj, index) => {
                                            if (index === that.uploadState.count) {
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
                                        that.updateUploadState({key: 'files', value: files});
                                    } else {
                                        let status = '';
                                        //  exist 已存在， saveErr 保存失败, sizeErr 分辨率不合适, transErr 转码失败
                                        switch (result.failCode) {
                                            case 3302:
                                                status = 'transErr';
                                                break;
                                            case 3305:
                                                status = 'saveErr';
                                                break;
                                            case 3300:
                                                status = 'exist';
                                                break;
                                            case 3307:
                                                status = 'sizeErr';
                                                break;
                                            default:
                                                status = 'error';
                                                break;
                                        }

                                        let files = that.uploadState.files.map((obj, index) => {
                                            if (index === that.uploadState.count) {
                                                return {
                                                    file: obj.file,
                                                    progress: {
                                                        percent: obj.progress.percent,
                                                        status,
                                                        message: result.failReason
                                                    }
                                                };
                                            } else {
                                                return obj;
                                            }
                                        });

                                        that.updateUploadState({key: 'files', value: files});
                                    }
                                    that.updateUploadState({key: 'count', value: that.uploadState.count + 1});
                                    upload();
                                }).catch((err) => {
                                    if (err && err.message === 'canceled_flag') {
                                        let files = that.uploadState.files.map((obj, index) => {
                                            if (index === that.uploadState.count) {
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
                                        that.updateUploadState({key: 'files', value: files});
                                        if (!that.uploadState.clearFlag) {
                                            that.updateUploadState({key: 'count', value: that.uploadState.count + 1});
                                        }
                                        that.updateUploadState({key: 'clearFlag', value: false});
                                    } else {
                                        let files = that.uploadState.files.map((obj, index) => {
                                            if (index === that.uploadState.count) {
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
                                        that.updateUploadState({key: 'files', value: files});
                                        that.updateUploadState({key: 'count', value: that.uploadState.count + 1});
                                    }
                                    upload();
                                });
                        });
                } else {
                    that.updateUploadState({key: 'count', value: that.uploadState.count + 1});
                    that.updateUploadState({key: 'isUploading', value: false});
                    upload();
                }
            }
        },
        toggleWindow(status) {
            this.updateUploadState({key: 'min', value: status});
        },
        cancelUpload(count) {
            let name = this.uploadState.files[count].file.name;
            if (count === this.uploadState.count && this.uploadState.xhr !== null) {
                this.uploadState.xhr.abort();
            } else {
                let files = this.uploadState.files.filter((file, index) => index !== count);
                this.updateUploadState({key: 'files', value: files});
            }
            this.$message.error(`${name}, 已取消上传`);
            if (this.uploadState.files.length === 0) {
                this.resetField();
            }
        },
        uploadRequest(data, baseUri) {
            let that = this;
            return new Promise((resolve, reject) => {
                // let url = this.$util.getRandomUrl('/v1/storage/video', this.uploadState.count);
                let url = `${baseUri}/v1/storage/video`;
                let xhr = new XMLHttpRequest();
                that.updateUploadState({key: 'xhr', value: xhr});
                xhr.open('post', url);
                let headers = that.$util.getUploadHeaders(that.$store.state.user.token);
                for (let key in headers) {
                    xhr.setRequestHeader(key, headers[key]);
                }
                xhr.onload = (evt) => {
                    resolve(evt.target.responseText);
                };
                xhr.onerror = (err) => {
                    if (window.navigator.onLine) {
                        this.$message({
                            message: '服务器连接失败，请稍后重试',
                            type: 'error'
                        });
                    } else {
                        this.$message({
                            message: '网络连接失败，请检查您的网络连接情况',
                            type: 'error'
                        });
                    }
                    reject(err);
                };
                xhr.onabort = () => {
                    reject(new Error('canceled_flag')); // eslint-disable-line
                };
                xhr.upload.onprogress = (evt) => {
                    let percent = evt.loaded / evt.total * 100;
                    let files = that.uploadState.files.map((obj, index) => {
                        let progress = {
                            percent: parseInt(percent),
                            status: 'uploading',
                            message: ''
                        };
                        if (index === that.uploadState.count) {
                            return {
                                file: obj.file,
                                progress
                            };
                        } else {
                            return obj;
                        }
                    });
                    that.updateUploadState({key: 'files', value: files});
                };
                xhr.send(data);
            });
        },
        retryUploadHandler(count) {
            this.cancelFlag = 1;
            if (this.uploadState.isUploading) {
                this.$message.error('当前有视频正在上传中，请稍后再重试');
                return false;
            } else {
                this.updateUploadState({key: 'count', value: count});
                this.uploadHandler();
            }
        },
        resetField() {
            this.uploadState.xhr && this.uploadState.xhr.abort();
            this.updateUploadState({key: 'xhr', value: null});
            this.updateUploadState({key: 'count', value: 0});
            this.updateUploadState({key: 'files', value: []});
            this.updateUploadState({key: 'isUploading', value: false});
            this.$refs.uploadInputFile.vale = '';
            this.$refs.uploadInputDir.value = '';
            window.eventBus.$emit('clearInputValue');
        },
        convertFileSize(size) {
            let kb = 1024;
            let mb = kb * 1024;
            let gb = mb * 1024;
            if (!size) {
                return '';
            }
            if (size >= gb) {
                return Math.round(size / gb) + 'Gb';
            } else if (size >= mb) {
                let f = size / mb;
                return Math.round(f) + 'Mb';
            } else if (size >= kb) {
                let f = size / kb;
                return Math.round(f) + 'Kb';
            } else {
                return size + 'Byte';
            }
        }
    }
};
</script>
<style lang="less" scoped>
.upload-video-container {
    position:absolute;
    bottom: 3px;
    right: 20px;
    width: 800px;
    padding: 0 20px;
    background: #fff;
    z-index: 300;
    border-radius: 8px;
    box-shadow: #409EFF 0 0 5px;
    .min-container {
        height: 60px;
        line-height: 60px;
        overflow: hidden;
        .upload-status {
            float: left;
            width: 80%;
            text-align: left;
        }
    }
    .upload-btn {
        margin-right: 10px;
    }
}
.table-wrapper {
    height: 500px;
    overflow-y: scroll;
}
.upload-file {
    padding: 20px 0;
    border-bottom: 1px solid #409EFF;
    overflow: hidden;
    .clear-btn {
        float: left;
    }
}
.wrapper {
    position: relative;
    width: 80px;
    height: 32px;
    margin-right: 10px;
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

.pause-btn {
    color: #409EFF;
    border-color: #409EFF;
    background-color: transparent;
    &:hover,
    &:focus {
        color: #409EFF;
        border-color: #409EFF;
        background-color: transparent;
    }
    span {
        color: #409EFF;
    }
}
.delete-btn {
    color: #000;
    border-color: #F56C6C;
    background-color: transparent;
    font-size: 18px;
    &:hover,
    &:focus {
        color: #F56C6C;
        border-color: #F56C6C;
        background-color: transparent;
    }
}
.close-btn {
    color: #D8D8D8;
    font-size: 18px;
    margin-left: 6px;
    &:hover {
        color: #F56C6C;
    }
}

.max-min {
    fill: #D8D8D8;
    &:hover {
        fill:#1989FA;
    }
}
.btn-wrapper-max {
    height: 38px;
    line-height: 38px;
}

.btn-wrapper-min {
    height: 60px;
    line-height: 60px;
}
</style>

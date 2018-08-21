<template>
    <div class="upload-video-container">
        <el-dropdown class="upload-dropdown pointer" style="margin-right:20px;" trigger="click">
            <span class="el-dropdown-link">
                上传视频<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="upload-dropdown-container" style="margin-top:30px;" slot="dropdown">
                <div class="upload-wrapper">
                    <div class="upload-file">
                        <div class="wrapper">
                            <label for="upload-input">
                                <el-button size="small" type="primary">选取文件</el-button>
                            </label>
                            <input id="upload-input" class="upload-input" type="file" ref="uploadInput" multiple directory webkitdirectory allowdirs>
                        </div>
                        <el-button size="small" type="danger" icon="el-icon-delete" @click="resetFiles">清空上传列表</el-button>
                    </div>
                    <div class="table-wrapper">
                        <el-table
                            :data="files"
                            :show-header="false"
                            :empty-text="'暂无上传内容'"
                            style="width: 100%">
                            <el-table-column
                                width="600"
                                align="center"
                                label="文件名">
                                <template slot-scope="scope">
                                    {{scope.row.file.name}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                width="100"
                                align="center"
                                label="文件大小">
                                <template slot-scope="scope">
                                    {{convertFileSize(scope.row.file.size)}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                width="400"
                                align="center"
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
                                align="center"
                                label="操作">
                                <template slot-scope="scope">
                                    <i
                                        v-if="!showDelete(scope.$index)"
                                        @click="cancelUpload(scope.$index)"
                                        class="delete-btn el-icon-close pointer"></i>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-dropdown-menu>
        </el-dropdown>
    </div>
</template>
<script>
const Uppie = require('../../assets/js/uppie');
const uppie = new Uppie();
export default {
    name: 'UploadVideo',
    data() {
        return {
            xhr: null,
            files: [],
            count: 0,
            isUploading: false,
            timer: null,
            clearFlag: false
        };
    },
    created() {
        let that = this;
        this.$nextTick(() => {
            uppie(document.querySelector('#upload-input'), this.uploadChangeHandler.bind(this));
        });
        window.addEventListener('beforeunload', (e) => {
            if (that.isUploading) {
                e = e || window.event;
                if (e) {
                    e.returnValue = '当前有视频正在上传中，确定要离开吗？';
                }
                return '当前有视频正在上传中，确定要离开吗？';
            }
        }, true);
    },
    computed: {
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
                let status = this.files[index].progress.status;
                let percent = this.files[index].progress.percent;
                return status === 'uploading' && percent === 100;
            };
        },
        uploadStatusColor() {
            return (index) => {
                let status = this.files[index].progress.status;
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
                let status = this.files[index].progress.status;
                let message = this.files[index].progress.message;
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
        resetFiles() {
            this.$confirm('请输入新类型', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(() => {
                this.clearFlag = true;
                this.resetField();
                this.$message.success('上传列表已清空');
            }).catch(() => {
                this.$message.info('取消清空列表');
            });
        },
        uploadChangeHandler(e) {
            // 初始化count值
            let files = Array.from(e.target.files).filter((file) => {
                return /.mpg$/.test(file.name);
            });
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
                            }

                            that.files = that.files.map((obj, index) => {
                                if (index === that.count) {
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
                            if (!that.clearFlag) {
                                that.count++;
                            }
                            that.clearFlag = false;
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
                            that.count++;
                        }
                        // that.count++;
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
            let name = this.files[count].file.name;
            this.$message.error(`${name}, 已取消上传`);
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
        },
        resetField() {
            this.xhr && this.xhr.abort();
            this.xhr = null;
            this.count = 0;
            this.files = [];
            this.isUploading = false;
            this.$refs.uploadInput.value = '';
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
.upload-dropdown-container {
    padding: 0 20px;
}
.upload-wrapper {
    width: 1200px;
}
.table-wrapper {
    height: 600px;
    overflow-y: scroll;
}
.upload-file {
    padding: 20px 0;
    border-bottom: 1px solid #000;
    overflow: hidden;
    .upload-input {
        width: 60px;
        height: 0px;
    }
    .wrapper {
        float: left;
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
    color: #F56C6C;
    border-color: #F56C6C;
    background-color: transparent;
    font-size: 20px;
    &:hover,
    &:focus {
        color: #F56C6C;
        border-color: #F56C6C;
        background-color: transparent;
    }
}
</style>

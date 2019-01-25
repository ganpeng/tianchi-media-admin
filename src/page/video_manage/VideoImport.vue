<template>
    <div class="video-import-container import-container">
        <div class="left">
            <div class="header">
                <h3>
                    <span>正在上传({{uploadState.count}}/{{uploadState.files.length}}): {{cutStr(currentFileName, 80)}}</span>
                </h3>
            </div>
            <div class="seperator-line"></div>
            <div class="info-field">
                <ul class="file-upload-info-list">
                    <li v-for="(item, index) in uploadState.files" :key="index" class="file-upload-info-item">
                        <span class="index">{{index + 1}}</span>
                        <div class="name">
                            <el-tooltip class="item" effect="dark" :content="item.file.name" placement="top-start">
                                <span>{{cutStr(item.file.name, 58)}}</span>
                            </el-tooltip>
                            <el-progress
                                class="bar"
                                :show-text="false"
                                :stroke-width="3"
                                :percentage="item.progress.percent"
                                :color="progressBarColor(index)">
                            </el-progress>
                        </div>
                        <span class="size">{{convertFileSize(item.file.size)}}</span>
                        <span :class="['percent', uploadStatusColor(index)]">{{item.progress.percent}}%</span>
                        <span :class="['status', uploadStatusColor(index)]">
                            {{(isChecking(index) ? '视频校验中, 请等待片刻' : uploadStatus(index))}}
                        </span>
                        <span class="control">
                            <i
                                v-if="!showDelete(index)"
                                @click="cancelUpload(index)"
                                class="text-danger pointer">取消</i>
                            <span v-if="showRetryBtn(index)" @click="retryUploadHandler(index)"
                                  class="text-primary pointer">重试</span>
                        </span>
                    </li>
                </ul>
                <div v-if="uploadState.files.length === 0" class="empty-upload">
                    <img src="../../assets/img/empty_upload.png" alt="">
                    <p>暂无上传内容</p>
                </div>
                <div class="btn-group">
                    <el-button class="btn-style-three" @click="gotoList" plain>返回列表</el-button>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="inner-right">
                <div class="header">
                    <h3>批量导入区域</h3>
                </div>
                <div class="seperator-line"></div>
                <div class="input-field">
                    <h5>拖拽文件到此区域进行上传</h5>
                    <div id="video-drag-container" class="uploader">
                        <label class="ui_button ui_button_primary" for="video-uploader-input">
                            <i class="el-icon-plus"></i>
                        </label>
                    </div>
                    <div class="upload-btn-wrapper">
                        <div class="btn-uploader">
                            <label
                                @click="openSetShareSiteDialogBeforeUpload('FILE')"
                                class="ui_button ui_button_primary">
                                <svg-icon icon-class="video"></svg-icon>
                                选择文件
                            </label>
                        </div>
                        <div class="btn-uploader">
                            <label
                                @click="openSetShareSiteDialogBeforeUpload('FOLDER')"
                                class="ui_button ui_button_primary">
                                <svg-icon icon-class="directory"></svg-icon>
                                选择文件夹
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!--上传视频---选择文件-->
        <input
            v-show="false"
            id="upload-input-file2"
            class="upload-input"
            accept="video/*, application/zip"
            type="file"
            ref="uploadInputFile"
            multiple>
        <!--上传视频---选择文件夹-->
        <input
            v-show="false"
            id="upload-input-dir2"
            class="upload-input"
            type="file"
            accept="video/*"
            ref="uploadInputDir"
            multiple
            directory
            webkitdirectory
            allowdirs>
        <!--上传视频前进行共享站点设置-->
        <el-dialog
            title="预设共享站点"
            :visible.sync="preSetShareSiteDialogVisible"
            :close-on-click-modal="false"
            :append-to-body="true"
            custom-class="batch-share-site normal-dialog"
            width="40%">
            <div class="batch-share-body" v-if="preSetShareSiteDialogVisible">
                <div class="tips">您可预先设置这批视频可被共享的站点，注入成功后将会生效，生效后也可修改。</div>
                <div class="tips">您也可以待注入完成后再批量设置。</div>
                <div class="text-center">
                    <el-select
                        v-model="preSetShareSiteIdList"
                        multiple
                        clearable
                        @change="setShareSites"
                        placeholder="请选择共享站点">
                        <el-option
                            v-for="(item, index) in shareSiteOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="skipPreSetting" type="primary" plain>跳过此步</el-button>
                <el-button type="primary" @click="preSetShareSiteToVideo(true)">确定设置</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        name: 'VideoImport',
        data() {
            return {
                // 设置共享站点在视频上传之前
                preSetShareSiteIdList: [],
                preSetShareSiteDialogVisible: false,
                // 保存用户选择上传视频的模式----'FILE'、'FOLDER'
                uploadVideoMode: '',
                shareSiteOptions: [],
                cancelFlag: 0 // 0 表示手动cancel， 1表示点击重试之后的cancel
            };
        },
        created() {
            let that = this;
            window.eventBus.$on('startUpload', that.uploadHandler);
            this.$nextTick(() => {
                let body = document.querySelector('body');
                let dragContainer = document.querySelector('#video-drag-container');

                body.addEventListener('input', (e) => {
                    let id = e.target.getAttribute('id');
                    if (id === 'upload-input-file2' || id === 'upload-input-dir2') {
                        let files = e.target.files;
                        that.uploadChangeHandler(files);
                    }
                });

                dragContainer.addEventListener('drop', (evt) => {
                    evt.stopPropagation();
                    evt.preventDefault();

                    const dt = evt.dataTransfer;
                    const files = dt.files;
                    const item = dt.items[0];
                    if (item.webkitGetAsEntry().isDirectory) {
                        this.$message.error('只能拖拽上传文件，不支持文件夹');
                        return false;
                    }
                    if (files.length > 0) {
                        this.uploadChangeHandler(files);
                    }
                });

                dragContainer.addEventListener('dragover', function (evt) {
                    evt.stopPropagation();
                    evt.preventDefault();
                });
            });
            //  如果有视频正在上传的话，组织浏览器刷新
            window.addEventListener('beforeunload', (e) => {
                if (that.uploadState.isUploading) {
                    e = e || window.event;
                    if (e) {
                        e.returnValue = '当前有视频正在上传中，确定要离开吗？';
                    }
                    return '当前有视频正在上传中，确定要离开吗？';
                }
            }, true);
            // 初始化共享站点的列表
            this.$service.getAllSiteList().then(response => {
                if (response && response.code === 0) {
                    this.shareSiteOptions = response.data;
                    this.shareSiteOptions.unshift({id: '0', name: '全选'});
                }
            });
        },
        computed: {
            ...mapGetters({
                uploadState: 'uploadVideo/uploadState'
            }),
            successCount() {
                return this.uploadState.files.filter((item) => item.progress.status === 'uploaded').length;
            },
            errorCount() {
                return this.uploadState.files.filter((item) => {
                    return item.progress.status !== 'uploaded';
                }).length;
            },
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
                        case 'checking':
                        case 'uploading':
                            return 'text-primary';
                        case 'canceled':
                        case 'waiting':
                            return 'text-info';
                        case 'uploaded':
                            return 'text-success';
                        case 'error':
                        case 'saveErr':
                        case 'transErr':
                            return 'text-danger';
                        case 'exist':
                        case 'sizeErr':
                            return 'text-warning';
                        default:
                            return '';
                    }
                };
            },
            progressBarColor() {
                return (index) => {
                    let status = this.uploadState.files[index].progress.status;
                    switch (status) {
                        // uploading checking canceld waiting uploaded error fail
                        //  exist 已存在， saveErr 保存失败, sizeErr, transErr 转码失败
                        case 'checking':
                        case 'uploading':
                            return '#1989FA';
                        case 'canceled':
                        case 'waiting':
                            return '#909399';
                        case 'uploaded':
                            return '#3AC26F';
                        case 'error':
                        case 'saveErr':
                        case 'transErr':
                            return '#C35757';
                        case 'exist':
                        case 'sizeErr':
                            return '#E6A23C';
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
            // 设置共享站点，对全选进行处理
            setShareSites() {
                this.preSetShareSiteIdList.map(siteId => {
                    if (siteId === '0') {
                        this.preSetShareSiteIdList = [];
                        this.shareSiteOptions.map(siteOption => {
                            if (siteOption.name !== '全选') {
                                this.preSetShareSiteIdList.push(siteOption.id);
                            }
                        });
                    }
                });
            },
            // 跳过预设共享设置
            skipPreSetting() {
                this.preSetShareSiteIdList = [];
                this.preSetShareSiteToVideo();
            },
            // 在预设共享站点之后进行上传视频
            preSetShareSiteToVideo() {
                this.preSetShareSiteDialogVisible = false;
                if (this.uploadVideoMode === 'FILE') {
                    this.$el.querySelector('#upload-input-file2').click();
                } else if (this.uploadVideoMode === 'FOLDER') {
                    this.$el.querySelector('#upload-input-dir2').click();
                }
            },
            // 在上传视频之前打开设置共享站点设置弹窗
            openSetShareSiteDialogBeforeUpload(uploadVideoMode) {
                // 如果是中心站点，进行预设共享站点
                if (this.$wsCache.localStorage.get('siteInfo') && this.$wsCache.localStorage.get('siteInfo').siteMasterEnable) {
                    this.uploadVideoMode = uploadVideoMode;
                    this.preSetShareSiteIdList = [];
                    this.preSetShareSiteDialogVisible = true;
                } else {
                    // 非中心站点直接开始选择文件或文件夹
                    if (uploadVideoMode === 'FILE') {
                        this.$el.querySelector('#upload-input-file2').click();
                    } else if (uploadVideoMode === 'FOLDER') {
                        this.$el.querySelector('#upload-input-dir2').click();
                    }
                }
            },
            ...mapMutations({
                updateUploadState: 'uploadVideo/updateUploadState'
            }),
            cutStr(str, count) {
                if (count === undefined || count === null) {
                    count = 30;
                }
                return str.length > count ? str.substring(0, count) + '...' : str;
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
            uploadChangeHandler(inputFiles) {
                // let files = Array.from(e.target.files).filter((file) => {
                //     return /(.mpg|.ts|.zip)$/.test(file.name);
                // });
                let files = Array.from(inputFiles).filter((file) => {
                    return /(.mpg|.ts|.zip)$/.test(file.name);
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
                            shareSiteList: this.preSetShareSiteIdList,
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
                        let shareSiteList = that.uploadState.files[that.uploadState.count].shareSiteList;
                        formData.append('videoType', 'VOD');
                        formData.append('file', file);
                        // 添加共享站点的id列表
                        formData.append('shareSiteList', shareSiteList);
                        that.$util.getUploadServer()
                            .then((baseUri) => {
                                that.uploadRequest(formData, baseUri)
                                    .then((res) => {
                                        let result = JSON.parse(res).data[0];
                                        if (result.failCode === 0) {
                                            let files = that.uploadState.files.map((obj, index) => {
                                                if (index === that.uploadState.count) {
                                                    return {
                                                        file: obj.file,
                                                        shareSiteList: obj.shareSiteList,
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
                                                        shareSiteList: obj.shareSiteList,
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
                                                    shareSiteList: obj.shareSiteList,
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
                                                    shareSiteList: obj.shareSiteList,
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
                                    shareSiteList: obj.shareSiteList,
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
            },
            gotoList() {
                this.$router.push({name: 'VideoList'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .video-import-container {
        overflow: hidden;
        background: #1A2233;
        .file-upload-info-list {
            width: 100%;
            height: 800px;
            overflow-y: scroll;
            font-size: 16px;
            color: #6F7480;
            .file-upload-info-item {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                margin: 20px 0;
                text-align: left;
                .index {
                    width: 60px;
                    text-align: center;
                }
                .name {
                    width: 700px;
                    font-size: 14px;
                }
                .size {
                    width: 80px;
                    font-size: 16px;
                    text-align: center;
                }
                .percent {
                    text-align: center;
                    width: 80px;
                }
                .status {
                    width: 250px;
                    text-align: center;
                }
                .control {
                    // width: 30px;
                    text-align: center;
                    .el-button {
                        min-width: none;
                    }
                }
            }
        }
    }

    /*批量共享视频*/
    .batch-share-site {
        .batch-share-body {
            text-align: left;
            margin-bottom: 40px;
            div {
                text-align: left;
                font-size: 18px;
                &.tips {
                    margin-bottom: 20px;
                    font-size: 14px;
                    line-height: 16px;
                    text-align: center;
                }
                &.text-center {
                    text-align: center;
                }
            }
            .el-select {
                margin-top: 20px;
                width: 80%;
            }
        }
    }

</style>

<style lang="scss">

    .el-progress-bar__outer {
        background-color: #3E495E;
    }

</style>

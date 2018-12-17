<template>
    <div class="live-channel-import-container import-container">
        <div class="left">
            <div class="header">
                <h3>上传状态
                    <span>共{{files.length}}条, </span>
                    <span>成功</span>
                    <span class="text-success">{{successCount}}</span>
                    <span>条, </span>
                    <span>失败</span>
                    <span class="text-danger">{{errorCount}}</span>
                    <span>条</span>
                </h3>
            </div>
            <div class="seperator-line"></div>
            <div class="info-field">
                <div class="table-field">
                    <el-table
                        v-if="files.length > 0"
                        :data="files"
                        class="my-style-table"
                        style="width: 100%">
                        <el-table-column
                            width="140"
                            align="center"
                            label="序号">
                            <template slot-scope="scope">
                                {{scope.$index + 1}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            label="文件名称">
                            <template slot-scope="scope">
                                <span>{{scope.row.file.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            width="200"
                            align="center"
                            label="提示信息">
                            <template slot-scope="scope">
                                <span v-html="scope.row.message"></span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-if="files.length === 0" class="empty-upload">
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
                    <div id="live-channel-drag-container" class="uploader">
                        <label class="ui_button ui_button_primary">
                            <i class="el-icon-plus"></i>
                        </label>
                    </div>
                    <div class="upload-btn-wrapper">
                        <div class="btn-uploader">
                            <label class="ui_button ui_button_primary" for="live-channel-import-uploader">
                                选择文件
                            </label>
                            <input name="file" ref="liveChannelImportUploader" multiple class="el-upload__input" type="file" id="live-channel-import-uploader" accept="application/xml">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'LiveChannelImport',
    data() {
        return {
            //  节目单上传变量
            isUploading: false,
            files: [],
            count: 0
        };
    },
    created() {
        this.$nextTick(() => {
            let testUpload = document.querySelector('#live-channel-import-uploader');
            let dragContainer = document.querySelector('#live-channel-drag-container');

            testUpload.addEventListener('change', (e) => {
                let file = e.target.files[0];
                this.uploadChangeHandler(file);
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
            // testUpload.addEventListener('change', this.uploadChangeHandler.bind(this));
        });
    },
    computed: {
        successCount() {
            return this.files.filter((item) => item.status === 'success').length;
        },
        errorCount() {
            return this.files.filter((item) => item.status === 'error').length;
        }
    },
    methods: {
        uploadChangeHandler(inputFiles) {
            // let files = Array.from(e.target.files).filter((file) => {
            //     return /(.xml)$/.test(file.name);
            // });
            let files = Array.from(inputFiles).filter((file) => {
                return /(.xml)$/.test(file.name);
            });
            if (files.length === 0) {
                this.$message.warning('本次选择没有符合要求的文件');
            }
            let newFileList = [];
            files.forEach((file) => {
                let index = this.files.findIndex((item) => {
                    return item.file.name === file.name;
                });
                if (index === -1) {
                    let obj = {
                        file,
                        status: 'waiting', // waiting 等待， uploading 上传中， success 成功， error 失败
                        message: '等待上传' // 等待上传，上传中，上传成功， 上传失败
                    };
                    newFileList.push(obj);
                }
            });
            let newFiles = this.files.concat(newFileList);
            this.files = newFiles;
            this.uploadHandler();
            this.$refs.liveChannelImportUploader.value = null;
        },
        uploadRequest(data) {
            let that = this;
            return new Promise((resolve, reject) => {
                let url = `/admin/v1/live/channel-programme/list`;
                let xhr = new XMLHttpRequest();
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
                    // let percent = evt.loaded / evt.total * 100;
                };
                xhr.send(data);
            });
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
                formData.append('files', file);
                that.uploadRequest(formData)
                    .then((res) => {
                        let result = JSON.parse(res);
                        if (result && result.code === 0) {
                            that.files = that.files.map((obj, index) => {
                                if (index === that.count) {
                                    obj.message = '导入成功';
                                    obj.status = 'success';
                                    return obj;
                                } else {
                                    return obj;
                                }
                            });
                        } else {
                            let message = result.message ? result.message : `文件导入失败`;
                            that.files = that.files.map((obj, index) => {
                                if (index === that.count) {
                                    obj.message = `<span class="text-danger">${message}</span>`;
                                    obj.status = 'error';
                                    return obj;
                                } else {
                                    return obj;
                                }
                            });
                        }
                        that.count = that.count + 1;
                        upload();
                    }).catch(() => {
                        that.files = that.files.map((obj, index) => {
                            if (index === that.count) {
                                obj.message = `<span class="text-danger">文件导入失败</span>`;
                                obj.status = 'error';
                                return obj;
                            } else {
                                return obj;
                            }
                        });
                        that.count = that.count + 1;
                        upload();
                    });
            }
        },
        gotoList() {
            this.$router.push({name: 'LiveChannelList'});
        }
    }
};
</script>
<style lang="scss" scoped>
</style>

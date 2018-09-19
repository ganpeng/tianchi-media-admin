<!--视频列表组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'频道管理'},
            {name:'直播频道列表'}]">
        </custom-breadcrumb>
        <el-form id="label-font" :inline="true" class="demo-form-inline search-form text-left" @submit.native.prevent>
            <el-col :span="24" class="float-right">
                <el-form-item class="create-account">
                    <el-button
                        class="page-main-btn create-blue-btn contain-svg-icon"
                        @click="createLiveChannel">
                        <svg-icon icon-class="add"></svg-icon>
                        新增直播频道
                    </el-button>
                    <el-button
                        class="create-blue-btn contain-svg-icon"
                        @click="createChannelByImportExcel">
                        <svg-icon icon-class="upload"></svg-icon>
                        批量导入频道
                    </el-button>
                    <el-button
                        class="create-blue-btn contain-svg-icon"
                        @click="editChannelByImportExcel">
                        <svg-icon icon-class="edit"></svg-icon>
                        批量修改频道
                    </el-button>
                    <el-button
                        class="page-main-btn create-blue-btn contain-svg-icon"
                        @click="showFileUploadDialog">
                        <svg-icon icon-class="upload"></svg-icon>
                        导入节目单
                    </el-button>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item class="search">
                    <el-input
                        :value="searchFields.keyword"
                        placeholder="支持频道名称，编号搜索"
                        @input="inputHandler($event, 'keyword')"
                        clearable
                    >
                        <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                </el-form-item>
                <el-form-item class="search">
                    <el-select
                        :value="searchFields.typeIdList"
                        multiple
                        placeholder="请选择频道类型"
                        @input="inputHandler($event, 'typeIdList')"
                    >
                        <el-option
                            v-for="(item, index) in liveChannelTypeList"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="search">
                    <el-select
                        :value="searchFields.record"
                        clearable
                        placeholder="请选择是否录制回看"
                        @input="inputHandler($event, 'record')"
                    >
                        <el-option
                            v-for="(item, index) in recordOptinos"
                            :key="index"
                            :label="item.name"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button class="page-main-btn" type="primary" icon="el-icon-search" @click="searchHandler" plain>搜索</el-button>
                    <el-button class="clear-filter page-main-btn clear-btn" type="primary" @click="clearSearchFields" plain>
                        <svg-icon
                            icon-class="clear_filter"
                            class-name="svg-box">
                        </svg-icon>
                        清空筛选条件
                    </el-button>
                </el-form-item>
            </el-col>
        </el-form>
        <el-table header-row-class-name="common-table-header" class="my-table-style" :data="list" border>
            <el-table-column prop="code" align="center" width="120px" label="直播频道编号"></el-table-column>
            <el-table-column prop="no" align="center" width="140px" label="直播频道展示编号"></el-table-column>
            <el-table-column prop="innerName" align="center" width="120px" label="直播频道名称">
                <template slot-scope="scope">
                    <span class="ellipsis two">
                        {{scope.row.innerName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" width="120px" label="直播频道展示名">
                <template slot-scope="scope">
                    <span class="ellipsis two">
                        {{scope.row.name}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="type" width="120px" align="center" label="频道类别">
                <template slot-scope="scope">
                    <span class="ellipsis two">
                        {{typeName(scope.row.id)}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="multicastIp" width="150px" align="center" label="频道IP"></el-table-column>
            <el-table-column prop="multicastPort" width="100px" align="center" label="频道端口"></el-table-column>
            <el-table-column prop="pushServer" align="center" label="所属服务器"></el-table-column>
            <el-table-column align="center" label="是否录制回看">
                <template slot-scope="scope">
                        {{scope.row.record ? '是' : '否'}}
                </template>
            </el-table-column>
            <el-table-column align="center" width="300px" fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="previewChannelPage(scope.row.id, scope.row.name, true)">节目单下载</el-button>
                    <el-button type="text" size="small" @click="previewChannelPage(scope.row.id)">节目单预览</el-button>
                    <el-button type="text" size="small" @click="_updateLiveChannel(scope.row.id)">编辑</el-button>
                    <el-button class="text-danger" type="text" size="small" @click="_deleteLiveChannel(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="handlePaginationChange($event, 'pageSize')"
            @current-change="handlePaginationChange($event, 'pageNum')"
            :current-page="pagination.pageNum"
            :page-sizes="[10, 20, 50,100, 200, 500]"
            :page-size="pagination.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pagination.total">
        </el-pagination>
        <live-channel-dialog
            :status="status"
            ref="liveChannelDialog"
            :liveChannelDialogVisible="liveChannelDialogVisible"
            v-on:changeLiveChannelDialogStatus="closeLiveChannelDialog">
        </live-channel-dialog>
        <el-dialog
            title="上传节目单表格"
            :visible.sync="fileUploadDialogVisible"
            :show-close="true"
            :before-close="closeFileUploadDialog"
            :close-on-click-modal="false"
            @open="dialogOpenHandler"
            :close-on-press-escape="false">
            <div class="file">
                <input id="upload-file" type="file" multiple ref="uploadXml">选择文件
            </div>
            <div class="table-wrapper">
                <el-table
                    :data="files"
                    :show-header="false"
                    :empty-text="'暂无上传内容'"
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
                        align="left"
                        label="文件名">
                        <template slot-scope="scope">
                            <span>{{scope.row.file.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="200"
                        align="left"
                        label="上传状态">
                        <template slot-scope="scope">
                            <span v-html="scope.row.message"></span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium" @click="closeFileUploadDialog">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';
    import LiveChannelDialog from './LiveChannelDialog';
    const X2JS = require('../../assets/js/xml2json.min'); // eslint-disable-line
    const x2js = new X2JS();
    export default {
        name: 'LiveChannelList',
        components: {
            LiveChannelDialog
        },
        data() {
            return {
                //  节目单上传变量
                isUploading: false,
                files: [],
                count: 0,
                //  节目单上传变量结束
                liveChannelDialogVisible: false,
                fileUploadDialogVisible: false,
                fileList: [],
                uploadHeaders: this.$util.getUploadHeaders(this.$store.state.user.token),
                recordOptinos: [
                    {
                        name: '是',
                        value: true
                    },
                    {
                        name: '否',
                        value: false
                    }
                ],
                status: 0
            };
        },
        created() {
            this.getChannelType();
            this.getChannelList();
            window.addEventListener('keyup', this.keyupHandler);
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.keyupHandler);
        },
        computed: {
            ...mapGetters({
                list: 'channel/list',
                pagination: 'channel/pagination',
                typeName: 'channel/typeName',
                liveChannelTypeList: 'channel/liveChannelTypeList',
                searchFields: 'channel/searchFields'
            })
        },
        methods: {
            ...mapMutations({
                setLiveChannel: 'channel/setLiveChannel',
                updatePagination: 'channel/updatePagination',
                updateSearchFields: 'channel/updateSearchFields',
                resetSearchFields: 'channel/resetSearchFields'
            }),
            ...mapActions({
                getChannelType: 'channel/getChannelType',
                getChannelList: 'channel/getChannelList',
                deleteChannelById: 'channel/deleteChannelById',
                getLiveChannelById: 'channel/getLiveChannelById',
                getChannelPageById: 'channel/getChannelPageById'
            }),
            clearSearchFields() {
                this.resetSearchFields();
            },
            keyupHandler(e) {
                if (e.keyCode === 13) {
                    this.searchHandler();
                }
            },
            showLiveChannelDialog() {
                this.liveChannelDialogVisible = true;
            },
            closeLiveChannelDialog() {
                this.liveChannelDialogVisible = false;
            },
            handlePaginationChange(value, key) {
                this.updatePagination({value, key});
                if (key === 'pageSize') {
                    window.localStorage.setItem('channelPageSize', value);
                }
                this.getChannelList();
            },
            _updateLiveChannel(id) {
                this.getLiveChannelById(id)
                    .then((res) => {
                        this.liveChannelDialogVisible = true;
                        this.status = 1;
                    });
            },
            editChannelByImportExcel() {
                this.$router.push({
                    name: 'EditLiveChannelByImportExcel'
                });
            },
            previewChannelPage(id, name, flag) {
                this.getChannelPageById(id)
                    .then((res) => {
                        if (res && res.code === 0) {
                            let data = res.data.map((item) => {
                                item.startTime = this.timeStampFormat(item.startTime);
                                item.endTime = this.timeStampFormat(item.endTime);
                                return item;
                            });
                            let xml = x2js.json2xml_str({'频道': {'节目': data}});
                            let blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>', xml], {type: 'application/xml'});
                            if (flag) {
                                this.openDownloadDialog(blob, `${name}.xml`);
                            } else {
                                if (res.data.length > 0) {
                                    this.$router.push({ name: 'PreviewProgrammeList', params: { id } });
                                } else {
                                    this.$message.error('当前频道下没有节目单');
                                    return false;
                                }
                            }
                        }
                    });
            },
            openNewTab(url) {
                if (typeof url === 'object' && url instanceof Blob) {
                    url = URL.createObjectURL(url); // 创建blob地址
                }
                let aLink = document.createElement('a');
                aLink.href = url;
                aLink.target = '_blank';
                let event;
                if (window.MouseEvent) {
                    event = new MouseEvent('click');
                } else {
                    event = document.createEvent('MouseEvents');
                    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                }
                aLink.dispatchEvent(event);
            },
            openDownloadDialog(url, saveName) {
                if (typeof url === 'object' && url instanceof Blob) {
                    url = URL.createObjectURL(url); // 创建blob地址
                }
                let aLink = document.createElement('a');
                aLink.href = url;
                aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
                let event;
                if (window.MouseEvent) {
                    event = new MouseEvent('click');
                } else {
                    event = document.createEvent('MouseEvents');
                    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                }
                aLink.dispatchEvent(event);
            },
            inputHandler(value, key) {
                this.updateSearchFields({key, value});
            },
            _deleteLiveChannel(id) {
                this.$confirm('此操作将删除该频道, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error'
                }).then(() => {
                    this.deleteChannelById(id)
                        .then(() => {
                            this.$message({
                                type: 'success',
                                message: '删除成功'
                            });
                            this.getChannelList();
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            createLiveChannel() {
                this.liveChannelDialogVisible = true;
                this.status = 0;
            },
            // 批量创建直播频道
            createChannelByImportExcel() {
                this.$router.push({
                    name: 'CreateChannelByImportExcel',
                    params: {category: 'LIVE'}
                });
            },
            searchHandler() {
                this.getChannelList();
            },
            //  上传节目单
            dialogOpenHandler() {
                this.$nextTick(() => {
                    let uploadInputFile = document.querySelector('#upload-file');
                    console.log(uploadInputFile);
                    uploadInputFile.addEventListener('input', this.uploadChangeHandler);
                });
            },
            showFileUploadDialog() {
                this.fileUploadDialogVisible = true;
                this.fileList = [];
            },
            closeFileUploadDialog() {
                if (this.isUploading) {
                    this.$confirm('此操作将删除该频道, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'error'
                    }).then(() => {
                        this.fileUploadDialogVisible = false;
                        this.isUploading = false;
                        this.files = [];
                        this.count = 0;
                        this.$refs.uploadXml.value = null;
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                } else {
                    this.fileUploadDialogVisible = false;
                    this.isUploading = false;
                    this.files = [];
                    this.count = 0;
                    this.$refs.uploadXml.value = null;
                }
            },
            submitUpload() {
                this.$refs.upload.submit();
            },
            timeStampFormat(seconds) {
                let date = new Date(seconds);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let minute = date.getMinutes();
                let second = date.getSeconds();
                return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            },
            uploadSuccessHandler(res, file, fileList) {
                if (res && res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '节目单导入成功'
                    });
                } else if (res && res.code === 3605) {
                    let fileNameList = res.data.join(', ');
                    let message = `${fileNameList}, 以上文件导入失败`;
                    this.$message({
                        type: 'error',
                        message
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '节目单导入失败'
                    });
                }
                this.closeFileUploadDialog();
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
                        let percent = evt.loaded / evt.total * 100;
                        console.log(percent);
                    };
                    xhr.send(data);
                });
            },
            uploadChangeHandler(e) {
                let files = Array.from(e.target.files).filter((file) => {
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
                this.$refs.uploadXml.value = null;
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
            }
        }
    };
</script>
<style scoped lang="less">
.table-wrapper {
    height: 500px;
    overflow-y: scroll;
}
.file {
    position: relative;
    display: inline-block;
    background: #409EFF;
    border: 1px solid #409EFF;
    border-radius: 3px;
    font-size: 12px;
    padding: 3px 15px;
    overflow: hidden;
    color: #fff;
    text-decoration: none;
    text-indent: 0;
}
.file input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    width: 80px;
    height: 34px;
    opacity: 0;
    cursor: pointer;
}
</style>

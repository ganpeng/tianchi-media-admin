<!--视频列表组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'直播频道管理'},
            {name:'直播频道列表'}]">
        </custom-breadcrumb>
        <el-form id="label-font" :inline="true" class="demo-form-inline search-form text-left" @submit.native.prevent>
            <el-col :span="24" class="float-right">
                <el-form-item class="create-account">
                    <el-button class="page-main-btn create-blue-btn" icon="el-icon-circle-plus-outline" @click="createLiveChannel">新增直播频道</el-button>
                    <el-button class="page-main-btn create-blue-btn"  icon="el-icon-upload2" @click="showFileUploadDialog">导入节目单</el-button>
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
            :page-sizes="[5, 10, 20, 30, 50]"
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
            title="上传节目表格"
            :visible.sync="fileUploadDialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false">
            <el-upload
                class="upload-demo"
                ref="upload"
                name="files"
                :headers="uploadHeaders"
                action="/admin/v1/live/channel-programme/list"
                accept=".xml"
                :on-success="uploadSuccessHandler"
                :auto-upload="false"
                :file-list="fileList"
                :with-credentials="true"
                multiple>
                    <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" @click="submitUpload" type="success">点击上传</el-button>
            </el-upload>

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
                liveChannelDialogVisible: false,
                fileUploadDialogVisible: false,
                fileList: [],
                uploadHeaders: this.$util.getUploadHeaders(this.$store.state.user.token),
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
                                this.openNewTab(blob);
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
            searchHandler() {
                this.getChannelList();
            },
            //  上传节目单
            showFileUploadDialog() {
                this.fileUploadDialogVisible = true;
                this.fileList = [];
            },
            closeFileUploadDialog() {
                this.fileUploadDialogVisible = false;
                this.fileList = [];
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
                        message: '节目导入成功'
                    });
                } else if (res && res.code === 3119) {
                    this.$message({
                        type: 'error',
                        message: '节目视频导入失败'
                    });
                } else if (res && res.code === 3117) {
                    this.$message({
                        type: 'error',
                        message: '节目导入部分成功'
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: '节目导入失败'
                    });
                }
                this.closeFileUploadDialog();
            }
        }
    };
</script>
<style scoped lang="less">
</style>

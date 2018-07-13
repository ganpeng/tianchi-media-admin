<!--视频列表组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>直播频道管理</el-breadcrumb-item>
            <el-breadcrumb-item>直播频道列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :inline="true" class="demo-form-inline search-form">
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
                <el-button type="primary" @click="searchHandler">搜索</el-button>
            </el-form-item>
            <el-form-item class="create-account">
                <el-button type="primary" plain @click="createLiveChannel">新增直播频道</el-button>
                <el-button type="primary" plain @click="showFileUploadDialog">导入节目单</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="list" border style="width:100%;margin:20px 0;">
            <el-table-column prop="code" align="center" width="240px" label="直播频道编号"></el-table-column>
            <el-table-column prop="no" align="center" width="240px" label="直播频道展示编号"></el-table-column>
            <el-table-column prop="name" align="center" width="200px" label="直播频道名称"></el-table-column>
            <el-table-column prop="innerName" align="center" width="200px" label="直播频道展示名"></el-table-column>
            <el-table-column prop="type" align="center" label="频道类别">
                <template slot-scope="scope">
                    {{typeName(scope.row.id)}}
                </template>
            </el-table-column>
            <el-table-column prop="multicastIp" align="center" label="频道IP"></el-table-column>
            <el-table-column prop="multicastPort" align="center" label="频道端口"></el-table-column>
            <el-table-column align="center" width="220px" fixed="right" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small">节目单下载</el-button>
                    <el-button type="text" size="small" @click="_updateLiveChannel(scope.row.id)">编辑</el-button>
                    <el-button type="text" size="small" @click="_deleteLiveChannel(scope.row.id)">删除</el-button>
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
                :headers="uploadHeaders"
                action="/admin/v1/live/channel-programme/list"
                :auto-upload="false"
                :file-list="fileList"
                :on-success="uploadSuccessHandler"
                :with-credentials="true">
                    <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" @click="submitUpload" type="success">点击上传</el-button>
            </el-upload>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeFileUploadDialog">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {mapGetters, mapActions, mapMutations} from 'vuex';
    import LiveChannelDialog from './LiveChannelDialog';
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
                updateSearchFields: 'channel/updateSearchFields'
            }),
            ...mapActions({
                getChannelType: 'channel/getChannelType',
                getChannelList: 'channel/getChannelList',
                deleteChannelById: 'channel/deleteChannelById'
            }),
            showLiveChannelDialog() {
                this.liveChannelDialogVisible = true;
            },
            closeLiveChannelDialog() {
                this.liveChannelDialogVisible = false;
            },
            handlePaginationChange(value, key) {
                this.updatePagination({value, key});
                this.getChannelList();
            },
            _updateLiveChannel(id) {
                let liveChannel = this.list.find((liveChannel) => liveChannel.id === id);
                this.liveChannelDialogVisible = true;
                this.status = 1;
                this.setLiveChannel({liveChannel});
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

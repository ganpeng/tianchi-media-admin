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
                    placeholder="支持频道名称，编号搜索"
                    clearable
                >
                    <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">搜索</el-button>
            </el-form-item>
            <el-form-item class="create-account">
                <el-button type="primary" plain @click="createLiveChannel">新增直播频道</el-button>
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
                typeName: 'channel/typeName'
            })
        },
        methods: {
            ...mapMutations({
                setLiveChannel: 'channel/setLiveChannel',
                updatePagination: 'channel/updatePagination'
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
            }
        }
    };
</script>
<style scoped lang="less">
</style>

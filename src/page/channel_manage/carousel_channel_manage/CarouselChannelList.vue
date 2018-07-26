<!--内容管理-频道管理-轮播频道管理-轮播频道列表组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>频道管理</el-breadcrumb-item>
            <el-breadcrumb-item>轮播频道管理</el-breadcrumb-item>
            <el-breadcrumb-item>轮播频道列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block-box">
            <el-form :inline="true" class="demo-form-inline search-form">
                <el-form-item label="频道类别">
                    <el-select v-model="listQueryParams.typeIdList" clearable multiple placeholder="请选择频道类别">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="频道状态">
                    <el-select v-model="listQueryParams.visible" clearable placeholder="请选择频道状态">
                        <el-option
                            v-for="item in visibleOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关键字">
                    <el-input v-model="listQueryParams.keyword" placeholder="请填写频道名称或编号">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="getChannelList">查 询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="createChannelDialogVisible = true">新增轮播频道</el-button>
                </el-form-item>
            </el-form>
            <el-table
                :data="channelList"
                border
                style="width: 100%">
                <el-table-column
                    width="60px"
                    label="序号">
                    <template slot-scope="scope">
                        <label>{{scope.$index + 1}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="no"
                    label="编号">
                </el-table-column>
                <el-table-column
                    prop="innerName"
                    label="名称">
                </el-table-column>
                <el-table-column
                    label="类别">
                    <template slot-scope="scope">
                        <label>{{scope.row.typeList | jsonJoin('name')}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="multicastIp"
                    label="组播地址">
                </el-table-column>
                <el-table-column
                    prop="multicastPort"
                    label="端口号">
                </el-table-column>
                <el-table-column
                    label="状态">
                    <template slot-scope="scope">
                        <label>{{scope.row.visible ? '正常' : '禁播'}}</label>
                    </template>
                </el-table-column>
                <el-table-column align="center"
                                 label="操作"
                                 class="operate">
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" @click="disableChannel(scope.row)">
                            {{scope.row.visible ? '禁播' : '恢复'}}
                        </el-button>
                        <el-button type="text" size="small" @click="checkChannelDetail(scope.row)">查看</el-button>
                        <el-button type="text" size="small" @click="editChannelInfo(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="listQueryParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog
            title="新增轮播频道"
            :visible.sync="createChannelDialogVisible"
            width="50%">
            <create-channel
                v-if="createChannelDialogVisible"
                v-on:closeDialog="closeDialog">
            </create-channel>
        </el-dialog>
    </div>
</template>

<script>
    import CreateChannel from './CreateChannel';

    export default {
        name: 'CarouselChannelList',
        components: {CreateChannel},
        data() {
            return {
                createChannelDialogVisible: false,
                listQueryParams: {
                    category: 'CAROUSEL',
                    typeIdList: '',
                    visible: '',
                    keyword: '',
                    pageNum: 0,
                    pageSize: 10
                },
                pageNum: 1,
                typeOptions: [],
                visibleOptions: [{
                    value: true,
                    label: '正常'
                }, {
                    value: false,
                    label: '禁播'
                }],
                total: 0,
                channelList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                // 初始化频道类别列表
                this.$service.getChannelType({category: 'CAROUSEL'}).then(response => {
                    if (response && response.code === 0) {
                        this.typeOptions = response.data;
                    }
                });
                this.getChannelList();
            },
            getChannelList() {
                this.listQueryParams.pageNum = this.pageNum - 1;
                this.$service.getChannelList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.channelList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getChannelList();
            },
            handleCurrentChange(pageNum) {
                this.pageNum = pageNum;
                this.getChannelList();
            },
            // 查看详情
            checkChannelDetail(item) {
                this.$router.push({
                    name: 'CarouselChannelDetail',
                    params: {id: item.id}
                });
            },
            // 编辑信息
            editChannelInfo(item) {
                this.$router.push({
                    name: 'EditCarouselChannel',
                    params: {id: item.id}
                });
            },
            // 关闭创建频道对话框
            closeDialog() {
                this.createChannelDialogVisible = false;
                this.getChannelList();
            },
            // 禁播/恢复频道
            disableChannel(channelInfo) {
                let operateWords = channelInfo.visible ? '禁播' : '恢复';
                this.$confirm('此操作将' + operateWords + '该频道, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.setChannelVisible(channelInfo.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message({
                                type: 'success',
                                message: operateWords + '成功!'
                            });
                            channelInfo.visible = !channelInfo.visible;
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + operateWords
                    });
                });
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>

    .block-box {
        margin-top: 50px;
    }

    .el-form {
        margin-left: 20px;
        text-align: left;
        &.search-form {
            margin-top: 60px;
        }
    }

</style>

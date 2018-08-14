<!--内容管理-频道管理-轮播频道管理-轮播频道列表组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'内容管理'},
            {name:'频道管理'},
            {name:'轮播频道管理'},
            {name:'轮播频道列表'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <channel-filter-params
                v-on:getChannelList="getChannelList">
            </channel-filter-params>
            <el-table
                :data="channelList"
                border
                style="width: 100%">
                <el-table-column
                    width="60px"
                    align="center"
                    label="序号">
                    <template slot-scope="scope">
                        <label>{{scope.$index + 1}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="no"
                    width="80px"
                    align="center"
                    label="编号">
                </el-table-column>
                <el-table-column
                    prop="innerName"
                    width="200px"
                    align="center"
                    label="名称">
                </el-table-column>
                <el-table-column
                    align="center"
                    width="120px"
                    label="类别">
                    <template slot-scope="scope">
                        <label>{{scope.row.typeList | jsonJoin('name')}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="multicastIp"
                    label="组播地址">
                </el-table-column>
                <el-table-column
                    align="center"
                    width="80px"
                    prop="multicastPort"
                    label="端口号">
                </el-table-column>
                <!--tsId-->
                <el-table-column
                    align="center"
                    prop="tsId"
                    label="tsId">
                    <template slot-scope="scope">
                        <label>{{scope.row.tsId ? scope.row.tsId : '------'}}</label>
                    </template>
                </el-table-column>
                <!--serviceId-->
                <el-table-column
                    align="center"
                    prop="serviceId"
                    label="serviceId">
                    <template slot-scope="scope">
                        <label>{{scope.row.serviceId ? scope.row.serviceId : '------'}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="pushServer"
                    label="所属服务器">
                    <template slot-scope="scope">
                        <label>{{scope.row.pushServer ? scope.row.pushServer : '------'}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    width="80px"
                    label="状态">
                    <template slot-scope="scope">
                        <i class="status-normal" v-if="scope.row.visible">正常</i>
                        <i class="status-abnormal" v-else>禁播</i>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    align="center"
                    width="100px"
                    label="操作"
                    class="operate">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.visible"
                                   type="danger"
                                   size="mini"
                                   plain
                                   @click="disableChannel(scope.row)">
                            禁播
                        </el-button>
                        <el-button
                            v-else
                            type="primary"
                            plain
                            size="mini"
                            @click="disableChannel(scope.row)">
                            恢复
                        </el-button>
                        <el-button type="text" size="small" @click="checkChannelDetail(scope.row)" class="detail-btn">
                            查看
                        </el-button>
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
            <div class="create-item">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="createChannelDialogVisible = true">
                    新增单个轮播频道
                </el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="createChannelByImportExcel">
                    批量导入轮播频道
                </el-button>
            </div>
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
    import ChannelFilterParams from '../../content_manage/searchFilterParams/ChannelFilterParams';

    export default {
        name: 'CarouselChannelList',
        components: {
            CreateChannel,
            ChannelFilterParams
        },
        data() {
            return {
                createChannelDialogVisible: false,
                listQueryParams: {
                    pageNum: 0,
                    pageSize: 10
                },
                pageNum: 1,
                total: 0,
                channelList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.getChannelList();
            },
            getChannelList(searchParams) {
                // 设置请求参数
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
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
            createChannelByImportExcel() {
                this.$router.push({
                    name: 'CreateChannelByImportExcel'
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
<style lang="scss" scoped>

    .block-box {
        position: relative;
        padding-top: 80px;
    }

    .create-item {
        position: absolute;
        right: 0px;
        top: 10px;
    }

    .el-pagination {
        margin-bottom: 126px;
    }

</style>

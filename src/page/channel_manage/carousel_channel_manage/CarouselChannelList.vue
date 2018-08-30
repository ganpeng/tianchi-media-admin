<!--内容管理-频道管理-轮播频道管理-轮播频道列表组件-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'频道管理'},
            {name:'轮播频道列表'}]">
        </custom-breadcrumb>
        <div class="block-box">
            <channel-filter-params
                ref="channelFilterParams"
                v-on:getChannelList="getChannelList">
            </channel-filter-params>
            <el-table
                :data="channelList"
                header-row-class-name="common-table-header"
                row-class-name=channel-row
                @row-dblclick="showChannelVideoMessage"
                @selection-change="handleSelectionChange"
                border
                style="width: 100%">
                <el-table-column
                    type="selection"
                    align="center"
                    width="55">
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
                        <el-button
                            type="text"
                            size="small"
                            @click="checkChannelDetail(scope.row)"
                            class="detail-btn">
                            查看
                        </el-button>
                        <el-button
                            type="text"
                            size="small"
                            @click="editChannelInfo(scope.row)">
                            编辑
                        </el-button>
                        <el-button
                            v-if="scope.row.visible"
                            type="text"
                            size="small"
                            @click="disableChannel(scope.row)">
                            禁播
                        </el-button>
                        <el-button
                            v-else
                            type="text"
                            size="small"
                            @click="disableChannel(scope.row)">
                            恢复
                        </el-button>
                        <el-button
                            class="remove-btn"
                            type="text"
                            size="small"
                            @click="removeChannel(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[10, 20, 50, 100, 200, 500]"
                :page-size="listQueryParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
            <div class="visible-item">
                <el-button
                    class="create-blue-btn"
                    size="small"
                    @click="batchSetChannel(true)">
                    批量恢复
                </el-button>
                <el-button
                    class="disabled-red-btn"
                    size="small"
                    @click="batchSetChannel(false)">
                    批量禁播
                </el-button>
            </div>
            <div class="create-item">
                <el-button
                    class="create-blue-btn contain-svg-icon"
                    @click="createChannelDialogVisible = true">
                    <svg-icon icon-class="add"></svg-icon>
                    新增频道
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
    import ChannelFilterParams from '../../search_filter_params/ChannelFilterParams';
    import wsCache from '@/util/webStorage';

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
                channelList: [],
                multipleSelection: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            showChannelVideoMessage(row) {
                this.$service.getChannelDetail(row.id).then(response => {
                    if (response && response.code === 0) {
                        this.channelInfo = response.data;
                        this.$message({
                            message: row.innerName + '频道含有视频' + this.channelInfo.carouselVideoList.length + '个',
                            type: 'success'
                        });
                    }
                });
            },
            init() {
                if (wsCache.localStorage.get('carouselChannelListParams')) {
                    this.listQueryParams = wsCache.localStorage.get('carouselChannelListParams');
                    this.$refs.channelFilterParams.initFilterParams(this.listQueryParams);
                }
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
                // 保存当前参数到localStorage中，下次页面重建的时候，自动填写并查询
                wsCache.localStorage.set('carouselChannelListParams', this.listQueryParams);
                this.$service.getChannelList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.channelList = response.data.list;
                        this.total = response.data.total;
                        this.multipleSelection = [];
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
            editChannelByImportExcel() {
                this.$router.push({
                    name: 'EditChannelByImportExcel'
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
                this.$confirm('此操作将' + operateWords + channelInfo.innerName + '频道, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.setChannelVisible(channelInfo.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message({
                                type: 'success',
                                message: operateWords + channelInfo.innerName + '频道成功!'
                            });
                            channelInfo.visible = !channelInfo.visible;
                            //    频道在栏目推荐位上
                        } else if (response && response.code === 3610) {
                            let message = '';
                            response.data.map(item => {
                                message = message + '、' + item.navBarName;
                            });
                            message = channelInfo.innerName + '频道在"' + message.slice(1) + '"栏目推荐位上，不能被禁播';
                            this.$message(message);
                            // 频道在栏目频道布局推荐位上
                        } else if (response && response.code === 3611) {
                            let message = '';
                            response.data.map(item => {
                                message = message + '、' + item.navBarName;
                            });
                            message = channelInfo.innerName + '频道在"' + message.slice(1) + '"栏目频道布局推荐位上，不能被禁播';
                            this.$message(message);
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消' + operateWords + channelInfo.innerName + '频道'
                    });
                });
            },
            // 删除频道
            removeChannel(channelInfo) {
                if (channelInfo.visible) {
                    this.$message.warning('由于' + channelInfo.innerName + '频道为正常状态，暂时不能删除');
                    return;
                }
                this.$confirm('此操作将删除' + channelInfo.innerName + '频道, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.deleteChannelById(channelInfo.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '成功删除' + channelInfo.innerName + '频道!'
                            });
                            this.getChannelList();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 批量禁播、恢复频道
            batchSetChannel(visible) {
                if (this.multipleSelection.length === 0) {
                    this.$message.warning('请选择需要' + (visible ? '恢复' : '禁播') + '的频道');
                    return;
                }
                let idList = [];
                this.multipleSelection.map(channel => {
                    idList.push(channel.id);
                });
                this.$service.batchSetChannel({
                    idList: idList,
                    visible: visible
                }).then(response => {
                    if (response && response.code === 0) {
                        this.$message.success('批量' + (visible ? '恢复' : '禁播') + '成功');
                        // 刷新页面数据
                        this.getChannelList();
                        // 下架失败，设置提醒信息
                    } else if (response && response.code === 3604) {
                        let message = '';
                        response.data.map(channel => {
                            message = message + '"' + channel.innerName + '"' + channel.reason + ';    ';
                        });
                        this.$message.warning(message + '，暂时不能批量禁播');
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    .block-box {
        position: relative;
        padding-top: 80px;
    }

    .visible-item {
        position: absolute;
        right: 0px;
        top: 85px;
    }

    .create-item {
        position: absolute;
        right: 0px;
        top: 10px;
    }

    .el-table {
        margin-top: 0px;
        .el-button {
            margin: 0px 5px;
        }
    }

    .el-pagination {
        margin-bottom: 126px;
    }

</style>

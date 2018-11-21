<!--内容管理-频道管理-轮播频道管理-轮播频道列表组件-->
<template>
    <div>
        <div class="content-title">搜索筛选</div>
        <div class="block-box">
            <channel-filter-params
                ref="channelFilterParams"
                v-on:getChannelList="getChannelList">
            </channel-filter-params>
            <div class="content-title">频道列表</div>
            <div class="table-operator-field clearfix">
                <div class="float-left">
                    <el-dropdown
                        trigger="hover"
                        class="my-dropdown">
                            <span class="el-dropdown-link">
                                批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <span @click="batchSetStatus(true)">批量恢复</span>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <span @click="batchSetStatus(false)">批量禁播</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="float-right">
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
            <carousel-channel-operate-table
                ref="channelOperateTable"
                :channelList="channelList"
                v-on:getChannelList="getChannelList">
            </carousel-channel-operate-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[10, 20, 50, 100, 200, 500]"
                :page-size="listQueryParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <el-dialog
            title="新增轮播频道"
            :close-on-click-modal=false
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
    import CarouselChannelOperateTable from './CarouselChannelOperateTable';
    import wsCache from '@/util/webStorage';

    export default {
        name: 'CarouselChannelList',
        components: {
            CreateChannel,
            ChannelFilterParams,
            CarouselChannelOperateTable
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
                this.listQueryParams.category = 'CAROUSEL';
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
            createChannelByImportExcel() {
                this.$router.push({
                    name: 'CreateChannelByImportExcel',
                    params: {category: 'CAROUSEL'}
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
            // 批量恢复或者禁播
            batchSetStatus(visible) {
                this.$refs.channelOperateTable.batchUpdateStatus(visible);
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-pagination {
        margin-bottom: 126px;
    }

</style>

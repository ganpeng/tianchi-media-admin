<!--内容管理-直播推流列表组件-->
<template>
    <div>
        <div class="content-title">搜索筛选</div>
        <div class="block-box">
            <channel-push-filter-params
                ref="channelPushFilterParams"
                v-on:getChannelPushList="getChannelPushList">
            </channel-push-filter-params>
            <div class="content-title">直播推流列表</div>
            <div class="table-operator-field clearfix">
                <div class="float-left">
                    <el-dropdown
                        trigger="hover"
                        class="my-dropdown"
                        :class="{'is-disabled':isDisabled}">
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
                        class="btn-style-two contain-svg-icon"
                        @click="createChannelPush">
                        <svg-icon icon-class="add"></svg-icon>
                        添加
                    </el-button>
                </div>
            </div>
            <channel-push-operate-table
                ref="channelOperateTable"
                :channelPushList="channelPushList"
                v-on:getChannelPushList="getChannelPushList"
                v-on:setBatchDisabledStatus="setBatchDisabledStatus">
            </channel-push-operate-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageNum"
                :page-sizes="[5, 10, 20, 50, 100, 200, 500]"
                :page-size="listQueryParams.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
            <div class="text-left table-dropdow-box">
                <el-dropdown
                    trigger="hover"
                    class="my-dropdown"
                    :class="{'is-disabled':isDisabled}">
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
        </div>
    </div>
</template>

<script>
    import CreateChannelPush from './CreateChannelPush';
    import ChannelPushFilterParams from '../../search_filter_params/ChannelPushFilterParams';
    import ChannelPushOperateTable from './ChannelPushOperateTable';
    import wsCache from '@/util/webStorage';

    export default {
        name: 'CarouselChannelList',
        components: {
            CreateChannelPush,
            ChannelPushFilterParams,
            ChannelPushOperateTable
        },
        data() {
            return {
                listQueryParams: {
                    pageNum: 0,
                    pageSize: 10
                },
                pageNum: 1,
                total: 0,
                channelPushList: [],
                isDisabled: true
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (wsCache.localStorage.get('ChannelPushListParams')) {
                    this.listQueryParams = wsCache.localStorage.get('ChannelPushListParams');
                    this.$refs.channelPushFilterParams.initFilterParams(this.listQueryParams);
                }
                this.getChannelPushList();
            },
            getChannelPushList(searchParams, isReset) {
                // 设置请求参数
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                if (isReset) {
                    this.pageNum = 1;
                }
                this.listQueryParams.pageNum = this.pageNum - 1;
                this.listQueryParams.category = 'LIVE';
                // 保存当前参数到localStorage中，下次页面重建的时候，自动填写并查询
                wsCache.localStorage.set('ChannelPushListParams', this.listQueryParams);
                this.$service.getChannelPushList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.channelPushList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            setBatchDisabledStatus(isDisabled) {
                this.isDisabled = isDisabled;
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getChannelPushList();
            },
            handleCurrentChange(pageNum) {
                this.pageNum = pageNum;
                this.getChannelPushList();
            },
            // 批量恢复或者禁播
            batchSetStatus(visible) {
                this.$refs.channelOperateTable.batchUpdateStatus(visible);
            },
            createChannelPush() {
                let routeData = this.$router.resolve({
                    name: 'CreateChannelPush'
                });
                window.open(routeData.href, '_blank');
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-pagination {
        margin-top: 10px;
    }

    .el-dropdown {
        &.is-disabled {
            opacity: 0.3;
            pointer-events: none;
        }
    }

</style>

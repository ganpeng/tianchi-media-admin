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
                            <el-dropdown-item>
                                <span @click="exportAllChannel">导出全部</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="float-right">
                    <el-button
                        class="btn-style-two contain-svg-icon"
                        @click="createCarouselChannel">
                        <svg-icon icon-class="add"></svg-icon>
                        添加
                    </el-button>
                    <el-button
                        class="btn-style-two contain-svg-icon"
                        @click="createChannelByImportExcel">
                        <svg-icon icon-class="import"></svg-icon>
                        导入
                    </el-button>
                    <el-button
                        class="btn-style-two contain-svg-icon"
                        @click="editChannelByImportExcel">
                        <svg-icon icon-class="export"></svg-icon>
                        修改
                    </el-button>
                </div>
            </div>
            <carousel-channel-operate-table
                ref="channelOperateTable"
                :channelList="channelList"
                :setChannelList="setChannelList"
                v-on:getChannelList="getChannelList"
                v-on:setBatchDisabledStatus="setBatchDisabledStatus">
            </carousel-channel-operate-table>
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
                        <el-dropdown-item>
                            <span @click="exportAllChannel">导出全部</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
    import CreateChannel from './CreateCarouselChannel';
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
                listQueryParams: {
                    pageNum: 0,
                    pageSize: 10
                },
                pageNum: 1,
                total: 0,
                channelList: [],
                isDisabled: true,
                sortKeyList: [
                    {
                        label: '展示名',
                        value: 'NAME'
                    }
                ]
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
            getChannelList(searchParams, isReset) {
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
                this.listQueryParams.category = 'CAROUSEL';
                // 保存当前参数到localStorage中，下次页面重建的时候，自动填写并查询
                wsCache.localStorage.set('carouselChannelListParams', this.listQueryParams);
                this.$service.getChannelList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.channelList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            setBatchDisabledStatus(isDisabled) {
                this.isDisabled = isDisabled;
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getChannelList();
            },
            handleCurrentChange(pageNum) {
                this.pageNum = pageNum;
                this.getChannelList();
            },
            // 导出全部轮播EXCEL列表
            exportAllChannel() {
                if (!this.$authority.isHasAuthority('content:channel:export')) {
                    return;
                }
                this.$service.exportAllChannelListExcel({channelCategory: 'CAROUSEL'}).then(response => {
                    let aLink = document.createElement('a');
                    let blob = new Blob([response], {type: 'application/vnd.ms-excel'});
                    aLink.href = URL.createObjectURL(blob);
                    aLink.setAttribute('download', '所有轮播频道表_' + new Date() + '.xlsx');
                    aLink.click();
                    this.$refs.loadElement.appendChild(aLink);
                });
            },
            createChannelByImportExcel() {
                if (!this.$authority.isHasAuthority('content:channel:carouselImport')) {
                    return;
                }
                let routeData = this.$router.resolve({
                    name: 'CarouselChannelImport'
                });
                window.open(routeData.href, '_blank');
            },
            editChannelByImportExcel() {
                let routeData = this.$router.resolve({
                    name: 'EditChannelByImportExcel'
                });
                window.open(routeData.href, '_blank');
            },
            // 批量恢复或者禁播
            batchSetStatus(visible) {
                this.$refs.channelOperateTable.batchUpdateStatus(visible);
            },
            createCarouselChannel() {
                if (!this.$authority.isHasAuthority('content:channel:add')) {
                    return;
                }
                let routeData = this.$router.resolve({
                    name: 'CreateCarouselChannel'
                });
                window.open(routeData.href, '_blank');
            },
            // dev2.9
            setChannelList(list) {
                this.channelList = list;
            },
            sortQueryChangeHandler(obj) {
                let {sortKey, sortDirection} = obj;
                this.listQueryParams.sortKey = sortKey;
                this.listQueryParams.sortDirection = sortDirection;
                this.getChannelList();
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

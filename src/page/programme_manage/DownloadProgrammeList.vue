<!--节目下载列表-->
<template>
    <div>
        <div class="content-title">搜索筛选</div>
        <download-Programme-filter-params
            ref="downloadProgrammeFilterParams"
            v-on:getDownloadProgrammeList="getDownloadProgrammeList">
        </download-Programme-filter-params>
        <div class="content-title">节目下载列表</div>
        <div class="table-operator-field">
            <div>
                <el-dropdown
                    trigger="hover"
                    class="my-dropdown"
                    :class="{'is-disabled':isDisabled}">
                            <span class="el-dropdown-link">
                                批量操作<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <span @click="batchRetry">重试选中</span>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <span @click="batchRemove">删除选中</span>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <span @click="batchRemoveAll">删除全部</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <download-Programme-operate-table
            ref="programmeOperateTable"
            :downloadProgrammeList="downloadProgrammeList"
            v-on:getDownloadProgrammeList="getDownloadProgrammeList"
            v-on:setBatchDisabledStatus="setBatchDisabledStatus">
        </download-Programme-operate-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listQueryParams.pageNum"
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
                        <span @click="batchRetry">重试选中</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <span @click="batchRemove">删除选中</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <span @click="batchRemoveAll">删除全部</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import DownloadProgrammeFilterParams from './components/DownloadProgrammeFilterParams';
    import DownloadProgrammeOperateTable from './components/DownloadProgrammeOperateTable';

    export default {
        name: 'DownloadProgrammeList',
        components: {
            DownloadProgrammeFilterParams,
            DownloadProgrammeOperateTable
        },
        data() {
            return {
                isDisabled: true,
                listQueryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                downloadProgrammeList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$wsCache.localStorage.get('downloadProgrammeFilter')) {
                    this.listQueryParams = this.$wsCache.localStorage.get('downloadProgrammeFilter');
                    this.$refs.downloadProgrammeFilterParams.initFilterParams(this.listQueryParams);
                }
                this.getDownloadProgrammeList();
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getDownloadProgrammeList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getDownloadProgrammeList();
            },
            setBatchDisabledStatus(isDisabled) {
                this.isDisabled = isDisabled;
            },
            // 重试选中
            batchRetry() {
                this.$refs.programmeOperateTable.batchRetry();
            },
            // 删除选中
            batchRemove() {
                this.$refs.programmeOperateTable.batchRemove();
            },
            // 删除全部
            batchRemoveAll() {
                this.$refs.programmeOperateTable.batchRemoveAll();
            },
            getDownloadProgrammeList(searchParams, isReset) {
                // 设置请求参数
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                if (isReset) {
                    this.listQueryParams.pageNum = 1;
                }
                this.$wsCache.localStorage.set('downloadProgrammeFilter', this.listQueryParams);
                this.$service.getDownloadProgrammeList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.downloadProgrammeList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-pagination {
        margin-top: 10px;
    }

</style>

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
                            <span @click="batchShelve">重试选中</span>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <span @click="batchUnShelve">删除选中</span>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <span @click="batchRemove">删除全部</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <el-button
                class="btn-style-two contain-svg-icon"
                @click="createDownloadProgramme">
                <svg-icon icon-class="export"></svg-icon>
                导出
            </el-button>
        </div>
        <download-Programme-operate-table
            ref="downloadProgrammeOperateTable"
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
                        <span @click="batchShelve">重试选中</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <span @click="batchUnShelve">删除选中</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <span @click="batchRemove">删除全部</span>
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
            // 批量上架
            batchShelve() {
                this.$refs.subjectOperateTable.batchUpdateStatus(true);
            },
            // 批量下架
            batchUnShelve() {
                this.$refs.subjectOperateTable.batchUpdateStatus(false);
            },
            // 批量删除
            batchRemove() {
                this.$refs.subjectOperateTable.batchRemove();
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
            },
            createDownloadProgramme() {
                if (!this.$authority.isHasAuthority('user:membershipScheme:add')) {
                    return;
                }
                this.$router.push({name: 'CreateDownloadProgramme'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-pagination {
        margin-top: 10px;
    }

</style>

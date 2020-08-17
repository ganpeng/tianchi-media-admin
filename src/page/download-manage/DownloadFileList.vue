<!-- 下载文件列表,只包含节目和视频全部下载的excel文件 -->
<template>
    <div>
        <div class="content-title">搜索筛选</div>
        <exportFile-filter-params
            ref="exportFileFilterParams"
            v-on:getExportFileList="getExportFileList">
        </exportFile-filter-params>
        <div class="content-title">导出列表</div>
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
                            <span @click="batchRemove">删除选中</span>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <span @click="removeAllFile">删除全部</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <exportFile-operate-table
            ref="exportFileOperateTable"
            :exportFileList="exportFileList"
            v-on:getExportFileList="getExportFileList"
            v-on:setBatchDisabledStatus="setBatchDisabledStatus">
        </exportFile-operate-table>
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
                        <span @click="batchRemove">删除选中</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <span @click="removeAllFile">删除全部</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import ExportFileFilterParams from './components/ExportFileFilterParams';
    import ExportFileOperateTable from './components/ExportFileOperateTable';

    export default {
        name: 'ExportFileList',
        components: {
            ExportFileFilterParams,
            ExportFileOperateTable
        },
        data() {
            return {
                listQueryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                exportFileList: [],
                isDisabled: true
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$wsCache.localStorage.get('exportFileFilter')) {
                    this.listQueryParams = this.$wsCache.localStorage.get('exportFileFilter');
                    this.$refs.exportFileFilterParams.initFilterParams(this.listQueryParams);
                }
                this.getExportFileList();
            },
            setBatchDisabledStatus(isDisabled) {
                this.isDisabled = isDisabled;
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getExportFileList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getExportFileList();
            },
            getExportFileList(searchParams, isReset) {
                // 设置请求参数
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                if (isReset) {
                    this.listQueryParams.pageNum = 1;
                }
                this.$wsCache.localStorage.set('exportFileFilter', this.listQueryParams);
                this.$service.getExportFileList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.exportFileList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            // 批量删除
            batchRemove() {
                this.$refs.exportFileOperateTable.batchRemove();
            },
            removeAllFile() {
                this.$refs.exportFileOperateTable.removeAllFile();
            }
        }
    };
</script>

<style lang="scss" scoped>

    // 含有svg的样式
    .btn-style-two {
        padding: 0px 20px;
        &:hover {
            .svg-icon {
                fill: #A3D0FD;
            }
        }
        .svg-icon {
            fill: #A3D0FD;
            &.svg-icon-add {
                margin-right: 5px;
            }
            &.svg-icon-arrow_down {
                margin-left: 5px;
                height: 10px !important;
                width: 10px !important;
            }
        }
    }

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

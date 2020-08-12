<!-- 激活码列表 -->
<template>
    <div>
        <div class="content-title">搜索筛选</div>
        <activation-code-filter-params
            ref="codeFilterParams"
            v-on:getCodeList="getCodeList">
        </activation-code-filter-params>
        <div class="content-title">激活码列表</div>
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
                            <span @click="batchExport">导出选中</span>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <span @click="exportAll">导出全部</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="float-right">
                <el-button
                    class="btn-style-two contain-svg-icon"
                    @click="generateActivationCode">
                    生成激活码
                </el-button>
            </div>
        </div>
        <activation-code-operate-table
            ref="codeOperateTable"
            :codeList="codeList"
            v-on:getCodeList="getCodeList"
            v-on:setBatchDisabledStatus="setBatchDisabledStatus">
        </activation-code-operate-table>
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
                        <span @click="batchExport">导出选中</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <span @click="exportAll">导出全部</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import ActivationCodeFilterParams from '../search_filter_params/ActivationCodeFilterParams';
    import ActivationCodeOperateTable from './components/ActivationCodeOperateTable';

    export default {
        name: 'ActivationCodeList',
        components: {
            ActivationCodeFilterParams,
            ActivationCodeOperateTable
        },
        data() {
            return {
                listQueryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                codeList: [],
                isDisabled: false
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$wsCache.localStorage.get('codeFilter')) {
                    this.listQueryParams = this.$wsCache.localStorage.get('codeFilter');
                    this.$refs.codeFilterParams.initFilterParams(this.listQueryParams);
                }
                this.getCodeList();
            },
            generateActivationCode() {
                this.$prompt(' ', '添加激活码', {
                    customClass: 'active-code-message',
                    confirmButtonText: '生成',
                    showCancelButton: false,
                    inputPlaceholder: '请输入添加数量，仅可输入数字',
                    inputPattern: /^[1-9]\d*$/,
                    inputErrorMessage: '请输入正确的数值'
                }).then(({value}) => {
                    this.createActiveCode(value);
                }).catch(() => {
                });
            },
            createActiveCode(num) {
                this.$service.createActiveCode({num}).then(response => {
                    if (response.type === 'application/octet-stream' || response.type === 'application/vnd.ms-excel') {
                        this.$message.success('正在导出激活码列表，请稍等');
                        let aLink = document.createElement('a');
                        let blob = new Blob([response], {type: 'application/vnd.ms-excel'});
                        aLink.href = URL.createObjectURL(blob);
                        aLink.setAttribute('download', '激活码列表_' + this.$util.formatDate(new Date(), 'yyyy-MM-DD_HH:mm:SS') + '.xlsx');
                        aLink.click();
                    } else {
                        this.$message.warning('生成激活码失败,请重新生成');
                    }
                });
            },
            setBatchDisabledStatus(isDisabled) {
                this.isDisabled = isDisabled;
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getCodeList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getCodeList();
            },
            getCodeList(searchParams, isReset) {
                // 设置请求参数
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                if (isReset) {
                    this.listQueryParams.pageNum = 1;
                }
                this.$wsCache.localStorage.set('codeFilter', this.listQueryParams);
                this.$service.getCodeList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.codeList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            // 批量删除
            batchRemove() {
                this.$refs.codeOperateTable.batchRemove(true);
            },
            // 批量导出
            batchExport() {
                this.$refs.codeOperateTable.batchExport(false);
            },
            // 导出全部
            exportAll() {
                this.$refs.codeOperateTable.exportAll();
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

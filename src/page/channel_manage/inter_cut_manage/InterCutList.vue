<!--内容管理-频道管理-轮播插播列表组件-->
<template>
    <div>
        <div class="content-title">搜索筛选</div>
        <div class="block-box">
            <inter-cut-filter-params
                ref="interCutFilterParams"
                v-on:getInterCutList="getInterCutList">
            </inter-cut-filter-params>
            <div class="content-title">轮播插播列表</div>
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
                                <span @click="batchRemoveInterCut">批量删除</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="float-right">
                    <el-button
                        class="btn-style-two contain-svg-icon"
                        @click="createInterCut">
                        <svg-icon icon-class="add"></svg-icon>
                        添加
                    </el-button>
                </div>
            </div>
            <inter-cut-operate-table
                ref="interCutOperateTable"
                :interCutList="interCutList"
                v-on:getInterCutList="getInterCutList"
                v-on:setBatchDisabledStatus="setBatchDisabledStatus">
            </inter-cut-operate-table>
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
                            <span @click="batchRemoveInterCut">批量删除</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>

<script>
    import InterCutFilterParams from '../../search_filter_params/InterCutFilterParams';
    import InterCutOperateTable from './InterCutOperateTable';
    import wsCache from '@/util/webStorage';

    export default {
        name: 'InterCutList',
        components: {
            InterCutFilterParams,
            InterCutOperateTable
        },
        data() {
            return {
                listQueryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                interCutList: [],
                isDisabled: true
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (wsCache.localStorage.get('interCutListParams')) {
                    this.listQueryParams = wsCache.localStorage.get('interCutListParams');
                    this.$refs.interCutFilterParams.initFilterParams(this.listQueryParams);
                }
                this.getInterCutList();
            },
            getInterCutList(searchParams, isReset) {
                // 设置请求参数
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                if (isReset) {
                    this.listQueryParams.pageNum = 1;
                }
                wsCache.localStorage.set('interCutListParams', this.listQueryParams);
                this.$service.getInterCutList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.interCutList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            setBatchDisabledStatus(isDisabled) {
                this.isDisabled = isDisabled;
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getInterCutList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getInterCutList();
            },
            // 批量删除
            batchRemoveInterCut() {
                this.$refs.interCutOperateTable.batchRemove();
            },
            createInterCut() {
                this.$router.push({name: 'CreateInterCut'});
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

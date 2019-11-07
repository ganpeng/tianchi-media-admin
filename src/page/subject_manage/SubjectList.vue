<!--内容管理-专题管理-专题列表（包含人物和节目）组件-->
<template>
    <div>
        <div class="content-title">搜索筛选</div>
        <subject-filter-params
            ref="subjectFilterParams"
            v-on:getSubjectList="getSubjectList">
        </subject-filter-params>
        <div class="content-title">专题列表</div>
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
                            <span @click="batchShelve">批量上架</span>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <span @click="batchUnShelve">批量下架</span>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <span @click="batchRemove">批量删除</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="float-right">
                <el-dropdown
                    @command="createSubject($event)" placement="bottom">
                    <el-button class="btn-style-two contain-svg-icon">
                        <svg-icon icon-class="add"></svg-icon>
                        添加
                        <svg-icon icon-class="arrow_down"></svg-icon>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="PROGRAMME">节目专题</el-dropdown-item>
                        <el-dropdown-item command="FIGURE">人物专题</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
        <subject-operate-table
            ref="subjectOperateTable"
            :subjectList="subjectList"
            v-on:getSubjectList="getSubjectList"
            v-on:setBatchDisabledStatus="setBatchDisabledStatus">
        </subject-operate-table>
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
                        <span @click="batchShelve">批量上架</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <span @click="batchUnShelve">批量下架</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <span @click="batchRemove">批量删除</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import SubjectFilterParams from '../search_filter_params/SubjectFilterParams';
    import SubjectOperateTable from './components/SubjectOperateTable';

    export default {
        name: 'SubjectList',
        components: {
            SubjectFilterParams,
            SubjectOperateTable
        },
        data() {
            return {
                listQueryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                subjectList: [],
                isDisabled: true
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$wsCache.localStorage.get('subjectFilter')) {
                    this.listQueryParams = this.$wsCache.localStorage.get('subjectFilter');
                    this.$refs.subjectFilterParams.initFilterParams(this.listQueryParams);
                }
                this.getSubjectList();
            },
            setBatchDisabledStatus(isDisabled) {
                this.isDisabled = isDisabled;
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getSubjectList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getSubjectList();
            },
            getSubjectList(searchParams, isReset) {
                // 设置请求参数
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                if (isReset) {
                    this.listQueryParams.pageNum = 1;
                }
                this.$wsCache.localStorage.set('subjectFilter', this.listQueryParams);
                this.$service.getSubjectList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.subjectList = response.data.list;
                        this.total = response.data.total;
                    }
                });
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
            // 创建专题
            createSubject(command) {
                let routeData = this.$router.resolve({
                    name: command === 'PROGRAMME' ? 'CreateProgrammeSubject' : 'CreateFigureSubject'
                });
                window.open(routeData.href, '_blank');
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

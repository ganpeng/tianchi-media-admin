<!--部门管理-部门列表-->
<template>
    <div>
        <div class="content-title">搜索筛选</div>
        <department-filter-params
            ref="departmentFilterParams"
            v-on:getDepartmentList="getDepartmentList">
        </department-filter-params>
        <div class="content-title">部门列表</div>
        <div class="table-operator-field">
            <div></div>
            <el-button
                class="btn-style-two contain-svg-icon"
                @click="createDepartment">
                <svg-icon icon-class="add"></svg-icon>
                添加
            </el-button>
        </div>
        <department-operate-table
            ref="departmentOperateTable"
            :departmentList="departmentList"
            v-on:getDepartmentList="getDepartmentList">
        </department-operate-table>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="listQueryParams.pageNum"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="listQueryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
    </div>
</template>

<script>
    import DepartmentFilterParams from '../search_filter_params/DepartmentFilterParams';
    import DepartmentOperateTable from './components/DepartmentOperateTable';

    export default {
        name: 'DepartmentList',
        components: {
            DepartmentFilterParams,
            DepartmentOperateTable
        },
        data() {
            return {
                listQueryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                departmentList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$wsCache.localStorage.get('departmentFilter')) {
                    this.listQueryParams = this.$wsCache.localStorage.get('departmentFilter');
                    this.$refs.departmentFilterParams.initFilterParams(this.listQueryParams);
                }
                this.getDepartmentList();
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getDepartmentList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getDepartmentList();
            },
            getDepartmentList(searchParams, isReset) {
                // 设置请求参数
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                if (isReset) {
                    this.listQueryParams.pageNum = 1;
                }
                this.$wsCache.localStorage.set('departmentFilter', this.listQueryParams);
                this.$service.getDepartmentList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.departmentList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            createDepartment() {
                this.$router.push({name: 'CreateDepartment'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-pagination {
        margin-top: 10px;
    }

</style>

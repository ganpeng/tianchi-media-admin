<!--用户列表组件-->
<template>
    <div class="user-list-container">
        <div class="table-container">
            <h2 class="content-title">搜索筛选</h2>
            <user-filter-params
                ref="userFilterParams"
                v-on:getUserList="getUserList">
            </user-filter-params>
            <div class="seperator-line"></div>
            <div class="table-field">
                <h2 class="content-title">用户列表</h2>
                <user-operate-table
                    :userList="userList">
                </user-operate-table>
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
        </div>
    </div>
</template>

<script>
    import UserFilterParams from '../search_filter_params/UserFilterParams';
    import UserOperateTable from './components/UserOperateTable';

    export default {
        name: 'UserList',
        components: {
            UserFilterParams,
            UserOperateTable
        },
        data() {
            return {
                listQueryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                userList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$wsCache.localStorage.get('userFilter')) {
                    this.listQueryParams = this.$wsCache.localStorage.get('userFilter');
                    this.$refs.userFilterParams.initFilterParams(this.listQueryParams);
                }
                this.getUserList();
            },
            getUserList(searchParams, isReset) {
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                if (isReset) {
                    this.listQueryParams.pageNum = 1;
                }
                this.$service.getUserList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.userList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getUserList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getUserList();
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-pagination {
        margin-top: 10px;
    }

</style>

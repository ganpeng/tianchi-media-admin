<!--管理员管理-管理员列表-->
<template>
    <div>
        <div class="content-title">搜索筛选</div>
        <admin-filter-params
            ref="adminFilterParams"
            v-on:getAdminList="getAdminList">
        </admin-filter-params>
        <div class="content-title">管理员列表</div>
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
                            <span @click="batchShelve">启用选中</span>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <span @click="batchUnShelve">禁用选中</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <el-button
                class="btn-style-two contain-svg-icon"
                @click="createAdmin">
                <svg-icon icon-class="add"></svg-icon>
                添加
            </el-button>
        </div>
        <admin-operate-table
            ref="adminOperateTable"
            :adminList="adminList"
            v-on:getAdminList="getAdminList"
            v-on:setBatchDisabledStatus="setBatchDisabledStatus">
        </admin-operate-table>
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
                        <span @click="batchShelve">启用选中</span>
                    </el-dropdown-item>
                    <el-dropdown-item>
                        <span @click="batchUnShelve">禁用选中</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import AdminFilterParams from '../search_filter_params/AdminFilterParams';
    import AdminOperateTable from './components/AdminOperateTable';

    export default {
        name: 'AdminList',
        components: {
            AdminFilterParams,
            AdminOperateTable
        },
        data() {
            return {
                listQueryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                adminList: [],
                isDisabled: true
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$wsCache.localStorage.get('adminFilter')) {
                    this.listQueryParams = this.$wsCache.localStorage.get('adminFilter');
                    this.$refs.adminFilterParams.initFilterParams(this.listQueryParams);
                }
                this.getAdminList();
            },
            setBatchDisabledStatus(isDisabled) {
                this.isDisabled = isDisabled;
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getAdminList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getAdminList();
            },
            // 批量上架
            batchShelve() {
                this.$refs.adminOperateTable.batchUpdateStatus(true);
            },
            // 批量下架
            batchUnShelve() {
                this.$refs.adminOperateTable.batchUpdateStatus(false);
            },
            getAdminList(searchParams, isReset) {
                // 设置请求参数
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                if (isReset) {
                    this.listQueryParams.pageNum = 1;
                }
                this.$wsCache.localStorage.set('adminFilter', this.listQueryParams);
                this.$service.getAdminList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.adminList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            createAdmin() {
                if (!this.$authority.isHasAuthority('admin:admin:add')) {
                    return;
                }
                this.$router.push({name: 'CreateAdmin'});
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-pagination {
        margin-top: 10px;
    }

</style>

<!--角色管理-角色列表-->
<template>
    <div>
        <div class="content-title">搜索筛选</div>
        <role-filter-params
            ref="roleFilterParams"
            v-on:getRoleList="getRoleList">
        </role-filter-params>
        <div class="content-title">角色列表</div>
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
                        <el-dropdown-item>
                            <span @click="batchRemove">删除选中</span>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <el-button
                class="btn-style-two contain-svg-icon"
                @click="createRole">
                <svg-icon icon-class="add"></svg-icon>
                添加
            </el-button>
        </div>
        <role-operate-table
            ref="roleOperateTable"
            :roleList="roleList"
            v-on:getRoleList="getRoleList"
            v-on:setBatchDisabledStatus="setBatchDisabledStatus">
        </role-operate-table>
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
                    <el-dropdown-item>
                        <span @click="batchRemove">删除选中</span>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
    import RoleFilterParams from '../search_filter_params/RoleFilterParams';
    import RoleOperateTable from './components/RoleOperateTable';

    export default {
        name: 'RoleList',
        components: {
            RoleFilterParams,
            RoleOperateTable
        },
        data() {
            return {
                isDisabled: true,
                listQueryParams: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                roleList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if (this.$wsCache.localStorage.get('roleFilter')) {
                    this.listQueryParams = this.$wsCache.localStorage.get('roleFilter');
                    this.$refs.roleFilterParams.initFilterParams(this.listQueryParams);
                }
                this.getRoleList();
            },
            setBatchDisabledStatus(isDisabled) {
                this.isDisabled = isDisabled;
            },
            handleSizeChange(pageSize) {
                this.listQueryParams.pageSize = pageSize;
                this.getRoleList();
            },
            handleCurrentChange(pageNum) {
                this.listQueryParams.pageNum = pageNum;
                this.getRoleList();
            },
            getRoleList(searchParams, isReset) {
                // 设置请求参数
                if (searchParams) {
                    for (let key in searchParams) {
                        this.listQueryParams[key] = searchParams[key];
                    }
                }
                if (isReset) {
                    this.listQueryParams.pageNum = 1;
                }
                this.$wsCache.localStorage.set('roleFilter', this.listQueryParams);
                this.$service.getRoleList(this.listQueryParams).then(response => {
                    if (response && response.code === 0) {
                        this.roleList = response.data.list;
                        this.total = response.data.total;
                    }
                });
            },
            createRole() {
                if (!this.$authority.isHasAuthority('admin:role:add')) {
                    return;
                }
                this.$router.push({name: 'CreateRole'});
            },
            // 批量上架
            batchShelve() {
                this.$refs.roleOperateTable.batchUpdateStatus(true);
            },
            // 批量下架
            batchUnShelve() {
                this.$refs.roleOperateTable.batchUpdateStatus(false);
            },
            // 批量删除
            batchRemove() {
                this.$refs.roleOperateTable.batchRemove();
            }
        }
    };
</script>

<style lang="scss" scoped>

    .el-pagination {
        margin-top: 10px;
    }

</style>

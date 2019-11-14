<!--角色列表项组件-->
<template>
    <div>
        <el-table
            :data="roleList"
            @selection-change="handleSelectionChange"
            border
            style="width: 100%">
            <el-table-column
                type="selection"
                align="center"
                width="60px">
            </el-table-column>
            <el-table-column
                align="center"
                prop="id"
                width="120px"
                label="编号">
            </el-table-column>
            <el-table-column
                align="center"
                prop="name"
                min-width="220px"
                label="名称">
                <template slot-scope="scope">
                <span @click="toRoleDetail(scope.row)" class="ellipsis four name">
                    {{scope.row.roleName}}
                </span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="adminNumber"
                min-width="130px"
                label="成员数量">
            </el-table-column>
            <el-table-column
                align="center"
                prop="roleDesc"
                min-width="130px"
                label="描述">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="更新时间">
                <template slot-scope="scope">
                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="创建时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="状态">
                <template slot-scope="scope">
                    <input
                        class="my-switch switch-anim"
                        type="checkbox"
                        v-model="scope.row.visible"
                        :checked="scope.row.visible"
                        @click.prevent="updateRoleStatus(scope.row)"/>
                    <i v-if="scope.row.visible" class="on-the-shelf">已启用</i>
                    <i v-else class="off-the-shelf">已禁用</i>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                width="110px">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <span class="btn-text" @click="editRole(scope.row)">编辑</span>
                        <span class="btn-text text-danger" @click="removeRole(scope.row)">删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        name: 'RoleOperateTable',
        props: {
            roleList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {
                roleListVisible: false,
                currentRoleList: []
            };
        },
        methods: {
            updateRoleStatus(item) {
                if (!this.$authority.isHasAuthority('admin:role:visible')) {
                    return;
                }
                this.$confirm('此操作将' + (item.visible ? '禁用' : '启用') + item.roleName + '角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.setRoleVisible(item.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('"' + item.roleName + '"角色' + (item.visible ? '禁用成功' : '启用成功'));
                            item.visible = !item.visible;
                        }
                    });
                });
            },
            // 批量上下架，已上架的可以继续上架
            batchUpdateStatus(visible) {
                if (!this.$authority.isHasAuthority('admin:role:batchVisible')) {
                    return;
                }
                if (!this.multipleSelection || this.multipleSelection.length === 0) {
                    this.$message.warning('请先选择角色');
                    return;
                }
                this.$confirm('此操作将批量' + (visible ? '启用' : '禁用') + '角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let idList = [];
                    this.multipleSelection.map(item => {
                        idList.push(item.id);
                    });
                    this.$service.batchSetRoleVisible({idList, visible}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('角色批量' + (visible ? '启用' : '禁用') + '成功!');
                            this.$emit('getRoleList');
                            this.multipleSelection = [];
                            this.$emit('setBatchDisabledStatus', true);
                        }
                    });
                });
            },
            // 查看详情
            toRoleDetail(item) {
                if (!this.$authority.isHasAuthority('admin:role:get')) {
                    return;
                }
                this.$router.push({
                    name: 'RoleDetail',
                    params: {id: item.id}
                });
            },
            editRole(item) {
                if (!this.$authority.isHasAuthority('admin:role:put')) {
                    return;
                }
                this.$router.push({
                    name: 'EditRole',
                    params: {id: item.id}
                });
            },
            // 勾选角色
            handleSelectionChange(val) {
                this.multipleSelection = val;
                if (this.multipleSelection.length === 0) {
                    this.$emit('setBatchDisabledStatus', true);
                } else {
                    this.$emit('setBatchDisabledStatus', false);
                }
            },
            removeRole(item) {
                if (!this.$authority.isHasAuthority('admin:role:delete')) {
                    return;
                }
                if (item.visible) {
                    this.$message.warning('当前角色处于启用状态，请禁用之后再进行删除操作');
                    return;
                }
                this.$confirm('此操作将删除' + item.roleName + '角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.removeRole(item.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('"' + item.roleName + '"' + '角色删除成功!');
                            this.$emit('getRoleList');
                            this.multipleSelection = [];
                            this.$emit('setBatchDisabledStatus', true);
                        }
                    });
                });
            },
            batchRemove() {
                if (!this.$authority.isHasAuthority('admin:role:batchDelete')) {
                    return;
                }
                if (!this.multipleSelection || this.multipleSelection.length === 0) {
                    this.$message.warning('请先选择角色');
                    return;
                }
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (this.multipleSelection[i].visible) {
                        this.$message.warning('当前选中的角色中含有已启用的角色，暂时不能批量删除');
                        return;
                    }
                }
                this.$confirm('此操作将批量删除角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let roleIdList = [];
                    this.multipleSelection.map(role => {
                        roleIdList.push(role.id);
                    });
                    this.$service.batchRemoveRole({idList: roleIdList}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('角色批量删除成功!');
                            this.$emit('getRoleList');
                            this.multipleSelection = [];
                            this.$emit('setBatchDisabledStatus', true);
                        }
                    });
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    .operator-btn-wrapper {
        span {
            margin-left: 0px;
        }
    }

    .role-list {
        ul {
            text-align: left;
            li {
                display: inline-block;
                margin-bottom: 10px;
                .el-tag {
                    border: none;
                    margin-right: 10px;
                }
            }
        }
    }

</style>

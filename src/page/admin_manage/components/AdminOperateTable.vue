<!--管理员列表项组件-->
<template>
    <div>
        <el-table
            :data="adminList"
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
                label="姓名">
                <template slot-scope="scope">
                <span @click="toAdminDetail(scope.row)" class="ellipsis four name">
                    {{scope.row.name}}
                </span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="email"
                min-width="130px"
                label="邮箱">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                prop="mobile"
                label="手机">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                prop="department"
                label="部门">
                <template slot-scope="scope">
                    {{scope.row.departmentList | jsonJoin('name')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                prop="roleName"
                label="角色">
                <template slot-scope="scope">
                    {{scope.row.roleList[0] && scope.row.roleList[0].roleName}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="状态">
                <template slot-scope="scope">
                    <input
                        class="my-switch switch-anim"
                        type="checkbox"
                        v-if="scope.row.status === 'NORMAL'"
                        :checked="scope.row.status === 'NORMAL'"
                        @click.prevent="disabledConfirm(scope.row.id, scope.row.status)"/>
                    <input
                        class="my-switch switch-anim"
                        type="checkbox"
                        v-if="scope.row.status !== 'NORMAL'"
                        :checked="scope.row.status === 'NORMAL'"
                        @click.prevent="recoverConfirm(scope.row.id, scope.row.status)"/>
                    <i v-if="scope.row.status === 'NORMAL'" class="on-the-shelf">正常</i>
                    <i v-else class="off-the-shelf">禁用</i>
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
                label="更新时间">
                <template slot-scope="scope">
                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                width="90px">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <span class="btn-text" @click="editAdmin(scope.row)">编辑</span>
                        <span class="btn-text text-danger" @click="removeAdmin(scope.row)">删除</span>
                        <span class="btn-text text-danger" @click="resetPassword(scope.row)">重置密码</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        name: 'AdminOperateTable',
        props: {
            adminList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {
                multipleSelection: []
            };
        },
        methods: {
            // 勾选专题
            handleSelectionChange(val) {
                this.multipleSelection = val;
                if (this.multipleSelection.length === 0) {
                    this.$emit('setBatchDisabledStatus', true);
                } else {
                    this.$emit('setBatchDisabledStatus', false);
                }
            },
            // 禁用确认
            disabledConfirm(userId, userStatus) {
                this.$confirm('此操作将禁用该账号, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.setAdminStatus(userId, userStatus);
                }).catch(() => {
                });
            },
            // 恢复确认
            recoverConfirm(userId, userStatus) {
                this.$confirm('此操作将恢复该账号, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.setAdminStatus(userId, userStatus);
                }).catch(() => {
                });
            },
            // 禁用或恢复管理员账号状态
            setAdminStatus(userId, userStatus) {
                let status = userStatus === 'NORMAL' ? 'FORBIDDEN' : 'NORMAL';
                this.$service.setAdminStatus({id: userId, status: status}).then(response => {
                    if (response && response.code === 0) {
                        if (userStatus === 'NORMAL') {
                            this.$message({
                                type: 'success',
                                message: '禁用成功!'
                            });
                        } else {
                            this.$message({
                                type: 'success',
                                message: '恢复成功!'
                            });
                        }
                        this.$emit('getAdminList');
                    }
                });
            },
            batchUpdateStatus(visible) {
                if (!this.multipleSelection || this.multipleSelection.length === 0) {
                    this.$message.warning('请先选择管理员');
                    return;
                }
                this.$confirm('此操作将批量' + (visible ? '启用' : '禁用') + '管理员, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let idList = [];
                    this.multipleSelection.map(item => {
                        idList.push(item.id);
                    });
                    let status = visible ? 'NORMAL' : 'FORBIDDEN';
                    this.$service.batchUpdateAdminStatus({idList, status}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('管理员批量' + (visible ? '启用' : '禁用') + '成功!');
                            this.$emit('getAdminList');
                            this.multipleSelection = [];
                            this.$emit('setBatchDisabledStatus', true);
                        }
                    });
                });
            },
            // 查看详情
            toAdminDetail(item) {
                this.$router.push({
                    name: 'AdminDetail',
                    params: {id: item.id}
                });
            },
            editAdmin(item) {
                this.$router.push({
                    name: 'EditAdmin',
                    params: {id: item.id}
                });
            },
            removeAdmin(item) {
                if (item.status === 'NORMAL') {
                    this.$message.warning('当前专题处于启用状态，请禁用之后再进行删除操作');
                    return;
                }
                this.$confirm('此操作将删除' + item.name + '管理员, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.removeAdmin(item.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('"' + item.name + '"' + '管理员删除成功!');
                            this.$emit('getAdminList');
                            this.multipleSelection = [];
                            this.$emit('setBatchDisabledStatus', true);
                        }
                    });
                });
            },
            resetPassword(item) {
                this.$confirm('此操作将重置' + item.name + '管理员的密码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.resetAdminPassword({id: item.id}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('"' + item.name + '"' + '管理员密码重置成功!');
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

</style>

<!--角色列表项组件-->
<template>
    <div>
        <el-table
            :data="roleList"
            border
            style="width: 100%">
            <el-table-column
                align="center"
                prop="code"
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
                    {{scope.row.name}}
                </span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="roleList"
                min-width="130px"
                label="成员数量">
                <template slot-scope="scope">
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="roleList"
                min-width="130px"
                label="描述">
                <template slot-scope="scope">
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
                    <i v-if="scope.row.visible" class="on-the-shelf">已上架</i>
                    <i v-else class="off-the-shelf">已下架</i>
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
                this.$confirm('此操作将' + (item.visible ? '下架' : '上架') + item.name + '角色, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.setRoleVisible({id: item.id, visible: !item.visible}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('"' + item.name + '"角色' + (item.visible ? '下架成功' : '上架成功'));
                            item.visible = !item.visible;
                        }
                    });
                });
            },
            // 查看详情
            toRoleDetail(item) {
                this.$router.push({
                    name: 'RoleDetail',
                    params: {id: item.id}
                });
            },
            editRole(item) {
                this.$router.push({
                    name: 'EditRole',
                    params: {id: item.id}
                });
            },
            removeRole(item) {
                if (item.visible) {
                    this.$message.warning('当前专题处于上架状态，请下架之后再进行删除操作');
                    return;
                }
                this.$confirm('此操作将删除' + item.name + '专题, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.deleteSubject(item.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('"' + item.name + '"' + '专题删除成功!');
                            this.$emit('getSubjectList');
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

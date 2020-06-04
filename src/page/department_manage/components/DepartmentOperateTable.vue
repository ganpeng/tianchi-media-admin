<!--部门列表项组件-->
<template>
    <div>
        <el-table
            :data="departmentList"
            border
            style="width: 100%">
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
                <span @click="toDepartmentDetail(scope.row)" class="ellipsis four name">
                    {{scope.row.name}}
                </span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="departmentList"
                min-width="130px"
                label="成员数量">
                <template slot-scope="scope">
                    {{scope.row.adminNumber}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="负责人">
                <template slot-scope="scope">
                    {{adminNameList(scope.row.adminList)}}
                    <!-- {{scope.row.adminNameList}} -->
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="部门描述">
                <template slot-scope="scope">
                    <label class="ellipsis one">{{scope.row.remark}}</label>
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
                width="110px">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <span class="btn-text" @click="editDepartment(scope.row)">编辑</span>
                        <span class="btn-text text-danger" @click="removeDepartment(scope.row)">删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        name: 'DepartmentOperateTable',
        props: {
            departmentList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {};
        },
        computed: {
            adminNameList() {
                return (adminList) => {
                    return adminList.filter((item) => item.administrative);
                };
            }
        },
        methods: {
            toDepartmentDetail(item) {
                if (!this.$authority.isHasAuthority('admin:department:get')) {
                    return;
                }
                this.$router.push({
                    name: 'DepartmentDetail',
                    params: {id: item.id}
                });
            },
            editDepartment(item) {
                if (!this.$authority.isHasAuthority('admin:department:put')) {
                    return;
                }
                this.$router.push({
                    name: 'EditDepartment',
                    params: {id: item.id}
                });
            },
            removeDepartment(item) {
                if (!this.$authority.isHasAuthority('admin:department:delete')) {
                    return;
                }
                this.$confirm('此操作将删除' + item.name + '部门, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.removeDepartment(item.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('"' + item.name + '"' + '部门删除成功!');
                            this.$emit('getDepartmentList');
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

    .department-list {
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

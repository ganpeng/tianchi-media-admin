<!--部门列表项组件-->
<template>
    <div>
        <el-table
            :data="departmentList"
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
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="负责人">
                <template slot-scope="scope">
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
        methods: {
            toDepartmentDetail(item) {
                this.$router.push({
                    name: 'DepartmentDetail',
                    params: {id: item.id}
                });
            },
            editDepartment(item) {
                this.$router.push({
                    name: 'EditDepartment',
                    params: {id: item.id}
                });
            },
            removeDepartment(item) {
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

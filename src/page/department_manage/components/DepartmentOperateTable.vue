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
                label="包含产品包">
                <template slot-scope="scope">
                    <span @click="checkDepartmentList(scope.row)" class="ellipsis four name">
                    查看
                </span>
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
                        @click.prevent="updateDepartmentStatus(scope.row)"/>
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
                        <span class="btn-text" @click="editDepartment(scope.row)">编辑</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog
            title="产品列表"
            :visible.sync="departmentListVisible"
            :close-on-click-modal="false"
            custom-class="normal-dialog department-list"
            width="40%">
            <div class="batch-share-body" v-if="departmentListVisible">
                <ul>
                    <li v-for="(item, index) in currentDepartmentList" :key="index">
                        <el-tag type="info">{{item.name}}</el-tag>
                    </li>
                </ul>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="departmentListVisible = false">确定</el-button>
            </span>
        </el-dialog>
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
            return {
                departmentListVisible: false,
                currentDepartmentList: []
            };
        },
        methods: {
            updateDepartmentStatus(item) {
                this.$confirm('此操作将' + (item.visible ? '下架' : '上架') + item.name + '部门, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.setDepartmentVisible({id: item.id, visible: !item.visible}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('"' + item.name + '"部门' + (item.visible ? '下架成功' : '上架成功'));
                            item.visible = !item.visible;
                        }
                    });
                });
            },
            checkDepartmentList(department) {
                this.$service.getDepartmentDetail(department.id).then(response => {
                    if (response && response.code === 0) {
                        this.currentDepartmentList = response.data.productList;
                        this.departmentListVisible = true;
                    } else {
                        this.$message.warning('因请求问题，暂时未查看到对应产品列表');
                    }
                });
            },
            // 查看详情
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

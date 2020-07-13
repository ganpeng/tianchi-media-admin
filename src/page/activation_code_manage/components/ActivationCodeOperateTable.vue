<!--激活码列表项组件-->
<template>
    <div>
        <el-table
            :data="codeList"
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
                prop="code"
                label="激活码">
            </el-table-column>
            <el-table-column
                align="center"
                prop="name"
                label="用户ID">
                <template slot-scope="scope">
                <span @click="toCodeDetail(scope.row)" class="ellipsis four name">
                    {{scope.row.name}}
                </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="relatedCount"
                align="center"
                label="生成时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="状态">
                <template slot-scope="scope">
                    <label v-if="scope.row.visible">已使用</label>
                    <label v-else>未使用</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="使用时间">
                <template slot-scope="scope">
                    {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                width="110px">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <span class="btn-text text-danger" @click="removeCode(scope.row)">删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        name: 'CodeOperateTable',
        props: {
            codeList: {
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
            // 勾选激活码
            handleSelectionChange(val) {
                this.multipleSelection = val;
                if (this.multipleSelection.length === 0) {
                    this.$emit('setBatchDisabledStatus', true);
                } else {
                    this.$emit('setBatchDisabledStatus', false);
                }
            },
            // 删除单个激活码,只有未使用的激活码才能删除
            removeCode(item) {
                if (item.visible) {
                    this.$message.warning('当前激活码处于使用状态，不能进行删除操作');
                    return;
                }
                this.$confirm('此操作将删除' + item.name + '激活码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.deleteCode(item.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('"' + item.name + '"' + '激活码删除成功!');
                            this.$emit('getCodeList');
                            this.multipleSelection = [];
                            this.$emit('setBatchDisabledStatus', true);
                        }
                    });
                });
            },
            // 批量删除激活码，只有未使用的激活码才能删除
            batchRemove() {
                if (!this.multipleSelection || this.multipleSelection.length === 0) {
                    this.$message.warning('请先选择激活码');
                    return;
                }
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (this.multipleSelection[i].visible) {
                        this.$message.warning('当前选中的激活码中含有已使用的激活码，暂时不能批量删除');
                        return;
                    }
                }
                this.$confirm('此操作将批量删除激活码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let codeIdList = [];
                    this.multipleSelection.map(code => {
                        codeIdList.push(code.id);
                    });
                    this.$service.batchDeleteCode({idList: codeIdList}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('激活码批量删除成功!');
                            this.$emit('getCodeList');
                            this.multipleSelection = [];
                            this.$emit('setBatchDisabledStatus', true);
                        }
                    });
                });
            },
            // 导出选中
            batchExport() {
            },
            // 导出全部
            exportAll() {
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>

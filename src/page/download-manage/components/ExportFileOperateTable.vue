<!-- 导出列表项组件 -->
<template>
    <el-table
        :data="exportFileList"
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
            width="150px"
            label="文件名称">
        </el-table-column>
        <el-table-column
            align="center"
            min-width="140px"
            prop="status"
            label="状态">
            <template slot-scope="scope">
                <label>{{scope.row.itemCount}}</label>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            min-width="140px"
            label="开始时间">
            <template slot-scope="scope">
                {{scope.row.createdAt | formatDate('yyyy-MM-DD')}}
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            min-width="140px"
            label="完成时间">
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
                    <span class="btn-text" @click="downloadExportFile(scope.row)">下载</span>
                    <span class="btn-text text-danger" @click="removeExportFile(scope.row)">删除</span>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>

    export default {
        name: 'ExportFileOperateTable',
        props: {
            exportFileList: {
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
            // 勾选导出
            handleSelectionChange(val) {
                this.multipleSelection = val;
                if (this.multipleSelection.length === 0) {
                    this.$emit('setBatchDisabledStatus', true);
                } else {
                    this.$emit('setBatchDisabledStatus', false);
                }
            },
            // 删除单个导出,只有下架的导出才能删除
            removeExportFile(item) {
                if (item.visible) {
                    this.$message.warning('当前导出处于上架状态，请下架之后再进行删除操作');
                    return;
                }
                this.$confirm('此操作将删除' + item.name + '导出, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.deleteExportFile(item.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('"' + item.name + '"' + '导出删除成功!');
                            this.$emit('getExportFileList');
                            this.multipleSelection = [];
                            this.$emit('setBatchDisabledStatus', true);
                        }
                    });
                });
            },
            // 批量删除导出，只有已下架的导出才能删除
            batchRemove() {
                if (!this.multipleSelection || this.multipleSelection.length === 0) {
                    this.$message.warning('请先选择导出');
                    return;
                }
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (this.multipleSelection[i].visible) {
                        this.$message.warning('当前选中的导出中含有已上架的导出，暂时不能批量删除');
                        return;
                    }
                }
                this.$confirm('此操作将批量删除导出, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let exportFileIdList = [];
                    this.multipleSelection.map(exportFile => {
                        exportFileIdList.push(exportFile.id);
                    });
                    this.$service.batchDeleteExportFile({idList: exportFileIdList}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('导出批量删除成功!');
                            this.$emit('getExportFileList');
                            this.multipleSelection = [];
                            this.$emit('setBatchDisabledStatus', true);
                        }
                    });
                });
            },
            downloadExportFile(item) {
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>

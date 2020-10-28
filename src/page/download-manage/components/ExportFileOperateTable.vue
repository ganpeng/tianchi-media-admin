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
            prop="name"
            width="150px"
            label="文件名称">
        </el-table-column>
        <el-table-column
            align="center"
            min-width="140px"
            prop="status"
            label="状态">
            <template slot-scope="scope">
                <span v-if="scope.row.status === 'SUCCESS'" class="status-normal">成功</span>
                <span v-if="scope.row.status === 'FAILED'" class="status-abnormal">失败</span>
                <span v-if="scope.row.status === 'ON_GOING'" class="status-on-going">下载中</span>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            min-width="140px"
            label="开始时间">
            <template slot-scope="scope">
                <div>{{scope.row.startTime | formatDate('yyyy-MM-DD')}}</div>
                <div>{{scope.row.startTime | formatDate('HH:mm:SS')}}</div>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            min-width="140px"
            label="完成时间">
            <template slot-scope="scope">
                <div>{{scope.row.endTime | formatDate('yyyy-MM-DD')}}</div>
                <div>{{scope.row.endTime | formatDate('HH:mm:SS')}}</div>
                <div v-if="!scope.row.endTime">/</div>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="操作"
            width="110px">
            <template slot-scope="scope">
                <div class="operator-btn-wrapper">
                    <span class="btn-text" :class="{'disabled':scope.row.status !== 'SUCCESS'}"
                          @click="downloadExportFile(scope.row)">下载</span>
                    <span class="btn-text text-danger" :class="{'disabled':scope.row.status === 'ON_GOING'}"
                          @click="removeExportFile(scope.row)">删除</span>
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
            // 删除单个导出
            removeExportFile(item) {
                this.$confirm('此操作将删除' + item.name + ', 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.batchDeleteDownloadFile({idList: [item.id]}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('"' + item.name + '"' + '删除成功!');
                            this.$emit('getExportFileList');
                            this.multipleSelection = [];
                            this.$emit('setBatchDisabledStatus', true);
                        }
                    });
                });
            },
            // 批量删除导出
            batchRemove() {
                if (!this.multipleSelection || this.multipleSelection.length === 0) {
                    this.$message.warning('请先选择导出文件');
                    return;
                }
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (this.multipleSelection[i].status === 'ON_GOING') {
                        this.$message.warning('只有导出成功和失败的才可以删除');
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
                    this.$service.batchDeleteDownloadFile({idList: exportFileIdList}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('导出文件批量删除成功!');
                            this.$emit('getExportFileList');
                            this.multipleSelection = [];
                            this.$emit('setBatchDisabledStatus', true);
                        }
                    });
                });
            },
            // 删除全部
            removeAllFile() {
                this.$confirm('此操作将批量删除全部导出文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.batchDeleteDownloadFile({idList: null}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('导出文件全部删除成功!');
                            this.$emit('getExportFileList');
                            this.multipleSelection = [];
                            this.$emit('setBatchDisabledStatus', true);
                        }
                    });
                });
            },
            downloadExportFile(item) {
                this.$service.getDownloadFile(item.id).then(response => {
                    let aLink = document.createElement('a');
                    let blob = new Blob([response], {type: 'application/vnd.ms-excel'});
                    aLink.href = URL.createObjectURL(blob);
                    aLink.setAttribute('download', item.name);
                    aLink.click();
                    this.$refs.loadElement.appendChild(aLink);
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>

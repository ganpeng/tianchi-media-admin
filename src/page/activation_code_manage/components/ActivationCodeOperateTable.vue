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
                prop="activeCode"
                label="激活码">
                <template slot-scope="scope">
                    <span @click="toCodeDetail(scope.row)" class="ellipsis four name">
                    {{scope.row.activeCode}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                prop="userId"
                label="用户ID">
                <template slot-scope="scope">
                    {{scope.row.userId || '/'}}
                </template>
            </el-table-column>
            <el-table-column
                prop="createAt"
                align="center"
                label="生成时间">
                <template slot-scope="scope">
                    <div>{{scope.row.createAt | formatDate('yyyy-MM-DD')}}</div>
                    <div>{{scope.row.createAt | formatDate('HH:mm:SS')}}</div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="状态">
                <template slot-scope="scope">
                    <label v-if="scope.row.status === 'USED'" class="status-normal">已使用</label>
                    <label v-else class="status-deleting">未使用</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="使用时间">
                <template slot-scope="scope">
                    <div>{{scope.row.activeTime | formatDate('yyyy-MM-DD')}}</div>
                    <div>{{scope.row.activeTime | formatDate('HH:mm:SS')}}</div>
                    <div v-if="!scope.row.activeTime">/</div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="操作"
                width="110px">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <span class="btn-text text-danger" :class="{'disabled':scope.row.status === 'USED'}"
                              @click="removeCode(scope.row)">删除</span>
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
                if (item.status === 'USED') {
                    this.$message.warning('当前激活码处于使用状态，不能进行删除操作');
                    return;
                }
                this.$confirm('此操作将删除激活码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.removeActiveCode(item.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('激活码删除成功!');
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
                    if (this.multipleSelection[i].status === 'USED') {
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
                    this.$service.batchDeleteActiveCode({idList: codeIdList}).then(response => {
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
                if (!this.multipleSelection || this.multipleSelection.length === 0) {
                    this.$message.warning('请先选择激活码');
                    return;
                }
                let codeIdList = [];
                this.multipleSelection.map(code => {
                    codeIdList.push(code.id);
                });
                this.$service.exportSelectedActiveCode({idList: codeIdList}).then(response => {
                    if (response.type === 'application/octet-stream' || response.type === 'application/vnd.ms-excel') {
                        this.$message.success('正在导出激活码列表，请稍等');
                        let aLink = document.createElement('a');
                        let blob = new Blob([response], {type: 'application/vnd.ms-excel'});
                        aLink.href = URL.createObjectURL(blob);
                        aLink.setAttribute('download', '激活码列表_' + this.$util.formatDate(new Date(), 'yyyy-MM-DD_HH:mm:SS') + '.xlsx');
                        aLink.click();
                    } else {
                        this.$message.warning('导出激活码失败,请重新导出');
                    }
                });
            },
            // 导出全部
            exportAll() {
                this.$service.exportSelectedActiveCode({}).then(response => {
                    if (response.type === 'application/octet-stream' || response.type === 'application/vnd.ms-excel') {
                        this.$message.success('正在导出激活码列表，请稍等');
                        let aLink = document.createElement('a');
                        let blob = new Blob([response], {type: 'application/vnd.ms-excel'});
                        aLink.href = URL.createObjectURL(blob);
                        aLink.setAttribute('download', '激活码列表_' + this.$util.formatDate(new Date(), 'yyyy-MM-DD_HH:mm:SS') + '.xlsx');
                        aLink.click();
                    } else {
                        this.$message.warning('导出激活码失败,请重新导出');
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>

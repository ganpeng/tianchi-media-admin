<!--节目下载列表项组件-->
<template>
    <el-table
        :data="downloadProgrammeList"
        border
        @selection-change="handleSelectionChange"
        style="width: 100%">
        <el-table-column
            type="selection"
            align="center">
        </el-table-column>
        <el-table-column
            align="center"
            prop="code"
            width="120px"
            label="节目编号">
        </el-table-column>
        <el-table-column
            align="center"
            prop="name"
            min-width="220px"
            label="节目名称">
            <template slot-scope="scope">
                <span class="ellipsis four">
                    {{scope.row.name}}
                </span>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="price"
            width="100px"
            label="节目海报">
            <template slot-scope="scope">
                <img v-if="scope.row.coverImage && scope.row.coverImage.uri" style="width:70px;height:auto;"
                     :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl" alt="">
                <span v-else>{{ '' | padEmpty }}</span>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            prop="downloadIp"
            min-width="220px"
            label="服务器地址">
        </el-table-column>
        <el-table-column
            align="center"
            prop="downloadStatus"
            min-width="220px"
            label="状态">
            <template slot-scope="scope">
                <span v-if="scope.row.downloadStatus === 'SUCCESS'" class="status-normal">成功</span>
                <span v-if="scope.row.downloadStatus === 'FAILED'" class="status-abnormal">失败</span>
                <span v-if="scope.row.downloadStatus === 'ON_GOING'" class="status-on-going">下载中</span>
                <span v-if="scope.row.downloadStatus === 'FAILED'" class="retry-text-btn"
                      @click="downloadRetry(scope.row)">
                    重试
                </span>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            min-width="140px"
            label="创建时间">
            <template slot-scope="scope">
                <div>{{scope.row.createdAt | formatDate('yyyy-MM-DD')}}</div>
                <div>{{scope.row.createdAt | formatDate('HH:mm:SS')}}</div>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            min-width="140px"
            label="下载时间">
            <template slot-scope="scope">
                <div>{{scope.row.downloadTime | formatDate('yyyy-MM-DD')}}</div>
                <div>{{scope.row.downloadTime | formatDate('HH:mm:SS')}}</div>
            </template>
        </el-table-column>
        <el-table-column
            align="center"
            label="操作"
            width="110px">
            <template slot-scope="scope">
                <div class="operator-btn-wrapper">
                    <span class="btn-text text-danger" @click="removeDownloadProgramme(scope.row)">删除</span>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>

    export default {
        name: 'DownloadProgrammeOperateTable',
        props: {
            downloadProgrammeList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        filters: {
            getDownloadStatus(status) {
                return {'ON_GOING': '下载中', 'SUCCESS': '成功', 'FAILED': '失败'}[status];
            }
        },
        data() {
            return {
                multipleSelection: []
            };
        },
        methods: {
            // 重试选中，只有下载失败的节目可以重试
            batchRetry() {
                if (!this.multipleSelection || this.multipleSelection.length === 0) {
                    this.$message.warning('请先选择节目');
                    return;
                }
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (this.multipleSelection[i].downloadStatus !== 'FAILED') {
                        this.$message.warning('只有下载失败的节目可以重试');
                        return;
                    }
                }
                let idList = [];
                this.multipleSelection.map(item => {
                    idList.push(item.id);
                });
                this.$service.batchDownloadProgramme({idList}).then(response => {
                    if (response && response.code === 0) {
                        this.$message.success('节目批量下载重试成功!');
                        this.$emit('getDownloadProgrammeList');
                        this.multipleSelection = [];
                        this.$emit('setBatchDisabledStatus', true);
                    }
                });
            },
            // 重试
            downloadRetry(item) {
                this.$service.batchDownloadProgramme({idList: [item.id]}).then(response => {
                    if (response && response.code === 0) {
                        this.$message.success('节目批量下载重试成功!');
                        this.$emit('getDownloadProgrammeList');
                        this.multipleSelection = [];
                        this.$emit('setBatchDisabledStatus', true);
                    }
                });
            },
            // 删除选中,只有'成功'和'失败'的才可以删除
            batchRemove() {
                if (!this.multipleSelection || this.multipleSelection.length === 0) {
                    this.$message.warning('请先选择节目');
                    return;
                }
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (this.multipleSelection[i].downloadStatus === 'ON_GOING') {
                        this.$message.warning('只有下载成功和失败的才可以删除');
                        return;
                    }
                }
                this.$confirm('此操作将批量删除下载节目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let idList = [];
                    this.multipleSelection.map(item => {
                        idList.push(item.id);
                    });
                    this.$service.batchRemoveDownloadProgramme({idList}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('节目批量删除成功!');
                            this.$emit('getDownloadProgrammeList');
                            this.multipleSelection = [];
                            this.$emit('setBatchDisabledStatus', true);
                        }
                    });
                });
            },
            batchRemoveAll() {
                this.$confirm('此操作将删除所有下载节目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.removeAllDownloadProgramme().then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('全部节目删除成功!');
                            this.$emit('getDownloadProgrammeList');
                        }
                    });
                });
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
                if (this.multipleSelection.length === 0) {
                    this.$emit('setBatchDisabledStatus', true);
                } else {
                    this.$emit('setBatchDisabledStatus', false);
                }
            },
            // 只有'成功'和'失败'的才可以删除
            removeDownloadProgramme(item) {
                if (item.downloadStatus === 'ON_GOING') {
                    this.$message.warning('下载中的节目不能删除');
                    return;
                }
                this.$confirm('此操作将删除下载节目, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.batchRemoveDownloadProgramme({idList: [item.id]}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('节目删除成功!');
                            this.$emit('getDownloadProgrammeList');
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

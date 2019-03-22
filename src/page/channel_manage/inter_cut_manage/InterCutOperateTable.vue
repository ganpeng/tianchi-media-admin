<!--轮播插播列表项组件-->
<template>
    <div>
        <el-table
            :data="interCutList"
            header-row-class-name="common-table-header"
            row-class-name=channel-row
            @selection-change="handleSelectionChange"
            border
            style="width: 100%">
            <el-table-column
                type="selection"
                align="center"
                width="60">
            </el-table-column>
            <el-table-column
                prop="name"
                min-width="140px"
                align="center"
                label="名称">
                <template slot-scope="scope">
                <span @click="toInterCutDetail(scope.row)" class="ellipsis four name">
                    {{scope.row.name}}
                </span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="100px"
                prop="channelList"
                label="插播频道">
                <template slot-scope="scope">
                    {{scope.row.channelList.length}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="100px"
                prop="videoList"
                label="视频数量">
                <template slot-scope="scope">
                    {{scope.row.videoList.length}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="120px"
                prop="duration"
                label="视频总时长">
                <template slot-scope="scope">
                    {{scope.row.totalDuration | fromSecondsToTime}}
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="70px"
                prop="common"
                label="定时">
                <template slot-scope="scope">
                    <label>{{scope.row.scheduled ? '是' : '否'}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="100px"
                label="开始时间">
                <template slot-scope="scope">
                    <div>{{scope.row.startTime | formatDate('yyyy-MM-DD')}}</div>
                    <div>{{scope.row.startTime | formatDate('HH:mm:SS')}}</div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="100px"
                label="结束时间">
                <template slot-scope="scope">
                    <div>{{(scope.row.startTime + scope.row.totalDuration*1000) | formatDate('yyyy-MM-DD')}}</div>
                    <div>{{(scope.row.startTime + scope.row.totalDuration*1000) | formatDate('HH:mm:SS')}}</div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.playStatus === 'ACTIVE'"
                          class="status-normal">生效中</span>
                    <span v-if="scope.row.playStatus === 'WAITING'"
                          class="status-deleting">未生效</span>
                    <span v-if="scope.row.playStatus === 'EXPIRED'"
                          class="status-abnormal">已失效</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="110px"
                label="操作"
                class="operate">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <span class="btn-text" @click="editInterCutInfo(scope.row)"
                              :class="{disabled:scope.row.playStatus !== 'WAITING'}">
                              编辑
                        </span>
                        <span class="btn-text text-danger"
                              @click="removeInterCut(scope.row)"
                              :class="{disabled:scope.row.playStatus !== 'WAITING'}">
                              删除
                        </span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        name: 'InterCutOperateTable',
        props: {
            interCutList: {
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
            // 批量删除，只有未生效的才能删除
            batchRemove() {
                if (!this.multipleSelection || this.multipleSelection.length === 0) {
                    this.$message.warning('请先选择插播');
                    return;
                }
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (this.multipleSelection[i].playStatus !== 'WAITING') {
                        this.$message.warning('当前选中的插播中含有生效中或已失效的插播，暂时不能批量删除');
                        return;
                    }
                }
                this.$confirm('此操作将批量删除插播, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonTxt: '取消',
                    type: 'warning'
                }).then(() => {
                    let interCutIdList = [];
                    this.multipleSelection.map(interCut => {
                        interCutIdList.push(interCut.id);
                    });
                    this.$service.batchDeleteInterCut({idList: interCutIdList}).then(response => {
                        if (response && response.code === 0) {
                            this.$message.success('插播批量删除成功!');
                            this.$emit('getInterCutList');
                            this.multipleSelection = [];
                            this.$emit('setBatchDisabledStatus', true);
                        }
                    });
                });
            },
            // 删除
            removeInterCut(item) {
                if (item.playStatus !== 'WAITING') {
                    this.$message.warning('当前插播频道已生效或已过期，不能删除');
                    return;
                }
                this.$confirm('此操作将删除"' + item.name + '"插播, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.deleteInterCutById(item.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '成功删除' + item.name + '插播'
                            });
                            this.$emit('getInterCutList');
                            this.multipleSelection = [];
                        }
                    });
                });
            },
            // 勾选
            handleSelectionChange(val) {
                this.multipleSelection = val;
                if (this.multipleSelection.length === 0) {
                    this.$emit('setBatchDisabledStatus', true);
                } else {
                    this.$emit('setBatchDisabledStatus', false);
                }
            },
            toInterCutDetail(item) {
                this.$router.push({
                    name: 'InterCutDetail',
                    params: {id: item.id}
                });
            },
            editInterCutInfo(item) {
                if (item.playStatus !== 'WAITING') {
                    this.$message.warning('当前插播频道已生效或已过期，不能编辑');
                    return;
                }
                this.$router.push({
                    name: 'EditInterCut',
                    params: {id: item.id}
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

</style>

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
                prop="channelCount"
                label="插播频道">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="100px"
                prop="videoCount"
                label="视频数量">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="120px"
                prop="duration"
                label="视频总时长">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="70px"
                prop="common"
                label="定时">
                <template slot-scope="scope">
                    <label>{{scope.row.common ? '是' : '否'}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="100px"
                label="开始时间">
                <template slot-scope="scope">
                    <div>{{scope.row.createdAt | formatDate('yyyy-MM-DD')}}</div>
                    <div>{{scope.row.createdAt | formatDate('HH:mm:SS')}}</div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="100px"
                label="结束时间">
                <template slot-scope="scope">
                    <div>{{scope.row.createdAt | formatDate('yyyy-MM-DD')}}</div>
                    <div>{{scope.row.createdAt | formatDate('HH:mm:SS')}}</div>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.adStatus === 'ACTIVE' && scope.row.visible"
                          class="status-normal">生效中</span>
                    <span v-if="scope.row.adStatus === 'WAITING' && scope.row.visible"
                          class="status-deleting">未生效</span>
                    <span v-if="scope.row.adStatus === 'EXPIRED' && scope.row.visible"
                          class="status-abnormal">已失效</span>
                    <span v-if="!scope.row.visible">/</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="110px"
                label="操作"
                class="operate">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <span class="btn-text" @click="editChannelInfo(scope.row)">编辑</span>
                        <span class="btn-text text-danger" @click="removeChannel(scope.row)">删除</span>
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
            // 更改状态
            updateChannelStatus(channelInfo) {
                let operateWords = channelInfo.visible ? '禁播' : '恢复';
                this.$confirm('此操作将' + operateWords + channelInfo.innerName + '频道, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.setChannelVisible(channelInfo.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message({
                                type: 'success',
                                message: operateWords + channelInfo.innerName + '频道成功!'
                            });
                            channelInfo.visible = !channelInfo.visible;
                            //    频道在栏目推荐位上
                        } else if (response && response.code === 3610) {
                            let message = '';
                            response.data.map(item => {
                                message = message + '、' + item.navBarName;
                            });
                            message = channelInfo.innerName + '频道在"' + message.slice(1) + '"栏目推荐位上，不能被禁播';
                            this.$message(message);
                            // 频道在栏目频道布局推荐位上
                        } else if (response && response.code === 3611) {
                            let message = '';
                            response.data.map(item => {
                                message = message + '、' + item.navBarName;
                            });
                            message = channelInfo.innerName + '频道在"' + message.slice(1) + '"栏目频道布局推荐位上，不能被禁播';
                            this.$message(message);
                        }
                    });
                });
            },
            // 删除单个频道
            removeChannel(channelInfo) {
                if (channelInfo.visible) {
                    this.$message.warning('由于' + channelInfo.innerName + '频道为正常状态，暂时不能删除');
                    return;
                }
                this.$confirm('此操作将删除' + channelInfo.innerName + '频道, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.deleteChannelById(channelInfo.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '成功删除' + channelInfo.innerName + '频道!'
                            });
                            this.$emit('getinterCutList');
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
            editChannelInfo(item) {
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

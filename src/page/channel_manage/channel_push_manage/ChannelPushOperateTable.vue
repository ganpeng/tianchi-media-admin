<!--直播推流列表项组件-->
<template>
    <div>
        <el-table
            :data="channelPushList"
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
                prop="no"
                width="80px"
                align="center"
                label="台号">
                <template slot-scope="scope">
                    <span>{{scope.row.no}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                min-width="140px"
                align="center"
                label="名称">
                <template slot-scope="scope">
                <span @click="toChannelPushDetail(scope.row)" class="ellipsis four name">
                    {{scope.row.name}}
                </span>
                </template>
            </el-table-column>
            <el-table-column
                prop="innerName"
                min-width="140px"
                align="center"
                label="内部名称">
                <template slot-scope="scope">
                <span @click="toChannelPushDetail(scope.row)" class="ellipsis four name">
                    {{scope.row.innerName}}
                </span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="80px"
                prop="recordIp"
                label="推流IP">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="80px"
                prop="recordPort"
                label="推流端口">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="180px"
                prop="serverGroup"
                label="服务器组">
                <template slot-scope="scope">
                    <label>{{scope.row.serverGroup ? scope.row.serverGroup : '------'}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="100px"
                label="状态">
                <template slot-scope="scope">
                    <input
                        class="my-switch switch-anim"
                        type="checkbox"
                        v-model="scope.row.visible"
                        :checked="scope.row.visible"
                        @click.prevent="updateChannelPushStatus(scope.row)"/>
                    <i v-if="scope.row.visible" class="on-the-shelf">正常</i>
                    <i v-else class="off-the-shelf">禁播</i>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="110px"
                label="操作"
                class="operate">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <span class="btn-text" @click="editChannelPushInfo(scope.row)">编辑</span>
                        <span class="btn-text text-danger" @click="removeChannelPush(scope.row)">删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>

    export default {
        name: 'ChannelPushOperateTable',
        props: {
            channelPushList: {
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
            updateChannelPushStatus(channelInfo) {
                let operateWords = channelInfo.visible ? '禁播' : '恢复';
                this.$confirm('此操作将' + operateWords + channelInfo.innerName + '直播推流, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.setChannelPushVisible(channelInfo.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message({
                                type: 'success',
                                message: operateWords + channelInfo.innerName + '直播推流成功!'
                            });
                            channelInfo.visible = !channelInfo.visible;
                        }
                    });
                });
            },
            // 删除单个频道
            removeChannelPush(channelInfo) {
                if (channelInfo.visible) {
                    this.$message.warning('由于' + channelInfo.innerName + '直播推流为正常状态，暂时不能删除');
                    return;
                }
                this.$confirm('此操作将删除' + channelInfo.innerName + '直播推流, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.deleteChannelPushById(channelInfo.id).then(response => {
                        if (response && response.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '成功删除' + channelInfo.innerName + '直播推流!'
                            });
                            this.$emit('getChannelPushList');
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
            // 批量上下架
            batchUpdateStatus(visible) {
                if (!this.multipleSelection || this.multipleSelection.length === 0) {
                    this.$message.warning('请先选择直播推流');
                    return;
                }
                let idList = [];
                this.multipleSelection.map(channel => {
                    idList.push(channel.id);
                });
                this.$service.batchSetChannelPush({
                    idList: idList,
                    visible: visible
                }).then(response => {
                    if (response && response.code === 0) {
                        this.$message.success('批量' + (visible ? '恢复' : '禁播') + '成功');
                        // 刷新页面数据
                        this.$emit('getChannelPushList');
                        this.multipleSelection = [];
                    }
                });
            },
            toChannelPushDetail(item) {
                this.$router.push({
                    name: 'ChannelPushDetail',
                    params: {id: item.id}
                });
            },
            editChannelPushInfo(item) {
                this.$router.push({
                    name: 'EditChannelPush',
                    params: {id: item.id}
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    .protocol-type {
        &:nth-child(2) {
            margin-left: 6px;
        }
    }

    .display-btn {
        cursor: pointer;
    }

</style>

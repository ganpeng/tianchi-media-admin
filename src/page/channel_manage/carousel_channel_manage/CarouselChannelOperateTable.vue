<!--轮播频道列表项组件-->
<template>
    <div>
        <el-table
            :data="channelList"
            header-row-class-name="common-table-header"
            row-class-name=channel-row
            @row-dblclick="showChannelVideoMessage"
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
                width="60px"
                align="center"
                label="台号">
            </el-table-column>
            <el-table-column
                prop="name"
                min-width="140px"
                align="center"
                label="名称">
                <template slot-scope="scope">
                <span @click="toChannelDetail(scope.row)" class="ellipsis four name">
                    {{scope.row.name}}
                </span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="140px"
                label="类别">
                <template slot-scope="scope">
                    <label>{{scope.row.typeList | jsonJoin('name')}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="120px"
                prop="multicastIp"
                label="组播地址">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="80px"
                prop="multicastPort"
                label="端口号">
            </el-table-column>
            <el-table-column
                align="center"
                min-width="80px"
                prop="protocolList"
                label="推流方式">
                <template slot-scope="scope">
                    <label class="protocol-type" v-for="(item, index) in scope.row.protocolList"
                           :key="index">{{item}}</label>
                </template>
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
                min-width="70px"
                prop="common"
                label="公共频道">
                <template slot-scope="scope">
                    <label>{{scope.row.common ? '是' : '否'}}</label>
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
                        @click.prevent="updateChannelStatus(scope.row)"/>
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
                        <span class="btn-text" @click="previewChannel(scope.row)">轮播</span>
                        <span class="btn-text" @click="editChannelInfo(scope.row)">编辑</span>
                        <span class="btn-text text-danger" @click="removeChannel(scope.row)">删除</span>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <display-video-dialog
            :url="previewVideoInfo.url"
            :title="previewVideoInfo.title"
            ref="displayVideoDialog"
            :displayVideoDialogVisible="previewVideoInfo.visible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
    </div>
</template>

<script>
    import DisplayVideoDialog from 'sysComponents/custom_components/custom/DisplayVideoDialog';

    export default {
        name: 'CarouselChannelOperateTable',
        components: {
            DisplayVideoDialog
        },
        props: {
            channelList: {
                type: Array,
                default: function () {
                    return [];
                }
            }
        },
        data() {
            return {
                multipleSelection: [],
                previewVideoInfo: {
                    url: '',
                    title: '',
                    visible: false
                }
            };
        },
        methods: {
            previewChannel(channel) {
                if (!channel.hlsPlayUrl) {
                    this.$message.warning('当前轮播链接不存在');
                    return;
                }
                this.previewVideoInfo.url = channel.hlsPlayUrl;
                this.previewVideoInfo.title = channel.name;
                this.previewVideoInfo.visible = true;
                this.$refs.displayVideoDialog.showDialog();
            },
            // 关闭视频预览
            closeDisplayVideoDialog(status) {
                this.previewVideoInfo.visible = status;
            },
            showChannelVideoMessage(row) {
                this.$service.getChannelDetail(row.id).then(response => {
                    if (response && response.code === 0) {
                        this.channelInfo = response.data;
                        this.$message({
                            message: row.innerName + '频道含有视频' + this.channelInfo.carouselVideoList.length + '个',
                            type: 'success'
                        });
                    }
                });
            },
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
                            this.$emit('getChannelList');
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
                    this.$message.warning('请先选择频道');
                    return;
                }
                let idList = [];
                this.multipleSelection.map(channel => {
                    idList.push(channel.id);
                });
                this.$service.batchSetChannel({
                    idList: idList,
                    visible: visible
                }).then(response => {
                    if (response && response.code === 0) {
                        this.$message.success('批量' + (visible ? '恢复' : '禁播') + '成功');
                        // 刷新页面数据
                        this.$emit('getChannelList');
                        this.multipleSelection = [];
                        // 下架失败，设置提醒信息
                    } else if (response && response.code === 3604) {
                        let message = '';
                        response.data.map(channel => {
                            message = message + '"' + channel.innerName + '"' + channel.reason + ';    ';
                        });
                        this.$message.warning(message + '暂时不能批量' + (visible ? '恢复' : '禁播'));
                    }
                });
            },
            toChannelDetail(item) {
                this.$router.push({
                    name: 'CarouselChannelDetail',
                    params: {id: item.id}
                });
            },
            editChannelInfo(item) {
                this.$router.push({
                    name: 'EditCarouselChannel',
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

</style>

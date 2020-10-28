<!--轮播频道列表项组件-->
<template>
    <div>
        <el-table
            :data="channelList"
            header-row-class-name="common-table-header"
            row-class-name=channel-row
            @row-dblclick="showChannelVideoMessage"
            @selection-change="handleSelectionChange"
            @sort-change="sortChangeHandler"
            border
            style="width: 100%">
            <el-table-column
                type="selection"
                align="center"
                width="60">
            </el-table-column>
            <el-table-column
                sortable
                prop="no"
                width="90px"
                align="center"
                label="台号">
                <template slot-scope="scope">
                    <span>{{scope.row.no}}</span>
                    <span @click="previewChannel(scope.row)"
                          v-if="scope.row.visible && scope.row.applyStatus !== 'WAITING'"
                          class="display-btn">
                        <svg-icon icon-class="channel_video_play"></svg-icon>
                    </span>
                    <span v-else class="display-btn disabled">
                        <svg-icon icon-class="channel_video_play"></svg-icon>
                    </span>
                </template>
            </el-table-column>
            <el-table-column
                sortable
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
                width="60px"
                prop="relatedCount"
                align="center"
                label="关联">
                <template slot-scope="scope">
                    <span @click="openRelateDialog(scope.row)" class="name">{{scope.row.refCount ? scope.row.refCount : '无'}}</span>
                </template>
            </el-table-column>
            <el-table-column
                width="60px"
                prop="paymentType"
                align="center"
                label="会员">
                <template slot-scope="scope">
                    <span v-if="scope.row.paymentType === 'VIP'">是</span>
                    <span v-else>否</span>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                min-width="120px"
                prop="multicastIp"
                label="轮播地址">
                <template slot-scope="scope">
                    <span>{{scope.row.multicastIp}}:{{scope.row.multicastPort}}</span>
                </template>
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
            <el-table-column align="center" min-width="120px" label="适用客户端">
                <template slot-scope="scope">
                    {{scope.row.applicableClientList ? scope.row.applicableClientList.join(', ') : ''}}
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
                v-if="false"
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
                label="定时">
                <template slot-scope="scope">
                    <span v-if="scope.row.applyStatus === 'ACTIVE'"
                          class="status-normal">生效中</span>
                    <span v-if="scope.row.applyStatus === 'WAITING'"
                          class="status-deleting">未生效</span>
                    <span v-if="scope.row.applyStatus === 'EXPIRED'"
                          class="status-abnormal">已失效</span>
                    <span v-if="!scope.row.applyStatus">无</span>
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
        <display-related-dialog
            ref="displayRelatedDialog"
            :currentItemInfo="currentChannel"
            type="CAROUSEL">
        </display-related-dialog>
    </div>
</template>

<script>
    import _ from 'lodash';
    import DisplayVideoDialog from 'sysComponents/custom_components/custom/DisplayVideoDialog';
    import DisplayRelatedDialog from 'sysComponents/custom_components/custom/DisplayRelatedDialog';

    export default {
        name: 'CarouselChannelOperateTable',
        components: {
            DisplayVideoDialog,
            DisplayRelatedDialog
        },
        props: {
            channelList: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            setChannelList: {
                type: Function,
                default: () => {}
            }
        },
        data() {
            return {
                currentChannel: {},
                multipleSelection: [],
                previewVideoInfo: {
                    url: '',
                    title: '',
                    visible: false
                }
            };
        },
        methods: {
            // 打开关联对话框
            openRelateDialog(item) {
                this.currentChannel = item;
                this.$refs.displayRelatedDialog.showDialog();
            },
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
                if (!this.$authority.isHasAuthority('content:channel:visible')) {
                    return;
                }
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
                if (!this.$authority.isHasAuthority('content:channel:delete')) {
                    return;
                }
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
                if (!this.$authority.isHasAuthority('content:channel:batchVisible')) {
                    return;
                }
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
                if (!this.$authority.isHasAuthority('content:channel:get')) {
                    return;
                }
                this.$router.push({
                    name: 'CarouselChannelDetail',
                    params: {id: item.id}
                });
            },
            editChannelInfo(item) {
                if (!this.$authority.isHasAuthority('content:channel:put')) {
                    return;
                }
                this.$router.push({
                    name: 'EditCarouselChannel',
                    params: {id: item.id}
                });
            },
            // dev2.9
            sortChangeHandler(obj) {
                let {prop, order} = obj;
                if (prop === 'no') {
                    let sortedList = [];
                    if (order === 'ascending') {
                        sortedList = _.chain(this.channelList).sortBy('no').value();
                    } else {
                        sortedList = _.chain(this.channelList).sortBy('no').reverse().value();
                    }
                    this.setChannelList(sortedList);
                }
                if (prop === 'name') {
                    let sortedList = [];
                    if (order === 'ascending') {
                        sortedList = _.chain(this.channelList).sortBy('name').value();
                    } else {
                        sortedList = _.chain(this.channelList).sortBy('name').reverse().value();
                    }
                    this.setChannelList(sortedList);
                }
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

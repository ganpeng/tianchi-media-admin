<!-- 新增直播频道的弹窗组件 -->
<template>
    <el-dialog
        :title="title"
        :visible.sync="liveChannelDialogVisible"
        :show-close="true"
        :before-close="cancelHandler"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form :model="liveChannel" :rules="inputRules" ref="liveChannelForm" @submit.native.prevent
                 class="form-block" label-width="150px">
            <el-form-item
                v-if="status !== 0"
                label="直播频道编号">
                <el-input :value="liveChannel.code" disabled></el-input>
            </el-form-item>
            <el-form-item
                label="直播频道名称"
                prop="innerName">
                <el-input
                    :disabled="readonly"
                    :value="liveChannel.innerName"
                    :maxlength="20"
                    placeholder="请输入直播频道名称"
                    @input="inputHandler($event, 'innerName')">
                </el-input>
            </el-form-item>
            <el-form-item label="直播频道展示名" prop="name">
                <el-input
                    :value="liveChannel.name"
                    :maxlength="20"
                    placeholder="请输入直播频道展示名"
                    @input="inputHandler($event, 'name')"
                    :disabled="readonly">
                </el-input>
            </el-form-item>
            <el-form-item
                label="直播频道展示编号" prop="no">
                <el-input
                    type="number"
                    :value="liveChannel.no"
                    placeholder="请输入直播频道展示编号"
                    :disabled="readonly"
                    @input="inputHandler($event, 'no')">
                </el-input>
            </el-form-item>
            <el-form-item label="组播地址" prop="multicastIp">
                <el-input
                    :disabled="readonly"
                    placeholder="请输入频道IP"
                    :value="liveChannel.multicastIp"
                    @input="inputHandler($event, 'multicastIp')">
                </el-input>
            </el-form-item>
            <el-form-item label="组播端口" prop="multicastPort">
                <el-input
                    :disabled="readonly"
                    type="number"
                    placeholder="请输入频道端口"
                    :value="liveChannel.multicastPort"
                    @input="inputHandler($event, 'multicastPort')">
                </el-input>
            </el-form-item>
            <el-form-item label="所属服务器" prop="pushServer">
                <el-input
                    :disabled="readonly"
                    placeholder="请输入所属服务器地址"
                    :value="liveChannel.pushServer"
                    @input="inputHandler($event, 'pushServer')">
                </el-input>
            </el-form-item>
            <el-form-item label="videoPid" prop="videoPid">
                <el-input
                    :disabled="readonly"
                    placeholder="请输入videoPid"
                    :value="liveChannel.videoPid"
                    @input="inputHandler($event, 'videoPid')">
                </el-input>
            </el-form-item>
            <el-form-item label="audioPid" prop="audioPid">
                <el-input
                    :disabled="readonly"
                    placeholder="请输入audioPid"
                    :value="liveChannel.audioPid"
                    @input="inputHandler($event, 'audioPid')">
                </el-input>
            </el-form-item>
            <el-form-item label="频道类别" prop="typeList">
                <el-select
                    :disabled="readonly"
                    :value="typeIdList"
                    multiple
                    placeholder="请选择频道类型"
                    @input="inputHandler($event, 'typeList')">
                    <el-option
                        v-for="(item, index) in liveChannelTypeList"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否录制回看" prop="record">
                <el-radio :disabled="readonly" @input="inputHandler(true, 'record')" :value="liveChannel.record"
                          :label="true">是
                </el-radio>
                <el-radio :disabled="readonly" @input="inputHandler(false, 'record')" :value="liveChannel.record"
                          :label="false">否
                </el-radio>
            </el-form-item>
            <!--非必填-->
            <el-form-item label="录制IP" prop="recordIp">
                <el-input
                    :disabled="readonly || !liveChannel.record"
                    placeholder="请输入录制IP"
                    :value="liveChannel.recordIp"
                    @input="inputHandler($event, 'recordIp')">
                </el-input>
            </el-form-item>
            <!--非必填-->
            <el-form-item label="录制端口" prop="recordPort">
                <el-input
                    :disabled="readonly || !liveChannel.record"
                    type="number"
                    placeholder="请输入录制端口"
                    :value="liveChannel.recordPort"
                    @input="inputHandler($event, 'recordPort')">
                </el-input>
            </el-form-item>
            <el-form-item label="视频封面图" prop="logoUri">
                <div class="text-left clearfix">
                    <el-button
                        class="float-left page-main-btn create-blue-btn contain-svg-icon"
                        v-if="!readonly"
                        @click="uploadImageHandler">
                        <svg-icon
                            icon-class="image"
                            class-name="svg-box">
                        </svg-icon>
                        上传图片
                    </el-button>
                </div>
                <ul
                    v-if="liveChannel.logoUri"
                    class="cover-list">
                    <li>
                        <div class="image-box"
                             :style="{'cursor': 'default', 'background-image': 'url(' + appendImagePrefix(liveChannel.logoUri) + ')'}">
                        </div>
                    </li>
                </ul>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelHandler">取 消</el-button>
            <el-button
                v-if="status !== 2"
                type="primary"
                @click="successHandler"
                v-loading.fullscreen.lock="isLoading">确 定
            </el-button>
        </div>
        <upload-image
            title="上传频道图片"
            :size="size"
            :withName="false"
            :successHandler="setChannelLogo"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-image>
    </el-dialog>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import UploadImage from 'sysComponents/custom_components/custom/UploadImage';
    import dimension from '@/util/config/dimension';
    import {checkIP, checkPort, checkChannelNo, checkIp} from '@/util/formValidate';

    export default {
        props: {
            liveChannelDialogVisible: {
                type: Boolean,
                default: false
            },
            status: {
                type: Number,
                default: 0
            }
        },
        components: {UploadImage},
        data() {
            let checkRecordPort = (rule, value, callback) => {
                if (this.liveChannel.record && !((this.liveChannel.recordIp && this.liveChannel.recordPort) || (!this.liveChannel.recordIp && !this.liveChannel.recordPort))) {
                    return callback(new Error('当前回看录制为是，请统一填写回看Ip和回看端口'));
                } else if (!this.$util.isEmpty(value) && !this.$util.isPort(value)) {
                    return callback(new Error('请填写正确的端口号'));
                } else {
                    callback();
                }
            };
            return {
                isLoading: false,
                imageUploadDialogVisible: false,
                radio2: 3,
                size: dimension.CHANNEL_LOGO_DIMENSION,
                inputRules: {
                    name: [
                        {required: true, message: '请输直播频道名称'}
                    ],
                    no: [
                        {required: true, message: '请输入直播频道展示编号'},
                        {validator: checkChannelNo}
                    ],
                    innerName: [
                        {required: true, message: '请输入直播频道展示名称'}
                    ],
                    multicastIp: [
                        {required: true, message: '请选择直播频道IP'},
                        {validator: checkIP}
                    ],
                    multicastPort: [
                        {required: true, message: '请输入直播频道端口'},
                        {validator: checkPort}
                    ],
                    pushServer: [
                        {required: true, message: '请输入所属服务器地址'},
                        {validator: checkIp}
                    ],
                    record: [
                        {required: true, message: '请选择是否录制直播回看'}
                    ],
                    recordIp: [
                        {validator: checkIP}
                    ],
                    recordPort: [
                        {validator: checkRecordPort}
                    ],
                    typeList: [
                        {required: true, message: '请选择直播频道类别'}
                    ],
                    logoUri: [
                        {required: true, message: '请上传直播频道logo'}
                    ]
                }
            };
        },
        computed: {
            ...mapGetters({
                liveChannel: 'channel/liveChannel',
                typeIdList: 'channel/typeIdList',
                liveChannelTypeList: 'channel/liveChannelTypeList'
            }),
            title() {
                switch (parseInt(this.status)) {
                    case 0:
                        return '新增直播频道';
                    case 1:
                        return '编辑直播频道';
                    case 2:
                        return '显示直播频道';
                    default:
                        return '新增直播频道';
                }
            },
            readonly() {
                return this.status === 2;
            }
        },
        methods: {
            ...mapMutations({
                updateLiveChannel: 'channel/updateLiveChannel',
                resetLiveChannel: 'channel/resetLiveChannel'
            }),
            ...mapActions({
                createChannels: 'channel/createChannels',
                getChannelList: 'channel/getChannelList',
                updateChannelById: 'channel/updateChannelById'
            }),
            cancelHandler() {
                this.resetLiveChannel();
                this.$emit('changeLiveChannelDialogStatus');
                this.$refs.liveChannelForm.resetFields();
            },
            successHandler() {
                this.$refs.liveChannelForm.validate(value => {
                    if (value) {
                        if (this.status === 0) {
                            this.createChannels().then((res) => {
                                if (res && res.code === 0) {
                                    this.cancelHandler();
                                    this.getChannelList();
                                    this.$message({
                                        type: 'success',
                                        message: '频道创建成功'
                                    });
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: `频道创建失败, ${res.message}`
                                    });
                                }
                            });
                        } else {
                            this.updateChannelById().then((res) => {
                                if (res && res.code === 0) {
                                    this.cancelHandler();
                                    this.getChannelList();
                                    this.$message({
                                        type: 'success',
                                        message: '频道更新成功'
                                    });
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: `频道更新失败, ${res.message}`
                                    });
                                }
                            });
                        }
                    }
                });
            },
            inputHandler(value, key) {
                this.updateLiveChannel({key, value});
            },
            uploadImageHandler() {
                if (!this.readonly) {
                    this.imageUploadDialogVisible = true;
                }
            },
            closeImageDialog() {
                this.imageUploadDialogVisible = false;
            },
            setChannelLogo(data) {
                let uri = data.posterImage.uri;
                this.updateLiveChannel({key: 'logoUri', value: uri});
            },
            appendImagePrefix(uri) {
                let baseUri = window.localStorage.getItem('imageBaseUri');
                return baseUri + uri;
            }
        }
    };
</script>
<style lang="less" scoped>
</style>

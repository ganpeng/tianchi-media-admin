<!-- 新增直播频道的弹窗组件 -->
<template>
    <el-dialog
        :title="title"
        :visible.sync="liveChannelDialogVisible"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <el-form :model="liveChannel" ref="liveChannelForm" class="form-block" label-width="150px">
            <el-form-item label="直播频道编号">
                <el-input :value="liveChannel.code" disabled></el-input>
            </el-form-item>
            <el-form-item label="直播频道名称">
                <el-input
                    :value="liveChannel.name"
                    placeholder="请输入直播频道名称"
                    @input="inputHandler($event, 'name')"
                    :disabled="readonly"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="直播频道展示编号">
                <el-input
                    type="number"
                    :disabled="readonly"
                    :value="liveChannel.no"
                    @input="inputHandler($event, 'no')"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="直播频道展示名"
                prop="innerName">
                <el-input
                    :disabled="readonly"
                    :value="liveChannel.innerName"
                    :maxlength="30"
                    placeholder="请输入直播频道展示名"
                    @input="inputHandler($event, 'innerName')"
                ></el-input>
            </el-form-item>
            <el-form-item label="频道IP" prop="multicastIp">
                <el-input
                    :disabled="readonly"
                    placeholder="请输频道IP"
                    :value="liveChannel.multicastIp"
                    @input="inputHandler($event, 'multicastIp')"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="频道端口" prop="multicastPort">
                <el-input
                    :disabled="readonly"
                    type="number"
                    placeholder="请输频道IP"
                    :value="liveChannel.multicastPort"
                    @input="inputHandler($event, 'multicastPort')"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="频道类别" prop="typeList">
                <el-select
                    :disabled="readonly"
                    :value="typeIdList"
                    multiple
                    placeholder="请选择频道类型"
                    @input="inputHandler($event, 'typeList')"
                >
                    <el-option
                        v-for="(item, index) in liveChannelTypeList"
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="视频封面图">
                <el-button v-if="!readonly" type="primary" @click="uploadImageHandler">上传封面图<i class="el-icon-upload el-icon--right"></i></el-button>
                <ul
                    v-if="liveChannel.logoUri"
                    class="cover-list">
                    <li>
                        <div
                            class="image-box"
                            :style="{'background-image': 'url(' + appendImagePrefix(liveChannel.logoUri) + ')'}">
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
                v-loading.fullscreen.lock="isLoading">确 定</el-button>
        </div>
        <upload-image
            title="上传节目图片"
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
    import UploadImage from 'sysComponents/custom_components/global/UploadImage';
    import dimension from '@/util/config/dimension';

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
        components: { UploadImage },
        data() {
            return {
                isLoading: false,
                imageUploadDialogVisible: false,
                size: dimension.CHANNEL_LOGO_DIMENSION
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
                        return '创建视频';
                    case 1:
                        return '编辑视频';
                    case 2:
                        return '显示视频';
                    default:
                        return '创建视频';
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
            },
            successHandler() {
                this.$refs.liveChannelForm.validate(value => {
                    if (value) {
                        if (this.status === 0) {
                            this.createChannels()
                                .then(() => {
                                    this.cancelHandler();
                                    this.getChannelList();
                                    this.$message({
                                        type: 'success',
                                        message: '频道创建成功'
                                    });
                                });
                        } else {
                            this.updateChannelById()
                                .then(() => {
                                    this.cancelHandler();
                                    this.getChannelList();
                                    this.$message({
                                        type: 'success',
                                        message: '频道更新成功'
                                    });
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

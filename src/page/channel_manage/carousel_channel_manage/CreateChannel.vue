<!--新建轮播频道的组件-->
<template>
    <div>
        <el-form
            :model="channelInfo"
            :rules="infoRules"
            status-icon
            ref="channelInfo"
            class="text-left"
            label-width="100px">
            <el-form-item label="频道名称" prop="innerName" required>
                <el-input v-model="channelInfo.innerName" placeholder="请填写20个字以内的名称"></el-input>
            </el-form-item>
            <el-form-item label="频道编号" prop="no" required>
                <el-input v-model="channelInfo.no" type="number" placeholder="请填写频道编号数字，例如'001'"></el-input>
            </el-form-item>
            <el-form-item label="频道类别" prop="typeIdList" required>
                <el-select v-model="channelInfo.typeIdList" multiple placeholder="请选择节目专题类别">
                    <el-option
                        v-for="item in typeOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="组播地址" prop="multicastIp" required>
                <el-input v-model="channelInfo.multicastIp" placeholder="请填写组播地址"></el-input>
            </el-form-item>
            <el-form-item label="端口号" prop="multicastPort" required>
                <el-input v-model="channelInfo.multicastPort" type="number" placeholder="请填写端口号"></el-input>
            </el-form-item>
            <el-form-item label="tsId" prop="tsId">
                <el-input v-model="channelInfo.tsId" type="number" placeholder="请填写tsId"></el-input>
            </el-form-item>
            <el-form-item label="serviceId" prop="serviceId">
                <el-input v-model="channelInfo.serviceId" type="number" placeholder="请填写serviceId"></el-input>
            </el-form-item>
            <el-form-item label="所属服务器" prop="pushServer" required>
                <el-input v-model="channelInfo.pushServer" placeholder="请填写所属服务器的IP地址"></el-input>
            </el-form-item>
            <el-form-item label="频道状态" required>
                <label>禁播</label>
            </el-form-item>
            <el-form-item label="频道封面" prop="logoUri" required>
                <el-button
                    class="create-blue-btn contain-svg-icon"
                    @click="imageUploadDialogVisible = true">
                    <svg-icon icon-class="image"></svg-icon>
                    上传图片
                </el-button>
                <div v-if="channelInfo.logoUri" class="image-box">
                    <img :src="channelInfo.logoUri | imageUrl">
                </div>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer text-right">
            <el-button @click="closeDialog">取 消</el-button>
            <el-button type="primary" @click="createChannel">确 定</el-button>
        </div>
        <upload-image
            :size='size'
            title="上传频道封面图片"
            :successHandler="setChannelLogo"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-image>
    </div>
</template>

<script>
    import UploadImage from 'sysComponents/custom_components/custom/UploadImage';
    import {CHANNEL_LOGO_DIMENSION} from '@/util/config/dimension';

    export default {
        name: 'CreateChannel',
        components: {
            UploadImage
        },
        data() {
            let checkInnerName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('频道名称不能为空'));
                } else if (this.$util.trim(value).length > 20) {
                    return callback(new Error('频道名称不能超过20字'));
                } else {
                    callback();
                }
            };
            let checkNo = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('频道编号不能为空'));
                } else if (!this.$util.isChannelNo(value)) {
                    return callback(new Error('请填写频道编号数字，例如"001"'));
                } else {
                    callback();
                }
            };
            let checkTypeIdList = (rule, value, callback) => {
                if (this.channelInfo.typeIdList.length === 0) {
                    return callback(new Error('请选择频道类别'));
                } else {
                    callback();
                }
            };
            let checkMulticastIp = (rule, value, callback) => {
                this.channelInfo.multicastIp = this.$util.trim(this.channelInfo.multicastIp);
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('组播地址不能为空'));
                } else if (!this.$util.isMulticastIPAddress(value)) {
                    return callback(new Error('请填写正确的组播地址'));
                } else {
                    callback();
                }
            };
            let checkMulticastPort = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('端口号不能为空'));
                } else if (!this.$util.isPort(value)) {
                    return callback(new Error('请填写正确的端口号'));
                } else {
                    callback();
                }
            };
            let checkServiceId = (rule, value, callback) => {
                if (!this.$util.isEmpty(value) && !this.$util.isChannelServiceId(value)) {
                    return callback(new Error('请填写正确的serviceId'));
                } else {
                    callback();
                }
            };
            let checkPushServer = (rule, value, callback) => {
                this.channelInfo.pushServer = this.$util.trim(this.channelInfo.pushServer);
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请填写所属服务器IP地址'));
                } else {
                    callback();
                }
            };
            let checkTsId = (rule, value, callback) => {
                if (!this.$util.isEmpty(value) && !this.$util.isChannelTsId(value)) {
                    return callback(new Error('请填写正确的tsId'));
                } else {
                    callback();
                }
            };
            let checkLogoUri = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('请设置频道的封面图片'));
                } else {
                    callback();
                }
            };
            return {
                size: CHANNEL_LOGO_DIMENSION,
                imageUploadDialogVisible: false,
                channelInfo: {
                    category: 'CAROUSEL',
                    innerName: '',
                    no: '',
                    typeList: [],
                    typeIdList: [],
                    multicastIp: '',
                    tsId: '',
                    serviceId: '',
                    pushServer: '',
                    visible: false,
                    record: false,
                    logoUri: ''
                },
                typeOptions: [],
                infoRules: {
                    innerName: [
                        {validator: checkInnerName, trigger: 'blur'}
                    ],
                    no: [
                        {validator: checkNo, trigger: 'blur'}
                    ],
                    typeIdList: [
                        {validator: checkTypeIdList, trigger: 'change'}
                    ],
                    multicastIp: [
                        {validator: checkMulticastIp, trigger: 'blur'}
                    ],
                    multicastPort: [
                        {validator: checkMulticastPort, trigger: 'blur'}
                    ],
                    tsId: [
                        {validator: checkTsId, trigger: 'blur'}
                    ],
                    serviceId: [
                        {validator: checkServiceId, trigger: 'blur'}
                    ],
                    pushServer: [
                        {validator: checkPushServer, trigger: 'blur'}
                    ],
                    logoUri: [
                        {validator: checkLogoUri, trigger: 'blur'}
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getChannelType(this.channelInfo).then(response => {
                    if (response && response.code === 0) {
                        this.typeOptions = response.data;
                    }
                });
            },
            // 设置频道封面的uri
            setChannelLogo(newPosterImage) {
                this.channelInfo.logoUri = newPosterImage.posterImage.uri;
            },
            // 关闭上传图片对话框
            closeImageDialog(status) {
                this.imageUploadDialogVisible = status;
            },
            closeDialog() {
                this.$emit('closeDialog');
            },
            // 创建频道
            createChannel() {
                this.$refs['channelInfo'].validate((valid) => {
                    if (valid) {
                        this.channelInfo.typeList = [];
                        this.channelInfo.typeIdList.map(id => {
                            this.typeOptions.map(type => {
                                if (id === type.id) {
                                    this.channelInfo.typeList.push(type);
                                }
                            });
                        });
                        this.$service.createChannels(this.channelInfo).then(response => {
                            if (response && response.code === 0) {
                                this.$message('成功创建频道');
                                this.$emit('closeDialog');
                            } else {
                                this.$message({
                                    message: response.message,
                                    type: 'warning'
                                });
                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    .image-box {
        margin-top: 20px;
    }

    .el-select {
        width: 100%;
    }

    .dialog-footer {
        margin-top: 50px;
    }

</style>

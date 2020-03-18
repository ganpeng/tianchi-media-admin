<!--直播推流频道编辑页面-->
<template>
    <div>
        <div class="seperator-line"></div>
        <el-form
            ref="channelPushInfo"
            :model="channelPushInfo"
            :rules="infoRules"
            status-icon
            label-width="110px"
            class="form-block">
            <el-form-item label="频道名称" prop="name" required>
                <el-input
                    v-model="channelPushInfo.name"
                    size="medium"
                    placeholder="请填写20个字以内的频道名称">
                </el-input>
            </el-form-item>
            <el-form-item label="内部名称" prop="innerName" required>
                <el-input
                    v-model="channelPushInfo.innerName"
                    size="medium"
                    placeholder="请填写20个字以内的内部名称">
                </el-input>
            </el-form-item>
            <el-form-item label="频道编号" prop="no" required>
                <el-input
                    v-model="channelPushInfo.no"
                    type="number"
                    size="medium"
                    placeholder="请填写频道编号数字，例如'001'">
                </el-input>
            </el-form-item>
            <el-form-item label="推流IP" prop="recordIp" required>
                <el-input
                    placeholder="请输入推流IP"
                    size="medium"
                    v-model="channelPushInfo.recordIp">
                </el-input>
            </el-form-item>
            <el-form-item label="推流端口" prop="recordPort" required>
                <el-input
                    type="number"
                    placeholder="请输入推流端口"
                    size="medium"
                    v-model="channelPushInfo.recordPort">
                </el-input>
            </el-form-item>
            <!--  新加选项  -->
            <el-form-item label="服务器组" prop="serverGroup">
                <el-input
                    v-model="channelPushInfo.serverGroup"
                    size="medium"
                    placeholder="请填写所属服务器组">
                </el-input>
            </el-form-item>
            <el-form-item label="推流地址" prop="pushAddress">
                <el-input
                    v-model="channelPushInfo.pushAddress"
                    size="medium"
                    placeholder="请填写推流地址">
                </el-input>
            </el-form-item>
            <el-form-item label="状态" prop="visible" required v-if="status === 'CREATE_CHANNEL_PUSH'"
                          class="channel-status">
                <label>禁播</label>
            </el-form-item>
            <el-form-item label="状态" prop="visible" required v-if="status === 'EDIT_CHANNEL_PUSH'"
                          class="channel-status">
                <el-radio-group v-model="channelPushInfo.visible">
                    <el-radio :label="true">正常</el-radio>
                    <el-radio :label="false">禁播</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="saveChannelInfo" :loading="isLoading">保存</el-button>
            <el-button class="btn-style-three" @click="toChannelPushList" plain>返回列表</el-button>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'EditChannelPush',
        props: {
            // 创建：'CREATE_CHANNEL_PUSH'，编辑：'EDIT_CHANNEL_PUSH'
            status: {
                type: String,
                default: function () {
                    return 'CREATE_CHANNEL_PUSH';
                }
            }
        },
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('频道名称不能为空'));
                } else if (this.$util.trim(value).length > 20) {
                    return callback(new Error('频道名称不能超过20个字'));
                } else {
                    callback();
                }
            };
            let checkInnerName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('内部名称不能为空'));
                } else if (this.$util.trim(value).length > 20) {
                    return callback(new Error('内部名称不能超过20个字'));
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
            let checkIP = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('推流IP不能为空'));
                } else if (!this.$util.isIPAddress(value)) {
                    return callback(new Error('请填写正确的推流IP'));
                } else {
                    callback();
                }
            };
            let checkPort = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('推流端口不能为空'));
                } else if (!this.$util.isPort(value)) {
                    return callback(new Error('请填写正确的推流端口'));
                } else {
                    callback();
                }
            };
            return {
                isLoading: false,
                channelPushInfo: {
                    category: 'LIVE',
                    recordIp: '',
                    recordPort: '',
                    serverGroup: '', // 新加字段
                    pushAddress: '',
                    visible: false
                },
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    innerName: [
                        {validator: checkInnerName, trigger: 'blur'}
                    ],
                    no: [
                        {validator: checkNo, trigger: 'blur'}
                    ],
                    recordIp: [
                        {validator: checkIP, trigger: 'blur'}
                    ],
                    recordPort: [
                        {validator: checkPort, trigger: 'blur'}
                    ],
                    serverGroup: [ // 新加校验
                        {required: true, message: '请输入所属服务器组'}
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$util.toggleFixedBtnContainer();
                if (this.status === 'EDIT_CHANNEL_PUSH') {
                    this.getChannelPushDetail();
                }
            },
            getChannelPushDetail() {
                this.$service.getChannelPushDetail(this.$route.params.id).then(response => {
                        if (response && response.code === 0) {
                            this.channelPushInfo = response.data;
                        }
                    }
                );
            },
            // 保存频道信息
            saveChannelInfo() {
                this.$refs['channelPushInfo'].validate((valid) => {
                    if (valid) {
                        this.isLoading = true;
                        switch (this.status) {
                            case 'CREATE_CHANNEL_PUSH':
                                this.$service.createChannelPush(this.channelPushInfo).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('成功创建直播推流');
                                        this.toChannelPushList();
                                    } else {
                                        this.isLoading = false;
                                    }
                                });
                                break;
                            case 'EDIT_CHANNEL_PUSH':
                                this.$service.updateChannelPushById(
                                    this.$route.params.id,
                                    this.channelPushInfo
                                ).then(response => {
                                    if (response && response.code === 0) {
                                        this.$message.success('保存直播推流信息成功');
                                        this.toChannelPushList();
                                    } else {
                                        this.isLoading = false;
                                    }
                                });
                                break;
                            default:
                                break;
                        }
                    } else {
                        return false;
                    }
                });
            },
            toChannelPushList() {
                this.$router.push({name: 'ChannelPushList'});
            }
        }
    }
    ;
</script>

<style lang="scss" scoped>

    .el-form {
        width: 1240px;
    }

    .el-input, .el-select {
        width: 600px;
    }

    .el-checkbox-group {
        .el-checkbox {
            padding: 0;
        }
    }

</style>

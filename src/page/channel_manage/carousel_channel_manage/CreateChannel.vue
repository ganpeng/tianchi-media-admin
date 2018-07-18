<!--新建频道的弹出框组件-->
<template>
    <div>
        <el-form :model="channelInfo" :rules="infoRules" status-icon ref="channelInfo"
                 label-width="140px"
                 class="form-block">
            <el-form-item label="频道名称" prop="innerName" required>
                <el-input v-model="channelInfo.innerName" placeholder="请填写10个字以内的名称"></el-input>
            </el-form-item>
            <el-form-item label="频道编号" prop="no" required>
                <el-input v-model="channelInfo.no" placeholder="请填写三位频道编号数字，例如'001'"></el-input>
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
                <el-input v-model="channelInfo.multicastPort" placeholder="请填写端口号"></el-input>
            </el-form-item>
            <el-form-item label="频道状态" required>
                <label>禁播</label>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
               <el-button @click="closeDialog">取 消</el-button>
               <el-button type="primary" @click="createChannel">确 定</el-button>
        </span>
    </div>
</template>

<script>
    export default {
        name: 'CreateChannel',
        data() {
            let checkInnerName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('频道名称不能为空'));
                } else if (this.$util.trim(value).length > 10) {
                    return callback(new Error('频道名称不能超过10字'));
                } else {
                    callback();
                }
            };
            let checkNo = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('频道编号不能为空'));
                } else if (!this.$util.isChannelNo(value)) {
                    return callback(new Error('请填写三位频道编号数字，例如"001"'));
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
            return {
                channelInfo: {
                    category: 'CAROUSEL',
                    innerName: '',
                    no: '',
                    typeList: [],
                    typeIdList: [],
                    visible: false
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

<style lang="less" scoped>

    .block-box {
        margin-top: 50px;
    }

    .el-input, .el-select {
        width: 600px;
    }

</style>

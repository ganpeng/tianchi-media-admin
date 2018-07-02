<!--新建频道的弹出框组件-->
<template>
    <el-dialog
        title="提示"
        width="50%">
        <el-form :model="channelInfo" :rules="infoRules" status-icon ref="channelInfo"
                 label-width="140px"
                 class="form-block">
            <el-form-item label="频道名称" prop="name" required>
                <el-input v-model="channelInfo.name" placeholder="请填写30个字以内的名称"></el-input>
            </el-form-item>
            <el-form-item label="频道类别" required>
                <el-select v-model="typeList" multiple placeholder="请选择节目专题类别">
                    <el-option
                        v-for="item in typeOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="频道状态" required>
                <label>禁播</label>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
               <el-button @click="closeDialog">取 消</el-button>
               <el-button type="primary" @click="createChannel">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        name: 'CreateChannel',
        data() {
            let checkName = (rule, value, callback) => {
                if (this.$util.isEmpty(value)) {
                    return callback(new Error('频道名称不能为空'));
                } else if (this.$util.trim(value).length > 10) {
                    return callback(new Error('频道名称不能超过10字'));
                } else {
                    callback();
                }
            };
            let checkTypeList = (rule, value, callback) => {
                if (!this.typeList) {
                    return callback(new Error('请选择频道类别'));
                } else {
                    callback();
                }
            };
            return {
                channelInfo: '',
                typeList: [],
                typeOptions: [],
                infoRules: {
                    name: [
                        {validator: checkName, trigger: 'blur'}
                    ],
                    typeList: [
                        {validator: checkTypeList, trigger: 'change'}
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getChannelType().then(response => {
                    if (response && response.code === 0) {
                        this.typeOptions = response.data;
                    }
                });
            },
            closeDialog() {

            },
            createChannel() {

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

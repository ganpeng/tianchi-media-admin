<!--内容管理-栏目管理-直播频道设置组件-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>频道设置</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="channelInfo" :rules="infoRules" status-icon ref="channelInfo"
                 label-width="140px"
                 class="form-block">
            <el-form-item label="直播频道" prop="channel" required>
                <el-select v-model="channelInfo.channel" clearable placeholder="请选择直播频道">
                    <el-option
                        v-for="item in channelOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="作用时间:">
                <label>{{channelInfo.duration}}</label>
            </el-form-item>
            <el-form-item label="状态:">
                <label>{{channelInfo.status}}</label>
            </el-form-item>
            <el-form-item class="operate">
                <el-button type="primary" @click="updateChannel">更 新</el-button>
                <el-button @click="reset">重 置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    export default {
        name: 'SetChannel',
        data() {
            let checkChannel = (rule, value, callback) => {
                if (!this.channelInfo.channel) {
                    return callback(new Error('请选择直播频道'));
                } else {
                    callback();
                }
            };
            return {
                channelOptions: [
                    {id: 1, name: 'CCTV1'},
                    {id: 2, name: 'CCTV2'},
                    {id: 3, name: 'CCTV3'},
                    {id: 4, name: 'CCTV4'},
                    {id: 5, name: 'CCTV5'}
                ],
                channelInfo: {
                    channel: '',
                    duration: '全局',
                    status: '运行'
                },
                infoRules: {
                    channel: [
                        {validator: checkChannel, trigger: 'change'}
                    ]
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
            },
            // 设置直播频道
            updateChannel() {
                this.$refs['channelInfo'].validate((valid) => {
                    if (valid) {
                    } else {
                        return false;
                    }
                });
            },
            // 重置表单
            reset() {
                this.$refs['channelInfo'].resetFields();
            }
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" scoped>
    .el-form {
        margin-top: 50px;
    }

    .el-select {
        width: 600px;
    }
</style>

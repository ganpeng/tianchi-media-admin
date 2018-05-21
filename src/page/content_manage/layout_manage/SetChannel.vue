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
                <label>全局</label>
            </el-form-item>
            <el-form-item label="状态:">
                <label>正常</label>
            </el-form-item>
            <el-form-item class="operate">
                <el-button type="primary" @click="updateChannel">保 存</el-button>
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
                if (!this.liveChannel) {
                    return callback(new Error('请选择直播频道'));
                } else {
                    callback();
                }
            };
            return {
                channelOptions: [
                    {id: 1, name: 'CCTV1', no: '00001'},
                    {id: 2, name: 'CCTV2', no: '00002'},
                    {id: 3, name: 'CCTV3', no: '00003'},
                    {id: 4, name: 'CCTV4', no: '00004'},
                    {id: 5, name: 'CCTV5', no: '00005'}
                ],
                channelInfo: {
                    channel: ''
                },
                infoRules: {
                    liveChannel: [
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
                // 优先使用本地数据
                let liveChannelList = this.$store.state.todayRecommend.liveChannelList;
                if (liveChannelList && liveChannelList.length !== 0) {
                    this.channelInfo.channel = liveChannelList[0].liveChannelVo.id;
                } else {
                    // 请求线上数据
                }
            },
            // 设置直播频道
            updateChannel() {
                this.$refs['channelInfo'].validate((valid) => {
                    if (valid) {
                        // 组合频道信息
                        let liveChannelList = [
                            {
                                liveChannelType: 'LIVE_CHANNEL',
                                liveChannelVo: this.getLiveChannel(this.channelInfo.channel),
                                navBarId: this.$route.params.naviBarId,
                                priority: 1,
                                releaseStatus: 'RELEASED'
                            }
                        ];
                        // 保存信息到store的today_recommended模块
                        this.$store.dispatch('todayRecommend/setLiveChannels', liveChannelList).then(response => {
                            if (response) {
                                this.$message({
                                    message: '保存频道信息成功',
                                    type: 'success'
                                });
                            } else {
                                this.$message.error('保存信息失败');
                            }
                        });
                    } else {
                        return false;
                    }
                });
            },
            getLiveChannel(id) {
                for (let i = 0; i < this.channelOptions.length; i++) {
                    if (this.channelOptions[i].id === id) {
                        return this.channelOptions[i];
                    }
                }
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

<!-- 设置直播频道组件 -->
<template>
    <div class="container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>频道页面设置</el-breadcrumb-item>
            <el-breadcrumb-item>直播频道设置</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            label-width="100px"
            :model="channelForm"
            status-icon
            class="form"
            :rules="channelFormRules"
            @submit.native.prevent
            ref="channelForm"
            >
            <el-col :span="6">
                <el-form-item label="频道" prop="channelId">
                    <el-select
                        v-model="channelForm.channelId"
                        clearable
                        filterable
                        remote
                        @change="channelChangeHandler"
                        :remote-method="searchChannel"
                        placeholder="请搜索频道">
                        <el-option
                            v-for="(item, index) in channelList"
                            :key="index"
                            :label="item.innerName"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <div class="text-center">
                    <el-button type="primary" @click="saveViewChannel">确定</el-button>
                </div>
            </el-col>
        </el-form>
    </div>
</template>
<script>
import _ from 'lodash';
export default {
    name: 'AppendViewChannel',
    data() {
        return {
            channelForm: {
                channelId: ''
            },
            channel: null,
            channelList: [],
            channelFormRules: {
                channelId: [
                    { required: true, message: '请选择频道' }
                ]
            }
        };
    },
    created() {
        let {navBarId} = this.$route.params;
        this.$service.getChannelLayout({navBarId})
            .then((res) => {
                if (res && res.code === 0) {
                    let obj = res.data.list[0];
                    this.channel = obj && obj.channel ? obj.channel : null;
                    this.channelList = obj && obj.channel ? [obj.channel] : [];
                    this.channelForm.channelId = obj && obj.channel ? obj.channel.id : '';
                }
            });
    },
    methods: {
        saveViewChannel() {
            this.$refs.channelForm.validate(valid => {
                if (valid) {
                    let {navBarId} = this.$route.params;
                    let reqBody = [{
                        navBarId,
                        channel: this.channel,
                        channelCategory: this.channel.category
                    }];

                    this.$service.getChannelDetail(this.channel.id)
                        .then((res) => {
                            if (res && res.code === 0) {
                                let channel = res.data;
                                if (channel.visible) {
                                    this.$service.postChannelLayout(reqBody)
                                        .then((res) => {
                                            if (res && res.code === 0) {
                                                this.$message.success('设置直播频道成功');
                                            }
                                            this.$router.back();
                                        });
                                } else {
                                    this.$message.error('该频道处于禁播状态, 请重新选择频道');
                                }
                            }
                        });
                }
            });
        },
        channelChangeHandler(id) {
            if (id) {
                let channel = this.channelList.find((channel) => channel.id === id);
                this.channel = channel;
            } else {
                this.channel = null;
            }
        },
        searchChannel: _.debounce(function(value) {
            let params = { keyword: value };
            this.$service.getChannelList(params)
                .then((res) => {
                    if (res && res.code === 0) {
                        let channelList = _.uniqBy(this.channelList.concat(res.data.list), 'id');
                        this.channelList = channelList;
                    }
                });
        }, 300)
    }
};
</script>
<style lang="less" scoped>
    .form {
        margin-top: 20px;
    }
    .model-btn {
        margin-top: 40px;
    }
</style>

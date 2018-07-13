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
            ref="channelForm"
            >
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
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <div class="text-center">
                <el-button type="primary" @click="saveViewChannel">确定</el-button>
            </div>
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
    methods: {
        saveViewChannel() {
            this.$refs.channelForm.validate(valid => {
                if (valid) {
                    let {navBarId} = this.$route.params;
                    let reqBody = [{
                        navBarId,
                        channel: this.channel,
                        channelCategory: 'LIVE'
                    }];

                    this.$service.postChannelLayout(reqBody)
                        .then((res) => {
                            if (res && res.code === 0) {
                            }
                            console.log(res);
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
            let params = { keyword: value, category: 'LIVE' };
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

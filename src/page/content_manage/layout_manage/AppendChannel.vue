<!-- 频道单独设置页面 -->
<template>
    <div class="container">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>栏目管理</el-breadcrumb-item>
            <el-breadcrumb-item>频道页面设置</el-breadcrumb-item>
            <el-breadcrumb-item>频道模块设置</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="form">
            <select-channel
                :size="size"
                ref="selectChannel"
                :showBtn="false"
                :successHandler="setChannelBlock"
                ></select-channel>
        </div>
    </div>
</template>
<script>
import SelectChannel from './SelectChannel';
import {LAYOUT_IMAGE_DIMENSION} from '@/util/config/dimension';
export default {
    name: 'AppendChannel',
    components: {
        SelectChannel
    },
    data() {
        return {};
    },
    computed: {
        size() {
            let {imageSpec} = this.$route.params;
            let {width, height} = LAYOUT_IMAGE_DIMENSION[imageSpec].coverImage;
            return [{
                value: `${width}*${height}`,
                label: `当前块尺寸: ${width}*${height}`
            }];
        }
    },
    methods: {
        setChannelBlock(data) {}
    }
};
</script>

<style lang="less" scoped>
    .form {
        margin-top: 20px;
    }
</style>

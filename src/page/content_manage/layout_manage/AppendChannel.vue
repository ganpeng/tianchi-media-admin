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
                :existList="layoutItemList"
                :hasImage="hasImage"
                :currentRow="currentRow"
                :currentIndex="currentIndex"
                :successHandler="setChannelBlock"
                ></select-channel>
        </div>
    </div>
</template>
<script>
import {mapMutations, mapGetters} from 'vuex';
import SelectChannel from './SelectChannel';
import {LAYOUT_IMAGE_DIMENSION} from '@/util/config/dimension';
export default {
    name: 'AppendChannel',
    components: {
        SelectChannel
    },
    data() {
        return {
            layoutItemList: [],
            //  一些临时的变量
            currentRow: 0,
            currentIndex: 0
        };
    },
    created() {
        let {navBarId, navBarSignCode, model, row, index} = this.$route.params;
        let liveChannelObj = this.getCurrentLayout({navBarSignCode, navBarId});
        let {layoutBlockList} = liveChannelObj;
        let currentModel = layoutBlockList[model];
        if (currentModel) {
            this.layoutItemList = currentModel.layoutItemMultiList;
            this.currentRow = row;
            this.currentIndex = index;
            this.$nextTick(() => {
                this.$refs.selectChannel.getExistChannel();
            });
        }
    },
    computed: {
        ...mapGetters({
            getCurrentLayout: 'layout/getCurrentLayout'
        }),
        size() {
            if (this.hasImage) {
                let {imageSpec} = this.$route.params;
                let {width, height} = LAYOUT_IMAGE_DIMENSION[imageSpec].coverImage;
                return [{
                    value: `${width}*${height}`,
                    label: `当前块尺寸: ${width}*${height}`
                }];
            } else {
                return [];
            }
        },
        hasImage() {
            let {imageSpec} = this.$route.params;
            return imageSpec !== 'live-carousel';
        }
    },
    methods: {
        ...mapMutations({
            setSingleRecommendItem: 'layout/setSingleRecommendItem'
        }),
        setChannelBlock(data) {
            //  {navBarId, navBarName, navBarSignCode, model, row, index, item}
            let {navBarId, navBarSignCode, model, row, index} = this.$route.params;
            let channelModel = {
                navBarId,
                navBarSignCode,
                model,
                row,
                index,
                item: data
            };
            this.setSingleRecommendItem(channelModel);
            this.$router.push(`/nav-bar-manage/layout-setting/LIVE_CHANNEL/${navBarId}`);
        }
    }
};
</script>

<style lang="less" scoped>
    .form {
        margin-top: 20px;
    }
</style>

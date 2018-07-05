<!--轮播频道详情页面-->
<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>内容管理</el-breadcrumb-item>
            <el-breadcrumb-item>频道管理</el-breadcrumb-item>
            <el-breadcrumb-item>轮播频道管理</el-breadcrumb-item>
            <el-breadcrumb-item><label class="channel-name">{{channelInfo.name}}</label>轮播频道详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="block-box text-left">
            <el-tag class="title">频道基本信息</el-tag>
            <el-form label-position="right" label-width="100px">
                <el-form-item label="名称：">
                    <label>{{channelInfo.name}}</label>
                </el-form-item>
                <el-form-item label="编号：">
                    <label>{{channelInfo.code}}</label>
                </el-form-item>
                <el-form-item label="类别：">
                    <label>{{channelInfo.typeList | jsonJoin('name')}}</label>
                </el-form-item>
                <el-form-item label="组播地址：">
                    <label>{{channelInfo.multicastIp}}</label>
                </el-form-item>
                <el-form-item label="端口号：">
                    <label>{{channelInfo.multicastPort}}</label>
                </el-form-item>
                <el-form-item label="状态：">
                    <label>{{channelInfo.visible ? '正常' : '禁播'}}</label>
                </el-form-item>
            </el-form>
            <el-tag class="title">频道节目信息</el-tag>
            <el-form label-position="right" label-width="90px">
                <el-form-item label="当前播放：">
                    <label>{{channelInfo.currentProgramme}}</label>
                </el-form-item>
                <el-form-item label="播放时段：">
                    <label>{{channelInfo.duration}}</label>
                </el-form-item>
            </el-form>
            <el-table
                :data="channelInfo.carouselVideoList"
                border
                style="width: 100%">
                <el-table-column
                    width="100px"
                    label="播放顺序">
                    <template slot-scope="scope">
                        <label>{{scope.row.sort}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="code"
                    label="视频编号">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="视频文件名">
                </el-table-column>
                <el-table-column
                    prop="duration"
                    label="时长">
                </el-table-column>
                <el-table-column
                    prop="url"
                    label="视频地址">
                </el-table-column>
                <el-table-column align="center"
                                 label="操作"
                                 class="operate">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="previewVideo(scope.row)">预览</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <display-video-dialog
            :url="previewVideoInfo.url"
            :displayVideoDialogVisible="previewVideoInfo.visible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
    </div>
</template>

<script>
    import DisplayVideoDialog from '../../video_manage/DisplayVideoDialog';

    export default {
        name: 'CarouselChannelDetail',
        components: {
            DisplayVideoDialog
        },
        data() {
            return {
                channelInfo: {
                    id: '',
                    name: '',
                    code: '',
                    status: '',
                    categoryList: [],
                    currentProgramme: '',
                    duration: '',
                    carouselVideoList: []
                },
                previewVideoInfo: {
                    url: '',
                    visible: false
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getChannelDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        this.channelInfo = response.data;
                    }
                });
            },
            // 预览视频
            previewVideo(videoInfo) {
                this.previewVideoInfo.url = videoInfo.url;
                this.previewVideoInfo.visible = true;
            },
            // 关闭视频预览
            closeDisplayVideoDialog(status) {
                this.previewVideoInfo.visible = status;
            }
        }
    };
</script>

<style lang="less" scoped>

    .channel-name {
        font-style: italic;
        font-weight: bold;
        font-size: 16px;
    }

    .title {
        margin: 30px 0 10px 30px;
    }

    .el-form-item {
        margin-bottom: 0px;
    }

</style>

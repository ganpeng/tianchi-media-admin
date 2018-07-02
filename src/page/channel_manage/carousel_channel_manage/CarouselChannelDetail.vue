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
            <el-form label-position="right" label-width="60px">
                <el-form-item label="名称：">
                    <label>{{channelInfo.name}}</label>
                </el-form-item>
                <el-form-item label="编号：">
                    <label>{{channelInfo.code}}</label>
                </el-form-item>
                <el-form-item label="类别：">
                    <label>{{channelInfo.categoryList.join(',')}}</label>
                </el-form-item>
                <el-form-item label="状态：">
                    <label>{{channelInfo.status}}</label>
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
                :data="videoList"
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
                    id: '001',
                    name: '甄嬛传',
                    code: '001',
                    status: '正常',
                    categoryList: ['电视剧', '电影'],
                    currentProgramme: '甄嬛传第45集',
                    duration: '2018.6.4 12:00:00 - 2018.6.4 14:30:25'
                },
                videoList: [{
                    id: '001',
                    sort: 1,
                    code: '20180621034504',
                    name: '甄嬛传第1集（甄嬛初入宫）',
                    duration: '00:46:04',
                    url: 'http://dev-video.tianchiapi.com/group3/M00/00/1E/CgEBJlsrclGAWI8VAAAQ_Iaf3lM51.m3u8'
                }],
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

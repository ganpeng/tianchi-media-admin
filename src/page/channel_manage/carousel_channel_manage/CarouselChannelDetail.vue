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
                    <label>{{channelInfo.innerName}}</label>
                </el-form-item>
                <el-form-item label="编号：">
                    <label>{{channelInfo.no}}</label>
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
                <el-form-item label="tsId：">
                    <label>{{channelInfo.tsId}}</label>
                </el-form-item>
                <el-form-item label="serviceId：">
                    <label>{{channelInfo.serviceId}}</label>
                </el-form-item>
                <el-form-item label="所在服务器：">
                    <label>{{channelInfo.pushServer}}</label>
                </el-form-item>
                <el-form-item label="状态：">
                    <label>{{channelInfo.visible ? '正常' : '禁播'}}</label>
                </el-form-item>
                <el-form-item label="封面：">
                    <img :src="channelInfo.logoUri | imageUrl">
                </el-form-item>
            </el-form>
            <el-tag class="title">频道节目信息</el-tag>
            <el-form label-position="right" label-width="90px">
                <el-form-item label="当前播放：">
                    <label>{{channelInfo.currentProgramme ? channelInfo.currentProgramme : '暂无当前播放节目'}}</label>
                </el-form-item>
                <el-form-item label="播放时段：" v-if="channelInfo.currentProgramme">
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
                        <label>{{scope.$index + 1}}</label>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="code"
                    label="视频编号">
                </el-table-column>
                <el-table-column
                    prop="originName"
                    label="视频文件名">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="视频展示名">
                </el-table-column>
                <el-table-column
                    prop="link"
                    align="center"
                    width="300px"
                    label="预览视频">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.m3u8For1080P"
                            type="text"
                            size="small"
                            @click="previewVideo(scope.row.m3u8For1080P)"
                        >1080
                        </el-button>
                        <el-button
                            v-if="scope.row.m3u8For720P"
                            type="text"
                            size="small"
                            @click="previewVideo(scope.row.m3u8For720P)"
                        >720
                        </el-button>
                        <el-button
                            v-if="scope.row.m3u8For480P"
                            type="text"
                            size="small"
                            @click="previewVideo(scope.row.m3u8For480P)"
                        >480
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="takeTimeInSec"
                    align="center"
                    label="视频时长">
                    <template slot-scope="scope">
                        {{scope.row.takeTimeInSec | fromSecondsToTime}}
                    </template>
                </el-table-column>
                <el-table-column
                    width="100px"
                    label="视频状态">
                    <template slot-scope="scope">
                        <label>{{scope.row.visible ? '正常':'禁播'}}</label>
                    </template>
                </el-table-column>
            </el-table>
            <div class="text-center edit-box">
                <el-button type="success" @click="editInfo">编辑频道信息</el-button>
            </div>
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
                channelInfo: {},
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
                        this.channelInfo.carouselVideoList.map(video => {
                            if (video.onPlay) {
                                this.channelInfo.currentProgramme = video.originName;
                                this.channelInfo.duration = this.$util.formatDate(video.lastPlayTime) + '-' + this.$util.formatDate(video.lastPlayTime + video.takeTimeInSec * 1000);
                            }
                        });
                    }
                });
            },
            // 预览视频
            previewVideo(url) {
                let baseUri = window.localStorage.getItem('videoBaseUri');
                this.previewVideoInfo.url = `${baseUri}${url}`;
                this.previewVideoInfo.visible = true;
            },
            // 关闭视频预览
            closeDisplayVideoDialog(status) {
                this.previewVideoInfo.visible = status;
            },
            // 编辑轮播频道
            editInfo() {
                this.$router.push({
                    name: 'EditCarouselChannel',
                    params: {id: this.$route.params.id}
                });
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

    .edit-box {
        margin: 60px 0px 40px 0px;
    }
</style>

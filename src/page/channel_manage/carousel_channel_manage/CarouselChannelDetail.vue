<!--轮播频道详情页面-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'内容管理'},
            {name:'频道管理'},
            {name:'轮播频道管理'},
            {name:'轮播频道详情'}]">
        </custom-breadcrumb>
        <div class="main-block">
            <div id="basic-info">
                <!--基本信息-->
                <div class="vice-block float-left">
                    <h3 class="block-vice-title">频道基本信息</h3>
                    <el-card>
                        <ul>
                            <li><span>频道名称</span><label>{{channelInfo.innerName}}</label></li>
                            <li><span>频道编号</span><label>{{channelInfo.no}}</label></li>
                            <li>
                                <span>频道类别</span>
                                <label>
                                    <el-tag v-for="(item, index) in channelInfo.typeList"
                                            :key="index"
                                            type="info">
                                        {{item.name}}
                                    </el-tag>
                                </label>
                            </li>
                            <li><span>组播地址</span><label>{{channelInfo.multicastIp}}</label></li>
                            <li><span>端口号</span><label>{{channelInfo.multicastPort}}</label></li>
                            <li><span>tsId</span><label>{{channelInfo.tsId}}</label></li>
                            <li><span>serviceId</span><label>{{channelInfo.serviceId}}</label></li>
                            <li><span>所属服务器</span><label>{{channelInfo.pushServer}}</label></li>
                            <li><span>频道状态</span>
                                <label>
                                    <i class="status-normal" v-if="channelInfo.visible">正常</i>
                                    <i class="status-abnormal" v-else>禁播</i>
                                </label>
                            </li>
                        </ul>
                    </el-card>
                </div>
                <!--封面图-->
                <div class="vice-block float-left">
                    <h3 class="block-vice-title">频道封面图</h3>
                    <img :src="channelInfo.logoUri | imageUrl">
                </div>
            </div>
            <!--节目信息-->
            <div class="vice-block">
                <h3 class="block-vice-title">频道节目信息</h3>
                <el-card>
                    <ul>
                        <li>
                            <span>当前播放</span>
                            <label class="on-play">
                                {{channelInfo.currentProgramme ? channelInfo.currentProgramme : '暂无当前播放节目'}}
                            </label>
                        </li>
                        <li><span>播放时段</span><label>{{channelInfo.duration}}</label></li>
                        <li>
                            <span>视频个数</span>
                            <label>
                                {{channelInfo.carouselVideoList ? channelInfo.carouselVideoList.length : ''}}个
                            </label>
                        </li>
                    </ul>
                </el-card>
                <el-table
                    :data="channelInfo.carouselVideoList"
                    border
                    style="width: 100%">
                    <el-table-column
                        width="80px"
                        align="center"
                        label="播放顺序">
                        <template slot-scope="scope">
                            <label>{{scope.$index + 1}}</label>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="120px"
                        prop="code"
                        label="视频编号">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="originName"
                        label="视频文件名">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="name"
                        label="视频展示名">
                    </el-table-column>
                    <el-table-column
                        prop="link"
                        align="center"
                        width="240px"
                        label="预览视频">
                        <template slot-scope="scope">
                            <el-button
                                v-if="scope.row.m3u8For4K"
                                type="text"
                                size="small"
                                @click="previewVideo(scope.row.m3u8For4K)"
                            >4K
                            </el-button>
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
                        width="150px"
                        align="center"
                        label="视频时长">
                        <template slot-scope="scope">
                            {{scope.row.takeTimeInSec | fromSecondsToTime}}
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        width="100px"
                        label="视频状态">
                        <template slot-scope="scope">
                            <i class="status-normal" v-if="scope.row.visible">正常</i>
                            <i class="status-abnormal" v-else>禁播</i>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div id="operate-list">
                <el-button type="primary" @click="editInfo">编辑频道信息</el-button>
                <el-button type="primary" @click="toChannelList">返回轮播频道列表</el-button>
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
            },
            toChannelList() {
                this.$router.push({
                    name: 'CarouselChannelList'
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    .main-block {
        position: relative;
        padding-top: 80px;
        margin-bottom: 80px;
    }

    #basic-info {
        max-width: 1200px;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
    }

    .el-card {
        width: 600px;
        ul {
            li {
                display: flex;
                margin-bottom: 10px;
                min-height: 32px;
                flex-direction: row;
                justify-content: left;
                align-items: center;
                > span {
                    margin-right: 80px;
                    width: 120px;
                    text-align: right;
                    flex-shrink: 0;
                    font-size: $largerFontSize;
                    color: $baseGray;
                }
                label {
                    width: 380px;
                    font-size: $normalFontSize;
                    color: #909399;
                    flex-shrink: 0;
                    line-height: 2;
                    text-align: left;
                    &.on-play {
                        color: $baseBlue;
                    }
                    .el-tag {
                        margin-right: 10px;
                    }
                }
            }
        }
    }

    img {
        display: block;
    }

    #operate-list {
        position: absolute;
        right: 0px;
        top: 10px;
        .el-button {
            margin-right: 30px;
        }
    }
</style>

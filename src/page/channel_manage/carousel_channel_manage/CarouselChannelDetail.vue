<!--轮播频道详情页面-->
<template>
    <div>
        <custom-breadcrumb
            v-bind:breadcrumbList="[
            {name:'频道管理'},
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
            <div class="vice-block text-left">
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
                    header-row-class-name="common-table-header"
                    row-class-name=video-row
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
                            <div class="btn-icon-container">
                                <el-button
                                    v-if="scope.row.m3u8For4K"
                                    type="text"
                                    size="small"
                                    @click="displayVideo(scope.row.m3u8For4K,scope.row.originName)"
                                >4K
                                </el-button>
                                <svg-icon
                                    v-if="scope.row.m3u8For4K"
                                    icon-class="copy_btn"
                                    class-name="copy-btn"
                                    :data-clipboard-text="getVideoUrl(scope.row.m3u8For4K)">
                                </svg-icon>
                            </div>
                            <div class="btn-icon-container">
                                <el-button
                                    v-if="scope.row.m3u8For1080P"
                                    type="text"
                                    size="small"
                                    @click="displayVideo(scope.row.m3u8For1080P,scope.row.originName)"
                                >1080
                                </el-button>
                                <svg-icon
                                    v-if="scope.row.m3u8For1080P"
                                    icon-class="copy_btn"
                                    class-name="copy-btn"
                                    :data-clipboard-text="getVideoUrl(scope.row.m3u8For1080P)">
                                </svg-icon>
                            </div>
                            <div class="btn-icon-container">
                                <el-button
                                    v-if="scope.row.m3u8For720P"
                                    type="text"
                                    size="small"
                                    @click="displayVideo(scope.row.m3u8For720P,scope.row.originName)"
                                >720
                                </el-button>
                                <svg-icon
                                    v-if="scope.row.m3u8For720P"
                                    icon-class="copy_btn"
                                    class-name="copy-btn"
                                    :data-clipboard-text="getVideoUrl(scope.row.m3u8For720P)">
                                </svg-icon>
                            </div>
                            <div class="btn-icon-container">
                                <el-button
                                    v-if="scope.row.m3u8For480P"
                                    type="text"
                                    size="small"
                                    @click="displayVideo(scope.row.m3u8For480P,scope.row.originName)"
                                >480
                                </el-button>
                                <svg-icon
                                    v-if="scope.row.m3u8For480P"
                                    icon-class="copy_btn"
                                    class-name="copy-btn"
                                    :data-clipboard-text="getVideoUrl(scope.row.m3u8For480P)">
                                </svg-icon>
                            </div>
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
                <el-button type="primary" class="page-main-btn" @click="editInfo">编辑</el-button>
                <el-button @click="toChannelList" class="page-main-btn">返回列表页</el-button>
            </div>
        </div>
        <display-video-dialog
            :url="previewVideoInfo.url"
            :title="previewVideoInfo.title"
            :displayVideoDialogVisible="previewVideoInfo.visible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
    </div>
</template>

<script>
    import DisplayVideoDialog from '../../video_manage/DisplayVideoDialog';

    const ClipboardJS = require('clipboard');

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
                    title: '',
                    visible: false
                }
            };
        },
        computed: {
            getVideoUrl() {
                return (uri) => {
                    let baseUri = window.localStorage.getItem('videoBaseUri');
                    return `${baseUri}${uri}`;
                };
            }
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
                                this.channelInfo.duration = this.$util.formatDate(new Date(video.lastPlayTime), 'yyyy年MM月DD日HH时mm分SS秒') + '---' + this.$util.formatDate(new Date(video.lastPlayTime + video.takeTimeInSec * 1000), 'yyyy年MM月DD日HH时mm分SS秒');
                            }
                        });
                    }
                });
                let that = this;
                let clipboard = new ClipboardJS('.copy-btn');
                clipboard.on('success', function (e) {
                    that.$message.success('视频链接复制成功');
                    e.clearSelection();
                });
                clipboard.on('error', function (e) {
                    that.$message.error('视频链接复制失败');
                });
            },
            // 预览视频
            displayVideo(url, title) {
                let baseUri = window.localStorage.getItem('videoBaseUri');
                this.previewVideoInfo.url = `${baseUri}${url}`;
                this.previewVideoInfo.title = title;
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
        display: inline-block;
        padding-right: 50px;
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
                        border: none;
                        margin-right: 10px;
                    }
                }
            }
        }
    }

    img {
        display: block;
    }

    .copy-btn {
        cursor: pointer;
    }

    #operate-list {
        position: absolute;
        right: 0px;
        top: 10px;
    }
</style>

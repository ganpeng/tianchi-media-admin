<!--轮播插播详情页面-->
<template>
    <div>
        <div class="content-title">轮播插播详情</div>
        <div class="seperator-line"></div>
        <!--信息-->
        <div class="detail-title-block">
            <div class="title">
                <label>{{interCutInfo.name}}</label>
                <span v-if="interCutInfo.playStatus === 'ACTIVE'"
                      class="status-normal">已生效</span>
                <span v-if="interCutInfo.playStatus === 'WAITING'"
                      class="status-deleting">未生效</span>
                <span v-if="interCutInfo.playStatus === 'EXPIRED'"
                      class="status-abnormal">已失效</span>
            </div>
            <div class="ad-time">
                <div>创建于{{interCutInfo.createdAt | formatDate('yyyy.MM.DD')}}</div>
                <div>更新于{{interCutInfo.updatedAt | formatDate('yyyy.MM.DD')}}</div>
            </div>
        </div>
        <!--相关信息-->
        <div class="about-ad">
            <svg-icon icon-class="inter_cut_placer"></svg-icon>
            <div>
                <p class="scheduled">定时:
                    <span v-if="interCutInfo.scheduled" class="is-scheduled">是</span>
                    <span v-else>否</span>
                </p>
                <p>播放时段:
                    <span class="ad-effect-time">{{interCutInfo.startTime | formatDate('yyyy.MM.DD HH:mm:SS')}} - {{(interCutInfo.startTime + interCutInfo.totalDuration * 1000) | formatDate('yyyy.MM.DD HH:mm:SS')}}</span>
                </p>
                <p>当前播放:
                    <span class="ad-info-desc">{{interCutInfo.currentProgramme}}</span>
                </p>
            </div>
        </div>
        <!--频道信息-->
        <div class="content-sub-title">插播频道
            <label class="relate-count">{{interCutInfo.channelList.length}}个</label>
            <el-button
                type="text"
                @click="moreFilters = !moreFilters"
                class="more-filters"
                :class="{active:moreFilters}">
                <label v-if="moreFilters">收起</label>
                <label v-else>展开</label>
                <i class="el-icon-arrow-up" v-if="moreFilters"></i>
                <i class="el-icon-arrow-down" v-else></i>
            </el-button>
        </div>
        <ul class="channel-list" v-if="moreFilters">
            <li v-for="(item,index) in interCutInfo.channelList" :key="index" class="ellipsis one">
                {{item.no}} {{item.innerName}}
            </li>
        </ul>
        <div class="seperator-line"></div>
        <!--节目信息-->
        <div class="content-sub-title">插播视频<label class="relate-count">{{interCutInfo.videoList.length}}个</label></div>
        <el-table
            header-row-class-name="common-table-header"
            row-class-name=video-row
            :data="interCutInfo.videoList"
            border
            style="width: 100%">
            <el-table-column
                width="100px"
                align="center"
                label="序号">
                <template slot-scope="scope">
                    <label>{{scope.$index + 1}}</label>
                </template>
            </el-table-column>
            <el-table-column
                align="center"
                width="120px"
                prop="code"
                label="ID">
            </el-table-column>
            <el-table-column
                align="center"
                prop="originName"
                min-width="420px"
                label="文件名">
            </el-table-column>
            <el-table-column
                prop="link"
                align="center"
                width="240px"
                label="预览">
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
                align="center"
                width="100px"
                label="视频状态">
                <template slot-scope="scope">
                    <div class="operator-btn-wrapper">
                        <i class="btn-text text-normal">正常</i>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="fixed-btn-container">
            <el-button
                class="btn-style-two"
                type="primary"
                @click="editInfo"
                v-if="interCutInfo.playStatus === 'WAITING'">
                编辑
            </el-button>
            <el-button class="btn-style-three" @click="toInterCutList" plain>返回列表</el-button>
        </div>
        <display-video-dialog
            :url="previewVideoInfo.url"
            :title="previewVideoInfo.title"
            ref="displayVideoPlayer"
            :displayVideoDialogVisible="previewVideoInfo.visible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
    </div>
</template>

<script>
    import DisplayVideoDialog from 'sysComponents/custom_components/custom/DisplayVideoDialog';

    const ClipboardJS = require('clipboard');

    export default {
        name: 'CarouselChannelDetail',
        components: {
            DisplayVideoDialog
        },
        data() {
            return {
                moreFilters: true,
                interCutInfo: {
                    videoList: [],
                    channelList: []
                },
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
                this.$util.toggleFixedBtnContainer();
                this.$service.getInterCutDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        this.interCutInfo = response.data;
                        this.interCutInfo.videoList.map(video => {
                            if (video.onPlay) {
                                this.interCutInfo.currentProgramme = video.originName;
                                this.interCutInfo.duration = this.$util.formatDate(new Date(video.lastPlayTime), 'yyyy年MM月DD日HH时mm分SS秒') + '---' + this.$util.formatDate(new Date(video.lastPlayTime + video.takeTimeInSec * 1000), 'yyyy年MM月DD日HH时mm分SS秒');
                            } else {
                                this.interCutInfo.currentProgramme = '暂无';
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
                this.$refs.displayVideoPlayer.showDialog();
            },
            // 关闭视频预览
            closeDisplayVideoDialog(status) {
                this.previewVideoInfo.visible = status;
            },
            editInfo() {
                this.$router.push({
                    name: 'EditInterCut',
                    params: {id: this.$route.params.id}
                });
            },
            toInterCutList() {
                this.$router.push({
                    name: 'IterCutList'
                });
            }
        }
    };
</script>

<style lang="scss" scoped>

    // 频道题目
    .detail-title-block {
        height: 50px;
        line-height: 50px;
        overflow: hidden;
        .ad-time {
            float: right;
            margin-left: 350px;
            margin-right: 20px;
            div {
                height: 17px;
                line-height: 17px;
                color: #6F7480;
                &:first-child {
                    margin-top: 6px;
                    margin-bottom: 3px;
                }
            }
        }

        .title {
            float: left;
            margin-left: 270px;
            label {
                font-size: 20px;
                color: #FFFFFF;
            }
            span {
                margin-top: 9px;
                margin-left: 20px;
            }
        }
        .channel-time {
            float: right;
            margin-left: 350px;
            margin-right: 20px;
            div {
                height: 17px;
                line-height: 17px;
                &:first-child {
                    margin-top: 6px;
                    margin-bottom: 3px;
                }
            }
        }
    }

    .copy-btn {
        cursor: pointer;
    }

    .about-ad {
        position: relative;
        height: 160px;
        padding-bottom: 12px;
        border-bottom: 1px solid #252D3F;
        text-align: left;
        .svg-icon-inter_cut_placer {
            position: absolute;
            top: -45px;
            left: 20px;
            height: 200px !important;
            width: 200px !important;
        }
        div {
            margin-left: 250px;
            border-top: 1px solid #252D3F;
            .ad-type {
                display: inline-block;
                margin-top: 20px;
                margin-right: 10px;
                padding: 0px 5px;
                height: 20px;
                line-height: 20px;
                background: #637497;
                border-radius: 4px;
                font-size: 10px;
                color: #FFFFFF;
            }
            p {
                margin-top: 18px;
                margin-left: 18px;
                font-size: 16px;
                color: #A8ABB3;
                &.scheduled {
                    margin-left: 48px;
                    span {
                        margin-left: 12px;
                        font-size: 16px;
                        color: #6F7480;
                        &.is-scheduled {
                            color: #3AC26F;
                        }
                    }
                }
                .ad-effect-time {
                    margin-left: 4px;
                    padding: 4px 8px;
                    background: #0062C4;
                    border-radius: 4px;
                    font-size: 16px;
                    color: #FFFFFF;
                }
                .ad-info-desc {
                    margin-left: 4px;
                    font-size: 16px;
                    color: #A8ABB3;
                }
            }
        }
    }

    .channel-list {
        display: flex;
        padding: 0px 5px;
        margin: 22px 60px 5px 40px;
        flex-wrap: wrap;
        li {
            margin-right: 20px;
            margin-bottom: 20px;
            width: 200px;
            height: 34px;
            line-height: 34px;
            background: #2A3040;
            border: 1px solid #3E495E;
            border-radius: 4px;
            font-size: 14px;
            color: #A8ABB3;
            text-align: center;
        }
    }

    .content-sub-title {
        color: #A8ABB3;
        .relate-count {
            margin-left: 20px;
            font-size: 20px;
            color: #A8ABB3;
        }
    }

    // 按钮
    .more-filters {
        font-size: 12px;
        color: #6F7480;
        label {
            cursor: pointer;
        }
        &.active {
            color: #1989FA;
            i {
                color: #6F7480;
            }
        }
        i {
            margin-left: 8px;
        }
    }

    .el-table {
        margin-bottom: 100px;
    }

</style>

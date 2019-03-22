<!--轮播频道详情页面-->
<template>
    <div>
        <div class="content-title">轮播频道详情</div>
        <div class="seperator-line"></div>
        <!--轮播信息-->
        <div class="detail-title-block">
            <div class="channel-status shelve" v-if="channelInfo.visible">正常</div>
            <div class="channel-status un-shelve" v-else>禁播</div>
            <div class="title">
                <label>{{channelInfo.no}}</label>&nbsp;&nbsp;<label>{{channelInfo.name}}</label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span v-if="channelInfo.playStatus === 'ACTIVE'"
                      class="status-normal">已生效</span>
                <span v-if="channelInfo.playStatus === 'WAITING'"
                      class="status-deleting">未生效</span>
                <span v-if="channelInfo.playStatus === 'EXPIRED'"
                      class="status-abnormal">已失效</span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <label v-if="channelInfo.startTime" class="start-time">
                    开始时间： {{channelInfo.startTime | formatDate('yyyy.MM.DD HH:mm:SS')}}</label>
            </div>
            <div class="channel-time">
                <div>创建于{{channelInfo.createdAt | formatDate('yyyy.MM.DD')}}</div>
                <div>更新于{{channelInfo.updatedAt | formatDate('yyyy.MM.DD')}}</div>
            </div>
        </div>
        <!--相关信息-->
        <div class="about-channel">
            <img :src="channelInfo.logoUri | imageUrl">
            <div class="info-container">
                <div>
                    <ul class="type-list">
                        <li v-for="(item, index) in channelInfo.typeList"
                            :key="index">
                            {{item.name}}
                        </li>
                    </ul>
                    <ul class="info-list">
                        <li><span>内部名称：</span><label>{{channelInfo.innerName}}</label></li>
                        <li><span>公共频道：</span><label>{{channelInfo.common ? '是':'否'}}</label></li>
                        <li><span>组播地址：</span><label>{{channelInfo.multicastIp}}</label></li>
                        <li><span>端口号：</span><label>{{channelInfo.multicastPort}}</label></li>
                        <li><span>tsID：</span><label>{{channelInfo.tsId ? channelInfo.tsId : '无' }}</label></li>
                        <li><span>serviceID：</span><label>{{channelInfo.serviceId ? channelInfo.serviceId :'无'}}</label>
                        </li>
                    </ul>
                </div>
                <ul class="info-list right-info">
                    <li><span>推流方式：</span>
                        <label
                            class="protocol-type"
                            v-for="(item,index) in channelInfo.protocolList"
                            :key="index">
                            {{item}}
                        </label>
                    </li>
                    <li><span>服务器组：</span><label>{{channelInfo.serverGroup}}</label></li>
                    <li>
                        <span>当前播放：</span>
                        <label class="on-play">
                            {{channelInfo.currentProgramme ? channelInfo.currentProgramme : '暂无当前播放节目'}}
                        </label>
                    </li>
                    <li><span>播放时段：</span><label class="duration">{{channelInfo.duration}}</label></li>
                    <li>
                        <span>视频数量：</span>
                        <label>
                            {{channelInfo.carouselVideoList ? channelInfo.carouselVideoList.length : ''}}个
                        </label>
                    </li>
                </ul>
            </div>
        </div>
        <div class="seperator-line"></div>
        <div class="area-container">
            <h4 class="content-sub-title">
                所属区域
                <span v-if="channelInfo.companyList.length > 0">{{channelInfo.companyList.length}}个</span>
                <span v-if="channelInfo.companyList.length <= 0" class="toggle-btn disabled">
                    展开
                    <i class="el-icon-arrow-down el-icon--right my-arrow-icon"></i>
                </span>
                <span v-if="channelInfo.companyList.length > 0" @click="showCompanyList = !showCompanyList"
                      :class="['toggle-btn', showCompanyList ? 'is-active' : '']">
                    {{showCompanyList ? '收起' : '展开'}}
                    <i v-if="showCompanyList" class="el-icon-arrow-up el-icon--right my-arrow-icon"></i>
                    <i v-else class="el-icon-arrow-down el-icon--right my-arrow-icon"></i>
                </span>
            </h4>
            <ul v-if="showCompanyList" class="search-list clearfix">
                <li v-for="(item, index) in channelInfo.companyList" :key="index" :class="['search-item']">
                    <div class="wrapper">
                        <span class="index">{{index + 1}}</span>
                        <span class="search-name my-ellipsis">{{item.name}}</span>
                        <span v-if="item.name.length > 11" class="ellipsis-content">{{item.name}}</span>
                    </div>
                </li>
            </ul>
            <div v-if="channelInfo.companyList.length > 0" class="seperator-line"></div>
        </div>
        <!--节目信息-->
        <div class="content-sub-title">频道内节目</div>
        <el-table
            header-row-class-name="common-table-header"
            row-class-name=video-row
            :data="channelInfo.carouselVideoList"
            border
            style="width: 100%">
            <el-table-column
                width="50px"
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
                prop="name"
                min-width="230px"
                label="展示名">
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
                        <i class="btn-text text-normal" v-if="scope.row.visible">正常</i>
                        <i class="btn-text text-danger" v-else>禁播</i>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="editInfo">编辑</el-button>
            <el-button class="btn-style-three" @click="toChannelList" plain>返回列表</el-button>
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
                showCompanyList: true,
                channelInfo: {
                    companyList: []
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
                this.$refs.displayVideoPlayer.showDialog();
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

    // 频道题目
    .detail-title-block {
        height: 50px;
        line-height: 50px;
        overflow: hidden;
        .channel-status {
            float: left;
            margin-left: 86px;
            margin-right: 94px;
            margin-top: 9px;
            height: 30px;
            width: 80px;
            line-height: 30px;
            border-radius: 4px;
            font-size: 20px;
            text-align: center;
            &.un-shelve {
                color: #6F7480;
                background: #2A3040;
            }
            &.shelve {
                color: #fff;
                background: #3AC26F;
            }
        }

        .title {
            float: left;
            label {
                font-size: 20px;
                color: #FFFFFF;
            }
            span {
                display: inline-block;
                margin-top: 9px;
                margin-left: 20px;
                height: 30px;
                width: 100px;
                line-height: 30px;
                background: #D27B25;
                border-radius: 4px;
                font-size: 20px;
                color: #FFFFFF;
            }
            .start-time {
                font-size: 14px;
                color: #A8ABB3;
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

    // 相关信息
    .about-channel {
        position: relative;
        padding-bottom: 12px;
        border-bottom: 1px solid #252D3F;
        text-align: left;
        overflow: hidden;
        img {
            position: absolute;
            top: 0px;
            left: 20px;
            height: 200px;
            width: 200px;
            border: 1px solid #3E495E;
            border-radius: 8px;
            box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.50);
        }
        .info-container {
            min-width: 1220px;
            margin-left: 260px;
            height: 230px;
            border-top: 1px solid #252D3F;
            > div {
                display: inline-block;
                margin-right: 60px;
            }
            .type-list {
                margin-top: 10px;
                height: 40px;
                li {
                    float: left;
                    margin-right: 10px;
                    padding: 0px 5px;
                    height: 20px;
                    line-height: 20px;
                    background: #637497;
                    border-radius: 4px;
                    font-size: 10px;
                    color: #FFFFFF;
                }
            }
            .info-list {
                display: inline-block;
                &.right-info {
                    padding-top: 50px;
                }
                li {
                    margin-bottom: 8px;
                    span {
                        display: inline-block;
                        width: 110px;
                        text-align: right;
                        padding-right: 10px;
                        font-size: 16px;
                        color: #A8ABB3;
                    }
                    label {
                        display: inline-block;
                        font-size: 16px;
                        color: #A8ABB3;
                        &.protocol-type {
                            margin-right: 10px;
                        }
                        &.on-play {
                            padding: 6px 8px;
                            font-size: 12px;
                            color: #FFFFFF;
                            background: #0062C4;
                            border-radius: 4px;
                        }
                        &.duration {
                            font-size: 12px;
                            color: #A8ABB3;
                            line-height: 17px;
                        }
                    }
                }
            }
        }
    }

    .content-sub-title {
        span:first-child {
            font-size: 20px;
        }
        .toggle-btn {
            font-size: 14px;
            cursor: pointer;
            margin-left: 40px;
            &.is-active,
            &:hover {
                color: $mainColor;
            }
            i {
                color: #3E495E;
            }
            &.disabled {
                opacity: 0.5;
                font-size: 14px;
                cursor: default;
            }
        }
    }

    .svg-icon-arrow_down {
        font-size: 12px;
    }

    .search-list {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 10px;
        .search-item {
            width: 200px;
            height: 34px;
            line-height: 34px;
            border: 1px solid #3E495E;
            background: #2A3040;
            border-radius: 4px;
            margin-right: 20px;
            margin-bottom: 14px;
            .wrapper {
                position: relative;
                display: flex;
                align-items: center;
                height: 32px;
                .index {
                    width: 32px;
                    height: 32px;
                    line-height: 32px;
                    color: #A8ABB3;
                    border-right: 1px solid #3E495E;
                }
                .search-name {
                    color: #A8ABB3;
                    flex: 1;
                    height: 32px;
                    font-size: 14px;
                    line-height: 32px;
                    text-indent: 10px;
                    text-align: left;
                }
                .ellipsis-content {
                    display: none;
                    position: absolute;
                    top: -24px;
                    left: 20px;
                    background: rgba(0, 0, 0, 0.90);
                    box-shadow: 2px 4px 10px 0 rgba(0, 0, 0, 0.30);
                    border-radius: 4px;
                    white-space: nowrap;
                    padding: 0 10px;
                }
                &:hover {
                    .ellipsis-content {
                        display: block;
                    }
                }
            }
        }
    }

</style>

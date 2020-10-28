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
                <span v-if="channelInfo.applyStatus === 'ACTIVE'"
                      class="status-normal">已生效</span>
                <span v-if="channelInfo.applyStatus === 'WAITING'"
                      class="status-deleting">未生效</span>
                <span v-if="channelInfo.applyStatus === 'EXPIRED'"
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
                        <li><span>组播地址：</span><label>{{channelInfo.multicastIp}}</label></li>
                        <li><span>端口号：</span><label>{{channelInfo.multicastPort}}</label></li>
                        <li><span>tsID：</span><label>{{channelInfo.tsId ? channelInfo.tsId : '无' }}</label></li>
                        <li><span>serviceID：</span><label>{{channelInfo.serviceId ? channelInfo.serviceId :'无'}}</label>
                        </li>
                        <li v-if="false"><span>公共频道：</span>
                            <label class="is-common" v-if="channelInfo.common">是</label>
                            <label v-else>否</label>
                        </li>
                        <!--  dev_v2.6 新增 -->
                        <li>
                            <span>适用客户端：</span>
                            <label
                                class="protocol-type"
                                v-for="(item,index) in channelInfo.applicableClientList || []"
                                :key="index">
                                {{item}}
                            </label>
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
                        <span>当前播放组：</span>
                        <label class="on-play">
                            {{channelInfo.onPlayGroupName ? channelInfo.onPlayGroupName : '暂无当前播放组'}}
                        </label>
                    </li>
                    <li>
                        <span>当前播放：</span>
                        <label class="on-play">
                            {{channelInfo.onPlayVideoName ? channelInfo.onPlayVideoName : '暂无当前播放节目'}}
                        </label>
                    </li>
                    <li><span>播放时段：</span>
                        <label class="duration">
                            {{channelInfo.onPlayDurationStart | formatDate('yyyy年MM月DD日HH时mm分SS秒')}} -
                            {{channelInfo.onPlayDurationEnd | formatDate('yyyy年MM月DD日HH时mm分SS秒')}}
                        </label>
                    </li>
                    <li>
                        <span>会员：</span>
                        <label class="is-common" v-if="channelInfo.paymentType === 'VIP'">是</label>
                        <label v-else>否</label>
                    </li>
                </ul>
            </div>
        </div>
        <div class="seperator-line"></div>
        <div class="area-container" v-if="false">
            <h4 class="content-sub-title">
                所属区域&nbsp;&nbsp;
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
        <!--分组与视频-->
        <div class="content-sub-title video-block-title">
            <span :class="{'active': currentIndex === 0}" class="title" @click="currentIndex = 0">节目单</span>
            <span :class="{'active': currentIndex === 1}" class="title" @click="currentIndex = 1">分组与视频</span>
            <label class="data-show" v-if="currentIndex === 1">共{{carouselGroup.length}}组，实际总播放时长{{carouselGroup |
                getGroupDuration | fromSecondsToTime}}，视频总时长{{carouselGroup | getTotalVideoListDuration |
                fromSecondsToTime}}。</label>
        </div>
        <!-- 分组与视频 -->
        <div v-if="currentIndex === 1">
            <div class="group-container">
                <ul>
                    <li v-for="(item, index) in carouselGroup"
                        :key="index" :class="{'current-group':item.current}">
                        <div class="header-box">
                            <label>组{{index + 1}}</label>
                            <span v-if="item.duration">{{item.duration | fromSecondsToTime}}</span>
                        </div>
                        <div class="content-box" @click="selectCurrentGroup(index)">
                            <p class="name-box">
                                <label class="ellipsis one">{{item.name}}</label>
                                <span v-if="carouselGroup.length !== 1">
                                <i class="el-icon-circle-close" v-show="false"></i>
                            </span>
                            </p>
                            <p class="no-box">
                                <label>
                                    {{item.carouselVideoList.length === 0 ? '暂无视频' : item.carouselVideoList.length +
                                    '个视频'}}
                                </label>
                                <span><svg-icon icon-class="edit" v-show="false"></svg-icon></span>
                            </p>
                            <p class="duration-box">
                                <label v-if="item.carouselVideoList.length === 0">暂无视频时长</label>
                                <label v-else>{{item.carouselVideoList | getCarouselVideoTime |
                                    fromSecondsToTime}}</label>
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
            <!--频道内节目-->
            <div class="video-list-header">
                <div class="group-video-info">
                    <div>
                        <span>组{{currentCarouselGroup.index + 1}}</span><label>{{currentCarouselGroup.name}}</label>
                    </div>
                    <div>
                        <label v-if="currentCarouselGroup.carouselVideoList.length === 0">暂无视频</label>
                        <span v-if="currentCarouselGroup.carouselVideoList.length !== 0">播放时长</span><label
                        v-if="currentCarouselGroup.carouselVideoList.length !== 0">{{currentCarouselGroup.duration |
                        fromSecondsToTime}}</label>
                    </div>
                    <div>
                        <label v-if="currentCarouselGroup.carouselVideoList.length === 0">暂无总时长</label>
                        <span v-if="currentCarouselGroup.carouselVideoList.length !== 0">{{currentCarouselGroup.carouselVideoList.length}}个视频</span>
                        <label v-if="currentCarouselGroup.carouselVideoList.length !== 0">
                            总时长{{currentCarouselGroup.carouselVideoList | getCarouselVideoTime |
                            fromSecondsToTime}}</label>
                    </div>
                </div>
            </div>
            <el-table
                v-if="currentCarouselGroup.carouselVideoList.length !== 0"
                header-row-class-name="common-table-header"
                :data="currentCarouselGroup.carouselVideoList"
                row-class-name=video-larger-row
                border
                style="width: 100%">
                <el-table-column
                    width="60px"
                    align="center"
                    label="顺序">
                    <template slot-scope="scope">
                        {{scope.$index + 1}}
                    </template>
                </el-table-column>
                <el-table-column
                    width="120px"
                    align="center"
                    prop="code"
                    label="ID">
                </el-table-column>
                <el-table-column
                    prop="originName"
                    min-width="210px"
                    align="center"
                    label="文件名">
                </el-table-column>
                <el-table-column
                    prop="name"
                    min-width="360px"
                    align="center"
                    label="展示名">
                    <template slot-scope="scope">
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="link"
                    align="center"
                    max-width="210px"
                    label="预览">
                    <template slot-scope="scope">
                        <div class="btn-icon-container">
                            <el-button
                                v-if="scope.row.m3u8For4K"
                                type="text"
                                size="small"
                                @click="displayVideo(scope.row.m3u8For4K,scope.row.originName)">
                                4K
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
                                @click="displayVideo(scope.row.m3u8For1080P,scope.row.originName)">
                                1080
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
                                @click="displayVideo(scope.row.m3u8For720P,scope.row.originName)">
                                720
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
                                @click="displayVideo(scope.row.m3u8For480P,scope.row.originName)">
                                480
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
                    width="90px"
                    align="center"
                    label="时长">
                    <template slot-scope="scope">
                        {{scope.row.takeTimeInSec | fromSecondsToTime}}
                    </template>
                </el-table-column>
                <el-table-column
                    width="60px"
                    align="center"
                    label="状态">
                    <template slot-scope="scope">
                        <i v-if="scope.row.visible" class="on-the-shelf">正常</i>
                        <i v-else class="off-the-shelf">禁播</i>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 节目单 -->
        <div v-if="currentIndex === 0" class="programme-section">
            <div class="date-list">
                <div v-for="(item, index) in programmeList" :key="item.dateStr"
                     v-if="item.programmeList.length !== 0"
                     :class="{'active':(currentProgrammeIndex === index)}"
                     @click="currentProgrammeIndex = index">
                    <label>{{item.name}}</label>
                    <label>{{item.date}}</label>
                </div>
            </div>
            <div class="programme-list" v-if="programmeList.length !== 0">
                <div v-for="item in programmeList[currentProgrammeIndex].programmeList" :key="item"
                     :class="{'active':item.onPlay}">
                    <label>{{item.startTime | formatDate('HH:mm:SS')}}-{{item.endTime |
                        formatDate('HH:mm:SS')}}</label>
                    <i>播放中</i>
                    <span>{{item.name}}</span>
                </div>
            </div>
        </div>
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
                programmeList: [],
                currentProgrammeIndex: -1,
                currentIndex: 0,
                showCompanyList: true,
                channelInfo: {
                    category: 'CAROUSEL',
                    typeIdList: [],
                    common: false,
                    companyList: [],
                    startTime: '',
                    startDate: '',
                    startPoint: '',
                    protocolList: [],
                    multicastIp: '',
                    pushServer: '',
                    serverGroup: '', // 新加字段
                    visible: false,
                    logoUri: '',
                    onPlayGroupName: '',
                    onPlayVideoName: '',
                    onPlayDurationStart: '',
                    onPlayDurationEnd: '',
                    paymentType: '',
                    applicableClientList: [] //  dev_v2.6 新增字段
                },
                previewVideoInfo: {
                    url: '',
                    title: '',
                    visible: false
                },
                // 当前选中的组
                currentCarouselGroup: {
                    name: '',
                    duration: '',
                    durationFormat: '',
                    videoDuration: '',
                    carouselVideoList: [],
                    index: 0
                },
                carouselGroup: [{
                    name: '默认分组1',
                    duration: '',
                    durationFormat: '',
                    videoDuration: '',
                    carouselVideoList: []
                }]
            };
        },
        filters: {
            getCarouselVideoTime(videoList) {
                let duration = 0;
                for (let i = 0; i < videoList.length; i++) {
                    duration = duration + videoList[i].takeTimeInSec;
                }
                return duration;
            },
            getGroupDuration(groupList) {
                let duration = 0;
                for (let i = 0; i < groupList.length; i++) {
                    duration = duration + groupList[i].duration;
                }
                return duration;
            },
            // 获取视频列表总时间
            getTotalVideoListDuration(groupList) {
                let duration = 0;
                for (let i = 0; i < groupList.length; i++) {
                    for (let m = 0; m < groupList[i].carouselVideoList.length; m++) {
                        duration = duration + groupList[i].carouselVideoList[m].takeTimeInSec;
                    }
                }
                return duration;
            }
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
                this.$service.getCarouselProgrammeList(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        this.programmeList = response.data;
                        for (let i = 0; i < this.programmeList.length; i++) {
                            if (this.programmeList[i].programmeList.length !== 0) {
                                if (this.currentProgrammeIndex === -1) {
                                    this.currentProgrammeIndex = i;
                                }
                            }
                        }
                    }
                });
                this.$service.getChannelDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        for (let key in response.data) {
                            if (!(key === 'protocolList' && !response.data.protocolList)) {
                                this.channelInfo[key] = response.data[key];
                            }
                            this.channelInfo.common = !!this.channelInfo.common;
                        }
                        response.data.typeList.map(type => {
                            this.channelInfo.typeIdList.push(type.id);
                        });
                        if (this.channelInfo.startTime) {
                            let startDate = new Date(this.channelInfo.startTime);
                            this.channelInfo.startDate = this.channelInfo.startTime - (startDate.getHours() * 60 * 60 + startDate.getMinutes() * 60 + startDate.getSeconds()) * 1000;
                            let currentDate = new Date();
                            this.channelInfo.startPoint = currentDate.valueOf() - (currentDate.getHours() * 60 * 60 + currentDate.getMinutes() * 60 + currentDate.getSeconds()) * 1000 + (startDate.getHours() * 60 * 60 + startDate.getMinutes() * 60 + startDate.getSeconds()) * 1000;
                        }
                        this.carouselGroup = response.data.carouselGroupList;
                        // 设置频道节目信息
                        for (let i = 0; i < this.carouselGroup.length; i++) {
                            if (this.carouselGroup[i].onPlay) {
                                this.channelInfo.onPlayGroupName = this.carouselGroup[i].name;
                                this.carouselGroup[i].carouselVideoList.map(video => {
                                    if (video.onPlay) {
                                        this.channelInfo.onPlayVideoName = video.name;
                                        // 设置播放时段
                                        this.channelInfo.onPlayDurationStart = video.lastPlayTime;
                                        this.channelInfo.onPlayDurationEnd = video.lastPlayTime + video.takeTimeInSec * 1000;
                                    }
                                });
                            }
                        }
                    }
                    this.selectCurrentGroup(0);
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
            // 选择组
            selectCurrentGroup(index) {
                for (let i = 0; i < this.carouselGroup.length; i++) {
                    this.carouselGroup[i].current = false;
                }
                if (this.carouselGroup[index]) {
                    this.carouselGroup[index].current = true;
                    this.currentCarouselGroup = this.carouselGroup[index];
                    this.currentCarouselGroup.index = index;
                }
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

    .programme-section {
        .date-list {
            display: flex;
            align-items: center;
            div {
                margin-right: 36px;
                padding-bottom: 7px;
                width: 80px;
                display: flex;
                flex-direction: column;
                align-items: center;
                border-bottom: 1px solid transparent;
                cursor: pointer;
                &.active {
                    border-bottom: 1px solid #1989FA;
                    label {
                        color: white;
                    }
                }
                &:hover {
                    label {
                        color: white;
                    }
                }
                label {
                    font-size: 12px;
                    font-weight: 400;
                    color: rgba(168, 171, 179, 1);
                    cursor: pointer;
                    &:first-child {
                        margin-bottom: 10px;
                    }
                }
            }
        }
        .programme-list {
            padding-top: 8px;
            display: flex;
            flex-direction: column;
            div {
                display: flex;
                align-items: center;
                height: 50px;
                border-bottom: 1px solid #252D3F;
                &.active {
                    label, span {
                        color: white;
                    }
                    i {
                        visibility: visible;
                    }
                }
                &:last-child {
                    border-bottom: 1px solid transparent;
                }
                label {
                    padding-left: 28px;
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(111, 116, 128, 1);
                }
                i {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    margin-left: 130px;
                    width: 48px;
                    height: 20px;
                    background: rgba(103, 194, 58, 1);
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 1);
                    visibility: hidden;
                }
                span {
                    margin-left: 12px;
                    font-size: 14px;
                    font-weight: 400;
                    color: rgba(111, 116, 128, 1);
                }
            }
        }
    }

    .video-list-header {
        margin-bottom: 10px;
        margin-top: 4px;
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        .group-video-info {
            display: flex;
            div {
                margin-left: 10px;
                padding: 0px 10px;
                height: 20px;
                line-height: 20px;
                background: #3E495E;
                border-radius: 10px;
                font-size: 14px;
                color: #FFFFFF;
                span {
                    margin-right: 20px;
                }
            }
        }
        .el-button {
            margin-right: 10px;
        }
    }

    // 视频分组
    .group-container {
        ul {
            padding-bottom: 20px;
            display: flex;
            flex-wrap: nowrap;
            overflow: scroll;
            li {
                margin-right: 10px;
                &.current-group {
                    .header-box {
                        label, span {
                            color: #fff;
                        }
                    }
                    .content-box {
                        padding-bottom: 10px;
                        background: #0062C4;
                        &:hover {
                            background: #0062C4;
                        }
                        .name-box {
                            label {
                                color: #FFFFFF;
                            }
                            span {
                                visibility: visible;
                            }
                        }
                        .no-box {
                            margin-bottom: 5px;
                            label {
                                color: #A3D0FD;
                            }
                            span {
                                visibility: visible;
                                .svg-icon {
                                    fill: #A3D0FD;
                                }
                            }
                        }
                        .duration-box {
                            display: block;
                            text-align: left;
                            label {
                                text-align: left;
                                color: #A3D0FD;
                            }
                        }
                    }
                }
                .header-box {
                    margin-bottom: 10px;
                    display: flex;
                    justify-content: space-between;
                    label {
                        padding: 2px 6px;
                        font-size: 14px;
                        color: #6F7480;
                        background: #252D3F;
                        border-radius: 10px;
                    }
                    span {
                        padding: 2px 8px;
                        font-size: 14px;
                        color: #6F7480;
                        background: #252D3F;
                        border-radius: 10px;
                    }
                }
                .content-box {
                    width: 200px;
                    height: auto;
                    padding: 10px 10px 15px 10px;
                    background: #252D3F;
                    border-radius: 8px;
                    cursor: pointer;
                    &:hover {
                        background: #2E384D;
                        .name-box {
                            span {
                                visibility: visible;
                            }
                        }
                        .no-box {
                            span {
                                visibility: visible;
                            }
                        }
                    }
                    p {
                        height: 20px;
                        line-height: 20px;
                        display: flex;
                        justify-content: space-between;
                        cursor: pointer;
                        label {
                            cursor: pointer;
                        }
                        &.name-box {
                            margin-bottom: 15px;
                            label {
                                width: 145px;
                                font-size: 14px;
                                color: #A8ABB3;
                                text-align: left;
                            }
                            span {
                                visibility: hidden;
                                i {
                                    font-size: 16px;
                                    color: #C35757;
                                    cursor: pointer;
                                }
                            }
                        }
                        &.no-box {
                            label {
                                font-size: 14px;
                                color: #6F7480;
                            }
                            span {
                                visibility: hidden;
                                cursor: pointer;
                                .svg-icon {
                                    width: 13px !important;
                                    height: 18px !important;
                                    fill: #1989FA;
                                }
                            }
                        }
                        &.duration-box {
                            display: none;
                        }
                    }
                }
            }
        }
    }

    .data-show {
        padding: 2px 6px;
        margin-left: 30px;
        font-size: 14px;
        color: #A8ABB3;
        background: #252D3F;
        border-radius: 10px;
    }

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
        padding-bottom: 32px;
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
            height: 235px;
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
                        &.is-common {
                            color: #3AC26F;
                        }
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
        &.video-block-title {
            display: flex;
            align-items: center;
            .title {
                padding-bottom: 7px;
                text-align: center;
                width: 80px;
                font-size: 16px !important;
                font-weight: 400;
                color: rgba(168, 171, 179, 1);
                border-bottom: 1px solid transparent;
                cursor: pointer;
                &:first-child {
                    margin-right: 30px;
                }
                &:hover {
                    color: rgba(255, 255, 255, 1);
                }
                &.active {
                    color: rgba(255, 255, 255, 1);
                    border-bottom: 1px solid #1989FA;
                }
            }
        }
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

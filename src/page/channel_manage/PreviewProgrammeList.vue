<!-- 直播节目列表组件 -->
<template>
    <div id="page-container">
        <div id="title-block">
            <label>直播节目单</label>
            <el-button
                @click="gotoBlankPage('LiveChannelImport')"
                class="btn-style-two contain-svg-icon">
                <svg-icon icon-class="upload_playbill"></svg-icon>
                节目单
            </el-button>
        </div>
        <div id="programme-container">
            <!-- 频道 -->
            <div id="channel-block">
                <div id="current-channel">{{currentChannel.no}} {{currentChannel.name}}</div>
                <div id="channel-list">
                    <div v-for="(item, index) in channelList" :key="index"
                         :class="{'active':item.id === currentChannel.id}"
                         @click="selectChannel(item, index)">
                        <span>{{item.no}} {{item.name}}</span>
                        <label v-if="item.hasChannelProgramme" @click="downloadProgramme(item)">
                            <svg-icon icon-class="download_video"></svg-icon>
                            <i>节目单</i>
                        </label>
                    </div>
                </div>
            </div>
            <!-- 节目单 -->
            <div id="programme-block">
                <div id="empty-notice" v-if="!currentChannel.hasChannelProgramme">
                    <div class="no-date">暂无日期</div>
                    <div class="no-programme">
                        <svg-icon icon-class="no_programme"></svg-icon>
                        <label>暂无节目单</label>
                    </div>
                </div>
                <div id="date-list" v-if="currentChannel.hasChannelProgramme">
                    <!--<div :class="{'active':currentProgrammeIndex === index}"-->
                    <!--class="date-block"-->
                    <!--v-for="(item, index) in programmeList"-->
                    <!--:key="item.date"-->
                    <!--v-if="item.programmeList.length > 0"-->
                    <!--@click="currentProgrammeIndex = index">-->
                    <!--<label>{{item.name}}</label>-->
                    <!--<label>{{item.date}}</label>-->
                    <!--</div>-->
                    <div id="carousel-block">
                        <div class="device-pre" @click="clickPreButton">
                            <svg-icon icon-class="device_pre"></svg-icon>
                            <svg-icon icon-class="device_pre_active"></svg-icon>
                        </div>
                        <carousel :per-page="10"
                                  navigationPrevLabel="navigationPrevLabel"
                                  :paginationEnabled="false"
                                  :navigationEnabled="true">
                            <slide :class="{'active':currentProgrammeIndex === index}"
                                   v-for="(item, index) in programmeList"
                                   :key="item.date"
                                   v-if="item.programmeList.length > 0">
                                <div class="slide-content" @click="currentProgrammeIndex = index">
                                    <label>{{item.name}}</label>
                                    <label>{{item.date}}</label>
                                </div>
                            </slide>
                        </carousel>
                        <div class="device-next" @click="clickNextButton">
                            <svg-icon icon-class="device_next"></svg-icon>
                            <svg-icon icon-class="device_next_active"></svg-icon>
                        </div>
                    </div>
                </div>
                <div id="programme-list" v-if="currentChannel.hasChannelProgramme">
                    <div class="programme-item"
                         v-for="programme in programmeList[currentProgrammeIndex].programmeList"
                         :key="programme.id">
                        <label class="time">{{programme.startTime | formatDate('HH:mm:SS')}}-{{programme.endTime |
                            formatDate('HH:mm:SS')}}</label>
                        <span class="name">{{programme.name}}</span>
                        <i class="living" v-if="isOnPlay(programme)">直播中</i>
                        <i class="delay" v-if="programme.startTime > new Date().getTime()">未开始</i>
                        <div class="record-block" v-if="programme.endTime < new Date().getTime()">
                            <label>回看</label>
                            <div class="operate-block">
                                <!-- 预览 -->
                                <i @click="previewChannel(programme)">
                                    <svg-icon icon-class="channel_video_play"></svg-icon>
                                </i>
                                <!-- 复制 -->
                                <i @click="copyUrl(programme.m3u8Uri)">
                                    <svg-icon icon-class="copy_btn"></svg-icon>
                                </i>
                                <!-- 显示 -->
                                <i v-if="!programme.enableLookBack" @click="switchLookBack(programme, true)">
                                    <svg-icon icon-class="eyeclose"></svg-icon>
                                </i>
                                <!-- 隐藏 -->
                                <i v-else @click="switchLookBack(programme, false)">
                                    <svg-icon icon-class="eyeopen"></svg-icon>
                                </i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <display-video-dialog
            :url="previewVideoInfo.url"
            :title="previewVideoInfo.title"
            ref="displayVideoDialog"
            :displayVideoDialogVisible="previewVideoInfo.visible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
    </div>
</template>

<script>
    import DisplayVideoDialog from 'sysComponents/custom_components/custom/DisplayVideoDialog';
    import {Carousel, Slide} from 'vue-carousel';

    const X2JS = require('../../assets/js/xml2json.min'); // eslint-disable-line
    const x2js = new X2JS();

    export default {
        name: 'PreviewProgrammeList',
        components: {
            DisplayVideoDialog,
            Carousel,
            Slide
        },
        data() {
            return {
                currentChannel: {},
                channelList: [],
                programmeList: [{programmeList: []}],
                currentProgrammeIndex: 0,
                previewVideoInfo: {
                    url: '',
                    title: '',
                    visible: false
                }
            };
        },
        filters: {
            fixNumber(index) {
                if (index < 10) {
                    return '00' + index;
                } else if (index < 100) {
                    return '0' + index;
                } else {
                    return index;
                }
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            clickPreButton() {
                this.$el.querySelector('#carousel-block .VueCarousel-navigation-prev').click();
            },
            clickNextButton() {
                this.$el.querySelector('#carousel-block .VueCarousel-navigation-next').click();
            },
            init() {
                this.getChannelProgramme(this.$route.params.id);
                this.$service.getChannelList({
                    pageNum: 0,
                    pageSize: 10000,
                    category: 'LIVE'
                }).then(response => {
                    if (response && response.code === 0) {
                        this.channelList = response.data.list;
                        for (let i = 0; i < this.channelList.length; i++) {
                            if (this.channelList[i].id === this.$route.params.id) {
                                this.currentChannel = this.channelList[i];
                                this.currentChannel.index = i;
                            }
                        }
                    }
                });
            },
            isOnPlay(programme) {
                let time = new Date().getTime();
                return (time > programme.startTime) && (time < programme.endTime);
            },
            copyUrl(url) {
                try {
                    this.$util.clipboardCopy(url);
                    this.$message.success('复制成功');
                } catch (err) {
                    console.log(err);
                    this.$message.error('复制失败');
                }
            },
            gotoBlankPage(name) {
                let routeData = this.$router.resolve({name});
                window.open(routeData.href, '_blank');
            },
            getChannelProgramme(id) {
                this.$service.getChannelPageById(id).then((res) => {
                    if (res && res.code === 0) {
                        this.programmeList = res.data;
                    }
                });
            },
            // 选择频道
            selectChannel(channel, index) {
                this.currentChannel = channel;
                this.currentChannel.index = index;
                this.currentProgrammeIndex = 0;
                this.getChannelProgramme(this.currentChannel.id);
            },
            previewChannel(programme) {
                this.previewVideoInfo.url = programme.m3u8Uri;
                this.previewVideoInfo.title = programme.name;
                this.previewVideoInfo.visible = true;
                this.$refs.displayVideoDialog.showDialog();
            },
            switchLookBack(programme, lookBack) {
                let message = '';
                if (lookBack) {
                    message = '取消隐藏后 TV 端将恢复该回看内容。\n' + '确定要取消隐藏《' + programme.name + '》的回看内容吗？';
                } else {
                    message = '隐藏后 TV 端将无法观看该回看内容。\n' + '确定要隐藏《' + programme.name + '》的回看内容吗？';
                }
                this.$confirm(message, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$service.switchLiveChannelLookbBack({id: programme.id, enable: lookBack}).then(res => {
                        if (res && res.code === 0) {
                            this.$message.success('设置回看成功');
                            this.getChannelProgramme(this.currentChannel.id);
                        }
                    });
                });
            },
            timeStampFormat(seconds) {
                let date = new Date(seconds);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let minute = date.getMinutes();
                let second = date.getSeconds();
                return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            },
            openDownloadDialog(url, saveName) {
                if (typeof url === 'object' && url instanceof Blob) {
                    url = URL.createObjectURL(url); // 创建blob地址
                }
                let aLink = document.createElement('a');
                aLink.href = url;
                aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
                let event;
                if (window.MouseEvent) {
                    event = new MouseEvent('click');
                } else {
                    event = document.createEvent('MouseEvents');
                    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                }
                aLink.dispatchEvent(event);
            },
            downloadProgramme(item) {
                this.$service.getChannelPageById(item.id).then((res) => {
                    if (res && res.code === 0) {
                        let data = res.data.map((item) => {
                            item.startTime = this.timeStampFormat(item.startTime);
                            item.endTime = this.timeStampFormat(item.endTime);
                            return item;
                        });
                        let xml = x2js.json2xml_str({'频道': {'节目': data}});
                        let blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>', xml], {type: 'application/xml'});
                        this.openDownloadDialog(blob, item.name + `直播频道节目单.xml`);
                    }
                });
            }
        }
    };
</script>

<style lang="scss">

    #carousel-block {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        .VueCarousel {
            padding-left: 40px;
            padding-right: 40px;
            width: 100%;
            .VueCarousel-slide {
                margin-right: 28px;
                border-bottom: 1px solid transparent;
                width: 80px;
                flex-basis: auto;
                cursor: pointer;
                &.active {
                    border-bottom: 1px solid #1989FA;
                }
                .slide-content {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                    padding-bottom: 6px;
                }
                label {
                    font-size: 12px;
                    font-weight: 400;
                    color: #FFFFFF;
                    cursor: pointer;
                }
            }
        }
        /* 轮播导航 */
        .device-pre {
            position: absolute;
            top: 20px;
            left: 14px;
            width: 8px;
            height: 16px;
            cursor: pointer;
            z-index: 1000;
            &:hover {
                .svg-icon-device_pre {
                    display: none;
                }
                .svg-icon-device_pre_active {
                    display: block;
                }
            }
            .svg-icon {
                width: 8px;
                height: 16px;
            }
            .svg-icon-device_pre {
                display: block;
            }
            .svg-icon-device_pre_active {
                display: none;
            }
        }
        .device-next {
            position: absolute;
            top: 20px;
            right: 10px;
            width: 8px;
            height: 16px;
            cursor: pointer;
            z-index: 1000;
            &:hover {
                .svg-icon-device_next {
                    display: none;
                }
                .svg-icon-device_next_active {
                    display: block;
                }
            }
            .svg-icon {
                width: 8px;
                height: 16px;
            }
            .svg-icon-device_next {
                display: block;
            }
            .svg-icon-device_next_active {
                display: none;
            }
        }
    }

</style>

<style scoped lang="scss">

    #page-container {
        display: flex;
        flex-direction: column;
        padding-bottom: 40px;
        max-height: 100%;
        width: 100%;
    }

    #title-block {
        flex-shrink: 0;
        flex-grow: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 15px;
        border-bottom: 1px solid #252D3F;
        label {
            font-size: 20px;
            font-weight: 400;
            color: rgba(168, 171, 179, 1);
        }
    }

    #programme-container {
        display: flex;
        flex-direction: row;
        flex-shrink: 1;
        flex-grow: 1;
        width: 100%;
    }

    #channel-block {
        display: flex;
        flex-direction: column;
        width: 310px;
        flex-shrink: 0;
        flex-grow: 0;
    }

    #programme-block {
        display: flex;
        flex-direction: column;
        flex-shrink: 1;
        flex-grow: 1;
        overflow: hidden;
    }

    /* 节目单 */
    #programme-list {
        margin-left: 24px;
        display: flex;
        flex-direction: column;
        flex-shrink: 1;
        flex-grow: 1;
        overflow: scroll;
        .programme-item {
            display: flex;
            align-items: center;
            height: 50px;
            border-bottom: 1px solid #252D3F;
            .time {
                margin-right: 112px;
                margin-left: 18px;
                font-size: 14px;
                font-weight: 400;
                color: rgba(111, 116, 128, 1);
            }
            .name {
                text-align: left;
                width: 310px;
                font-size: 14px;
                font-weight: 400;
                color: rgba(111, 116, 128, 1);
            }
            .living {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-left: 30px;
                width: 48px;
                height: 20px;
                background: rgba(103, 194, 58, 1);
                border-radius: 4px;
                font-size: 12px;
                font-weight: 400;
                color: rgba(255, 255, 255, 1);
            }
            .delay {
                margin-left: 30px;
                font-size: 12px;
                font-weight: 400;
                color: rgba(111, 116, 128, 1);
            }
            .record-block {
                display: flex;
                align-items: center;
                label {
                    margin-right: 6px;
                    font-size: 12px;
                    font-weight: 400;
                    color: #6F7480;
                }
                .operate-block {
                    padding: 0 16px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 94px;
                    height: 20px;
                    background: rgba(41, 53, 80, 1);
                    border-radius: 4px;
                    i {
                        cursor: pointer;
                    }
                }
            }
        }
    }

    /* 时间 */
    #date-list {
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        flex-shrink: 0;
        flex-grow: 0;
        height: 72px;
        width: 100%;
        border-bottom: 1px solid #252D3F;
        /*overflow-x: scroll;*/
        div.date-block {
            margin: 10px 23px 7px 0;
            flex-shrink: 0;
            flex-grow: 0;
            padding-bottom: 5px;
            width: 80px;
            height: 43px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid transparent;
            cursor: pointer;
            &:first-child {
                margin-left: 10px;
            }
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
            }
        }
    }

    /* 当前频道 */
    #current-channel {
        padding-left: 10px;
        display: flex;
        align-items: center;
        margin: 10px 0;
        height: 40px;
        border-right: 1px solid #252D3F;
        font-size: 18px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        flex-grow: 0;
        flex-shrink: 0;
    }

    /* 频道列表 */
    #channel-list {
        flex-grow: 1;
        flex-shrink: 1;
        overflow: scroll;
        border-right: 1px solid #252D3F;
        div {
            margin-right: 24px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: pointer;
            border-bottom: 1px solid #252D3F;
            &.active {
                border-bottom: 1px solid #1989FA;
                span {
                    color: rgba(255, 255, 255, 1);
                }
                label {
                    visibility: visible;
                }
            }
            &:hover {
                span {
                    color: rgba(255, 255, 255, 1);
                }
                label {
                    visibility: visible;
                }
            }
            span {
                font-size: 14px;
                font-weight: 400;
                color: rgba(111, 116, 128, 1);
            }
            label {
                visibility: hidden;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 61px;
                height: 20px;
                background: rgba(0, 98, 196, 1);
                border-radius: 10px;
                cursor: pointer;
                i {
                    font-size: 12px;
                    font-weight: 400;
                    color: rgba(163, 208, 253, 1);
                }
                .svg-icon {
                    height: 10px;
                    width: 10px;
                    margin-right: 2px;
                }
            }
        }
    }

    #empty-notice {
        display: flex;
        flex-direction: column;
        align-items: center;
        .no-date {
            width: 100%;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 400;
            color: rgba(111, 116, 128, 1);
            border-bottom: 1px solid #252D3F;
        }
        .no-programme {
            margin-top: 250px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .svg-icon {
                margin-bottom: 16px;
                width: 118px;
                height: 150px;
            }
            label {
                font-size: 12px;
                font-weight: 400;
                color: rgba(111, 116, 128, 1);
            }
        }
    }

</style>

<!--预览节目列表组件-->
<template>
    <div class="preview-channel-programme-list-container">
        <h2 class="content-title">{{channelName}}</h2>
        <div class="seperator-line"></div>
        <div class="content">
            <el-row>
                <el-col class="float-left" :span="11">
                    <el-collapse id="prevContainer" @change="prevHandleChange" accordion>
                        <el-collapse-item v-for="(item, key, index) in prevObj" :key="index" :name="index">
                            <template slot="title">
                                <span class="title">{{key}}</span>
                            </template>
                            <ul class="item-list">
                                <li v-for="(ele, index) in item" :key="index" class="item-li">
                                    <div class="wrapper">
                                        <span class="time-name">{{ele.startTime}} - {{ele.endTime}} {{ele.name}}</span>
                                        <div class="btn-wrapper">
                                            <div v-if="ele.m3u8Uri" class="url-wrapper">
                                                <span class="text-primary url"
                                                      @click="displayVideoPlayer(ele, 'm3u8Uri')">模拟源</span>
                                                <svg-icon
                                                    v-if="ele.m3u8Uri"
                                                    icon-class="copy_btn"
                                                    class-name="copy-btn pointer"
                                                    :data-clipboard-text="getVideoUrl(ele.m3u8Uri, 'm3u8Uri')">
                                                </svg-icon>
                                            </div>
                                            <div v-if="ele.playUri" class="url-wrapper">
                                                <span class="text-primary url"
                                                      @click="displayVideoPlayer(ele, 'playUri')">回看</span>
                                                <svg-icon
                                                    v-if="ele.playUri"
                                                    icon-class="copy_btn"
                                                    class-name="copy-btn pointer"
                                                    :data-clipboard-text="getVideoUrl(ele.playUri, 'playUri')">
                                                </svg-icon>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </el-collapse-item>
                    </el-collapse>
                </el-col>
                <el-col class="float-right" :span="11">
                    <el-collapse id="afterContainer" @change="afterHandleChange" accordion>
                        <el-collapse-item v-for="(item, key, index) in afterObj" :key="index" :name="index">
                            <template slot="title">
                                <span class="title">{{key}}</span>
                            </template>
                            <ul class="item-list">
                                <li v-for="(ele, index) in item" :key="index" class="item-li">
                                    <div class="wrapper">
                                        <span class="time-name">{{ele.startTime}} - {{ele.endTime}} {{ele.name}}</span>
                                        <div class="btn-wrapper">
                                            <div v-if="ele.m3u8Uri" class="url-wrapper">
                                                <span class="text-primary url"
                                                      @click="displayVideoPlayer(ele, 'm3u8Uri')">模拟源</span>
                                                <svg-icon
                                                    v-if="ele.m3u8Uri"
                                                    icon-class="copy_btn"
                                                    class-name="copy-btn pointer"
                                                    :data-clipboard-text="getVideoUrl(ele.m3u8Uri, 'm3u8Uri')">
                                                </svg-icon>
                                            </div>
                                            <div v-if="ele.playUri" class="url-wrapper">
                                                <span class="text-primary url"
                                                      @click="displayVideoPlayer(ele, 'playUri')">回看</span>
                                                <svg-icon
                                                    v-if="ele.playUri"
                                                    icon-class="copy_btn"
                                                    class-name="copy-btn pointer"
                                                    :data-clipboard-text="getVideoUrl(ele.playUri, 'playUri')">
                                                </svg-icon>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </el-collapse-item>
                    </el-collapse>
                </el-col>
            </el-row>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-three" @click="goBack" plain>返回列表</el-button>
        </div>
        <display-video-dialog ref="displayVideoDialog" :url="url" :title="title"></display-video-dialog>
    </div>
</template>
<script>
    import {mapActions} from 'vuex';
    import _ from 'lodash';
    import DisplayVideoDialog from '../../components/custom_components/custom/DisplayVideoDialog';

    const ClipboardJS = require('clipboard');

    export default {
        name: 'PreviewProgrammeList',
        components: {
            DisplayVideoDialog
        },
        data() {
            return {
                prevList: [],
                afterList: [],
                prevObj: {},
                afterObj: {},
                url: '',
                title: '',
                pushServer: '',
                serverGroup: '',
                urlPrefix: ''
            };
        },
        mounted() {
            this.initClipboard();
        },
        created() {
            let {id} = this.$route.params;
            this.getChannelPageById(id)
                .then((res) => {
                    if (res && res.code === 0) {
                        let prevList = [];
                        let afterList = [];
                        let today = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' 00:00:00';
                        let timeStamp = new Date(today).getTime();
                        res.data.forEach((item) => {
                            if (item.startTime < timeStamp) {
                                prevList.push(item);
                            } else {
                                afterList.push(item);
                            }
                        });
                        let prevObj = this.serializeDataByDate(prevList);
                        let afterObj = this.serializeDataByDate(afterList);
                        this.prevList = prevList;
                        this.afterList = afterList;
                        this.prevObj = prevObj;
                        this.afterObj = afterObj;

                        let allList = [...this.prevList, ...afterList];
                        if (allList.length > 0) {
                            let channelId = _.get(allList, '0.channelId');
                            if (channelId) {
                                this.getLiveChannelById(channelId)
                                    .then((channelRes) => {
                                        if (channelRes && channelRes.code === 0) {
                                            let {pushServer, serverGroup} = channelRes.data;
                                            this.pushServer = `http://${pushServer}`;
                                            this.serverGroup = serverGroup;

                                            this.$service.getLiveUrlPrefix()
                                                .then((urlRes) => {
                                                    if (urlRes && urlRes.code === 0) {
                                                        // console.log(urlRes.data);
                                                        this.urlPrefix = urlRes.data;
                                                    }
                                                });
                                        }
                                    });
                            }
                        }
                    }
                });
        },
        computed: {
            channelName() {
                let obj = this.prevList[0] || this.afterList[0];
                return obj ? obj.channelName : '';
            },
            baseUri() {
                let baseUri = window.localStorage.getItem('videoBaseUri');
                return baseUri;
            },
            getVideoUrl() {
                return (uri, uriKey) => {
                    let baseUri = window.localStorage.getItem('videoBaseUri');
                    return `${baseUri}${uri}`;
                };
            }
        },
        methods: {
            ...mapActions({
                getChannelPageById: 'channel/getChannelPageById',
                getLiveChannelById: 'channel/getLiveChannelById'
            }),
            initClipboard() {
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
            goBack() {
                this.$router.push({name: 'LiveChannelList'});
            },
            prevHandleChange(activeName) {
                let prevArrowList = document.querySelectorAll('#prevContainer .el-collapse-item__arrow.el-icon-arrow-right');
                let prevItemHeader = document.querySelectorAll('#prevContainer .el-collapse-item__header');
                let prevTitleList = document.querySelectorAll('#prevContainer .title');
                for (let i = 0; i < prevArrowList.length; i++) {
                    if (activeName === i) {
                        prevArrowList[i].style.color = '#1989FA';
                        prevItemHeader[i].style.borderBottom = '1px solid #3E495E';
                        prevTitleList[i].style.color = '#1989FA';
                    } else {
                        prevArrowList[i].style.color = '#A8ABB3';
                        prevItemHeader[i].style.borderBottom = 'none';
                        prevTitleList[i].style.color = '#A8ABB3';
                    }
                }
            },
            afterHandleChange(activeName) {
                let afterArrowList = document.querySelectorAll('#afterContainer .el-collapse-item__arrow.el-icon-arrow-right');
                let afterItemHeader = document.querySelectorAll('#afterContainer .el-collapse-item__header');
                let afterTitleList = document.querySelectorAll('#afterContainer .title');
                for (let i = 0; i < afterArrowList.length; i++) {
                    if (activeName === i) {
                        afterArrowList[i].style.color = '#1989FA';
                        afterItemHeader[i].style.borderBottom = '1px solid #3E495E';
                        afterTitleList[i].style.color = '#1989FA';
                    } else {
                        afterArrowList[i].style.color = '#A8ABB3';
                        afterItemHeader[i].style.borderBottom = 'none';
                        afterTitleList[i].style.color = '#A8ABB3';
                    }
                }
            },
            serializeDataByDate(list) {
                return list.map((item) => {
                    item.startTime = this.timeStampFormat(item.startTime);
                    item.endTime = this.timeStampFormat(item.endTime);
                    return item;
                }).reduce((res, curr) => {
                    let timeKey = curr.startTime.split(' ')[0];
                    if (res[timeKey]) {
                        res[timeKey].push(curr);
                    } else {
                        res[timeKey] = [];
                        res[timeKey].push(curr);
                    }
                    return res;
                }, {});
            },
            displayVideoPlayer(ele, uriKey) {
                let {m3u8Uri, name, playUri} = ele;
                if (uriKey === 'm3u8Uri') {
                    this.url = `${this.urlPrefix}/${this.serverGroup}${m3u8Uri}`;
                } else {
                    this.url = `${playUri}`;
                }
                this.title = name;
                this.$refs.displayVideoDialog.showDialog();
            }
        }
    };
</script>
<style scoped lang="scss">
    .content {
        margin-top: 20px;
    }

    .title, .time-name, .url {
        display: block;
        text-align: left;
    }

    .title {
        font-size: 18px;
        color: #A8ABB3;
        padding-left: 20px;
    }

    .time-name {
        font-size: 14px;
        line-height: 14px;
        padding: 10px 0 0 0;
        color: #A8ABB3;
    }

    .btn-wrapper {
        display: flex;
        padding: 10px 0;
        .url-wrapper {
            display: flex;
            align-content: center;
            margin-right: 20px;
            .url {
                font-size: 14px;
                line-height: 14px;
                cursor: pointer;
                margin-right: 5px;
            }
            .svg-icon {
                width: 14px;
                height: 14px;
            }
        }
    }
</style>
<style lang="scss">
    #prevContainer,
    #afterContainer {
        border-top: none;
        border-bottom: none;
        border-radius: 8px;
        overflow: hidden;
        .item-list {
            background: #2A3040;
            .item-li {
                padding: 0 20px 0 20px;
                .wrapper {
                    position: relative;
                    border-bottom: 1px solid #3E495E;
                    .play-btn {
                        position: absolute;
                        top: 50%;
                        transform: translateY(-50%);
                        right: 10px;
                        color: $mainColor;
                        cursor: pointer;
                    }
                }
                &:last-child {
                    .wrapper {
                        border-bottom: none;
                    }
                }
            }
        }
        .el-collapse-item {
            border-bottom: 1px solid #3E495E;
            &:last-child {
                border-bottom: none;
            }
            .el-collapse-item__header {
                background: #2A3040;
                border: none;
                .el-collapse-item__arrow {
                    color: rgb(168, 171, 179);
                }
            }
        }
    }

    .el-collapse-item__content {
        padding-bottom: 0;
    }

    .el-collapse-item__wrap {
        border-bottom: none;
    }
</style>

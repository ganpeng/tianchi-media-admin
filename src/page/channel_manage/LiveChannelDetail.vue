<template>
    <div class="live-channel-detail-container">
        <h2 class="content-title">直播频道详情</h2>
        <div class="seperator-line"></div>
        <div class="common-details">
            <div class="poster-section">
                <div class="visible-wrapper">
                    <span :class="['visible', liveChannel.visible ? 'is-visible' : 'dis-visible']">
                        {{liveChannel.visible ? '上架' : '下架'}}
                    </span>
                </div>
                <img :src="liveChannel.logoUri" alt="">
            </div>
            <div class="info-section">
                <div class="title-wrapper">
                    <div class="left-side">
                        <span class="title">{{liveChannel.no}} {{liveChannel.name}}</span>
                    </div>
                    <div class="right-wrapper">
                        <div class="btn-group-wrapper">
                            <el-dropdown
                                @command="programmePageOperator($event)" placement="bottom">
                                <el-button class="btn-style-two contain-svg-icon">
                                    <svg-icon icon-class="check_playbill"></svg-icon>
                                    节目单
                                    <svg-icon icon-class="arrow_down"></svg-icon>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="DOWNLOAD">下载节目单</el-dropdown-item>
                                    <el-dropdown-item command="PREVIEW">预览节目单</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </div>
                        <div class="date">
                            <span class="create-date">
                                创建于{{liveChannel.createdAt | formatDate('yyyy.MM.DD')}}
                            </span>
                            <span class="update-date">
                                更新于{{liveChannel.updatedAt | formatDate('yyyy.MM.DD')}}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="seperator-line"></div>
                <div class="tags-section">
                    <span v-for="(item) in liveChannel.typeList" :key="item.id" class="category-tag">
                        {{item.name}}
                    </span>
                </div>
                <div class="text-info-section">
                    <ul class="text-info">
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">内部名称：</span>
                                <span class="value">{{liveChannel.innerName}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">所属组：</span>
                                <span class="value">{{liveChannel.serverGroup}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">组播地址：</span>
                                <span class="value">{{liveChannel.multicastIp}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">公共频道：</span>
                                <span class="value">{{liveChannel.common ? '是' : '否'}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">组播端口：</span>
                                <span class="value">{{liveChannel.multicastPort}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">是否回看：</span>
                                <span class="value">{{liveChannel.record ? '是' : '否'}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">录制地址：</span>
                                <span class="value">{{liveChannel.recordIp}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">回看videoPid：</span>
                                <span class="value">{{liveChannel.videoPid ? liveChannel.videoPid : '无'}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">录制端口：</span>
                                <span class="value">{{liveChannel.recordPort}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">回看audioPid：</span>
                                <span class="value">{{liveChannel.audioPid ? liveChannel.audioPid : '无'}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">推流方式：</span>
                                <span class="value">{{liveChannel.protocolList ? liveChannel.protocolList.join(' ') : ''}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">会员：</span>
                                <span class="value">{{liveChannel.paymentType === 'VIP' ? '是' : '否' }}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">适用客户端：</span>
                                <span class="value">{{liveChannel.applicableClientList ? liveChannel.applicableClientList.join(', ') : ''}}</span>
                                <span class="label">服务器转码：</span>
                                <span class="value">{{liveChannel.transcode ? '是' : '否'}}</span></div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">转码音量设置：</span>
                                <span class="value">{{liveChannel.volume || '无'}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">直播audioPid：</span>
                                <span class="value">{{liveChannel.liveAudioPid ? liveChannel.liveAudioPid : '无'}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">直播videoPid：</span>
                                <span class="value">{{liveChannel.liveVideoPid ? liveChannel.liveVideoPid : '无'}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">视频转码：</span>
                                <span class="value">{{liveChannel.videoTranscode ? '是' : '否'}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">音频转码：</span>
                                <span class="value">{{liveChannel.audioTranscode ? '是' : '否'}}</span>
                            </div>
                        </li>
                        <li class="text-info-item">
                            <div class="text-info-item-wrapper">
                                <span class="label">使用直播配置：</span>
                                <span class="value">{{liveChannel.useLiveConfig ? '是' : '否'}}</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="seperator-line"></div>
        <div v-if="liveChannel.companyList.length > 0" class="area-container">
            <h4 class="content-sub-title">
                所属区域
                <span v-if="liveChannel.companyList.length > 0">{{liveChannel.companyList.length}}个</span>
                <span v-if="liveChannel.companyList.length <= 0" class="toggle-btn disabled">
                    展开<i class="el-icon-arrow-down el-icon--right my-arrow-icon"></i>
                </span>
                <span v-if="liveChannel.companyList.length > 0" @click="toggleClickHandler"
                      :class="['toggle-btn', showCompanyList ? 'is-active' : '']">
                    {{showCompanyList ? '收起' : '展开'}}
                    <i v-if="showCompanyList" class="el-icon-arrow-up el-icon--right my-arrow-icon"></i><i v-else
                                                                                                           class="el-icon-arrow-down el-icon--right my-arrow-icon"></i>
                </span>
            </h4>
            <ul v-if="showCompanyList" class="search-list clearfix">
                <li v-for="(item, index) in liveChannel.companyList" :key="index" :class="['search-item']">
                    <div class="wrapper">
                        <span class="index">{{index + 1}}</span>
                        <span class="search-name my-ellipsis">{{item.name}}</span>
                        <span v-if="item.name.length > 11" class="ellipsis-content">{{item.name}}</span>
                    </div>
                </li>
            </ul>
            <div v-if="liveChannel.companyList.length > 0" class="seperator-line"></div>
        </div>
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="editLiveChannel">编辑</el-button>
            <el-button class="btn-style-three" @click="goBack">返回列表</el-button>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex';

    const X2JS = require('../../assets/js/xml2json.min'); // eslint-disable-line
    const x2js = new X2JS();
    export default {
        name: 'LiveChannelDetail',
        data() {
            return {
                currentLiveChannel: {},
                showCompanyList: true
            };
        },
        computed: {
            ...mapGetters({
                liveChannel: 'channel/liveChannel',
                filialeList: 'channel/filialeList'
            })
        },
        mounted() {
            this.$util.toggleFixedBtnContainer();
        },
        async created() {
            try {
                let {id} = this.$route.params;
                if (id) {
                    await this.getLiveChannelById(id);
                    let res = await this.getChannelPageById(id);
                    if (res && res.code === 0) {
                        let timeStamp = new Date().getTime();
                        if (res.data && res.data.length > 0) {
                            let currentLiveChannel = res.data.find((item) => {
                                return item.startTime <= timeStamp && item.endTime >= timeStamp;
                            });
                            if (currentLiveChannel) {
                                this.currentLiveChannel = currentLiveChannel;
                            }
                        }
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        methods: {
            ...mapActions({
                getLiveChannelById: 'channel/getLiveChannelById',
                getChannelPageById: 'channel/getChannelPageById'
            }),
            editLiveChannel() {
                let {id} = this.$route.params;
                this.$router.push({name: 'EditLiveChannel', params: {id}});
            },
            goBack() {
                this.$router.push({name: 'LiveChannelList'});
            },
            toggleClickHandler() {
                this.showCompanyList = !this.showCompanyList;
            },
            programmePageOperator(command) {
                let {id, name} = this.liveChannel;
                if (command === 'DOWNLOAD') {
                    this.previewChannelPage(id, name, true);
                } else {
                    this.previewChannelPage(id);
                }
            },
            previewChannelPage(id, name, flag) {
                this.getChannelPageById(id)
                    .then((res) => {
                        if (res && res.code === 0) {
                            let data = res.data.map((item) => {
                                item.startTime = this.timeStampFormat(item.startTime);
                                item.endTime = this.timeStampFormat(item.endTime);
                                return item;
                            });
                            let xml = x2js.json2xml_str({'频道': {'节目': data}});
                            let blob = new Blob(['<?xml version="1.0" encoding="UTF-8"?>', xml], {type: 'application/xml'});
                            if (flag) {
                                this.openDownloadDialog(blob, `${name}.xml`);
                            } else {
                                if (res.data.length > 0) {
                                    this.$router.push({name: 'PreviewProgrammeList', params: {id}});
                                } else {
                                    this.$message.error('当前频道下没有节目单');
                                    return false;
                                }
                            }
                        }
                    });
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
            timeStampFormat(seconds) {
                let date = new Date(seconds);
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let minute = date.getMinutes();
                let second = date.getSeconds();
                return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            }
        }
    };
</script>
<style lang="scss" scoped>
    .poster-section {
        img {
            display: block;
            width: 200px;
            height: 200px;
            border: 1px solid #3E495E;
            border-radius: 8px;
            box-shadow: 2px 2px 5px 0 rgba(0, 0, 0, 0.5);
        }
    }

    .text-info {
        display: flex;
        flex-wrap: wrap;
        width: 80%;
        .text-info-item {
            width: 50%;
            font-size: 16px;
            line-height: 32px;
            color: #A8ABB3;
            .text-info-item-wrapper {
                display: flex;
                .label {
                    width: 120px;
                    text-align: right;
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

<!--广告详情组件-->
<template>
    <div>
        <div class="content-title">广告详情</div>
        <div class="seperator-line"></div>
        <!--专题题目-->
        <div class="detail-title-block">
            <div class="ad-status shelve" v-if="adInfo.visible">已上架</div>
            <div class="ad-status un-shelve" v-else>已下架</div>
            <div class="title">
                <label>{{adInfo.name}}</label>
                <span v-if="adInfo.adStatus === 'ACTIVE' && adInfo.visible"
                      class="status-normal">已生效</span>
                <span v-if="adInfo.adStatus === 'WAITING' && adInfo.visible"
                      class="status-deleting">未生效</span>
                <span v-if="adInfo.adStatus === 'EXPIRED' && adInfo.visible"
                      class="status-abnormal">已失效</span>
            </div>
            <div class="ad-time">
                <div>创建于{{adInfo.createdAt | formatDate('yyyy.MM.DD')}}</div>
                <div>更新于{{adInfo.updatedAt | formatDate('yyyy.MM.DD')}}</div>
            </div>
        </div>
        <!--相关信息-->
        <div class="about-ad">
            <svg-icon icon-class="ad_ads"></svg-icon>
            <div>
                <span class="ad-type">{{adInfo.adType | getADType}}</span>
                <ul v-if="adInfo.adType === 'PREPOSITION'">
                    <li v-for="(item, index) in adInfo.categoryList"
                        :key="index">
                        {{item.name}}
                    </li>
                </ul>
                <p>时间:
                    <span class="ad-effect-time">{{adInfo.applyDateBegin | formatDate('yyyy.MM.DD HH:mm:SS')}} - {{adInfo.applyDateEnd | formatDate('yyyy.MM.DD HH:mm:SS')}}</span>
                </p>
                <p>描述:
                    <span class="ad-info-desc">{{adInfo.desc}}</span>
                </p>
            </div>
        </div>
        <!--资源列表-->
        <div class="resource-list">
            <div class="content-sub-title">广告资源
                <span class="resource-list-count">{{adInfo.adMaterialList.length}}个</span>
            </div>
            <!--视频资源列表-->
            <div id="ad-video-resource"
                 v-if="adInfo.adMaterialList.length !== 0 && (adInfo.adType === 'BOOT' || adInfo.adType === 'PREPOSITION')">
                <div class="video-list">
                    <div class="ad-video-container"
                         v-for="(item, index) in adInfo.adMaterialList"
                         :key="index"
                         @click="previewVideoResource(item)">
                        <svg-icon icon-class="video-ad"></svg-icon>
                        <div class="resource-info">
                            <div>{{item.width}}*{{item.height}}</div>
                            <div>{{item.duration}}s&nbsp;&nbsp;&nbsp;&nbsp;
                                {{item.size | convertFileSize}}
                            </div>
                            <div class="ellipsis one">{{item.advertiserName}}</div>
                        </div>
                        <div class="ad-desc">
                            <div class="ellipsis one">{{item.name}}</div>
                        </div>
                    </div>
                </div>
                <ul>
                    <li><label>总时长</label><span>{{videoResourceDuration}}s</span></li>
                    <li><label>总体积</label><span>{{resourceSize | convertFileSize}}</span></li>
                    <li>
                        <label>广告主</label>
                        <span>
                            <div class="ad-owner"
                                 v-for="(item,index) in advertiserArray"
                                 :key="index">
                                {{item.advertiserName}}
                            </div>
                        </span>
                    </li>
                </ul>
            </div>
            <!--图片资源列表-->
            <div id="ad-image-resource"
                 v-if="adInfo.adMaterialList.length !== 0 && adInfo.adType !== 'BOOT' && adInfo.adType !== 'PREPOSITION'">
                <div class="image-list">
                    <div class="ad-image-container"
                         v-for="(item, index) in adInfo.adMaterialList"
                         :key="index"
                         @click.self="displayImage(index)"
                         :style="{'background-image': 'url(' + item.storageUri + ')'}">
                        <div class="image-cover" @click.self="displayImage(index)">
                            <svg-icon icon-class="ad_image"></svg-icon>
                            <div class="resource-info">
                                <div>{{item.width}}*{{item.height}}</div>
                                <div>{{item.size | convertFileSize}}</div>
                                <div class="ellipsis one">{{item.advertiserName}}</div>
                            </div>
                        </div>
                        <div class="ad-desc">
                            <div class="ellipsis one">{{item.name}}</div>
                            <div class="set-label" :title="setLabel(item.visitType)" v-if="setAdVisible(adInfo.adType)">{{setLabel(item.visitType)}}</div>
                            <div class="target-url" :title="targetUrl(item)" v-if="setAdVisible(adInfo.adType)">{{targetUrl(item)}}</div>
                        </div>
                    </div>
                </div>
                <ul :class="[setAdVisible(adInfo.adType) && 'set-ad']">
                    <li><label>总体积</label><span>{{resourceSize | convertFileSize}}</span></li>
                    <li>
                        <label>广告主</label>
                        <span>
                            <div class="ad-owner"
                                 v-for="(item,index) in adInfo.advertiserList"
                                 :key="index">
                                 {{item.name}}
                            </div>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
        <!--操作-->
        <div class="fixed-btn-container">
            <el-button
                v-if="adInfo.adStatus !== 'EXPIRED' && adInfo.visible"
                class="btn-style-two" type="primary" @click="editAD">
                编辑
            </el-button>
            <el-button class="btn-style-three" @click="toADList" plain>返回列表</el-button>
        </div>
        <display-video-dialog
            :url="url"
            :title="title"
            :displayVideoDialogVisible="displayVideoDialogVisible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
        <preview-multiple-images
            :previewMultipleImages="previewImage">
        </preview-multiple-images>
    </div>
</template>

<script>
    import DisplayVideoDialog from '../../video_manage/DisplayVideoDialog';
    import PreviewMultipleImages from 'sysComponents/custom_components/custom/PreviewMultipleImages';
    import _ from 'lodash';

    export default {
        name: 'ADDetail',
        components: {
            DisplayVideoDialog,
            PreviewMultipleImages
        },
        data() {
            return {
                url: '',
                title: '',
                displayVideoDialogVisible: false,
                adInfo: {
                    adMaterialList: []
                },
                previewImage: {
                    display: false,
                    autoplay: false,
                    activeIndex: 0,
                    list: []
                }
            };
        },
        filters: {
            getADType(adType) {
                switch (adType) {
                    case 'PROGRAMME_DETAIL':
                        return '详情广告';
                    case 'CHANNEL_SWITCH':
                        return '换台广告';
                    case 'VOLUME':
                        return '音量广告';
                    case 'SCREEN_SAVER':
                        return '屏保广告';
                    case 'BOOT':
                        return '开机广告';
                    case 'PREPOSITION':
                        return '片头广告';
                    case 'PAUSE':
                        return '暂停广告';
                    default:
                        return '';
                }
            }
        },
        mounted() {
            this.init();
        },
        computed: {
            resourceSize: function () {
                let size = 0;
                this.adInfo.adMaterialList.map(image => {
                    size = size + parseInt(image.size);
                });
                return size;
            },
            advertiserArray: function () {
                return _.uniqBy(this.adInfo.adMaterialList, 'advertiserName');
            },
            videoResourceDuration: function () {
                let duration = 0;
                this.adInfo.adMaterialList.map(video => {
                    duration = duration + parseInt(video.duration);
                });
                return duration;
            },
            setAdVisible() {
                return (adType) => {
                    return adType === 'PROGRAMME_DETAIL' ||
                        adType === 'SCREEN_SAVER';
                };
            },
            setLabel() {
                return (visitType) => {
                    switch (visitType) {
                        case 'LINK':
                            return '设置为网页';
                        case 'PROGRAMME':
                            return '设置为节目';
                        case 'VIP_BUY':
                            return '设置为会员购买';
                        default:
                            return '';
                    }
                };
            },
            targetUrl() {
                return (adMaterial) => {
                    let {visitType, targetUrl} = adMaterial;
                    switch (visitType) {
                        case 'LINK':
                            return targetUrl;
                        case 'PROGRAMME':
                            return targetUrl === null || targetUrl === '' ? '' : _.get(JSON.parse(targetUrl), 'name');
                        case 'VIP_BUY':
                            return '';
                        default:
                            return '';
                    }
                };
            }
        },
        methods: {
            init() {
                this.$util.toggleFixedBtnContainer();
                this.$service.getADDetail(this.$route.params.id).then(response => {
                    if (response && response.code === 0) {
                        this.adInfo = response.data;
                    }
                });
            },
            previewVideoResource() {
                this.displayVideoDialogVisible = true;
                this.url = this.adInfo.adMaterialList[0].storageUri;
                this.title = this.adInfo.adMaterialList[0].name;
            },
            editAD() {
                let routeName = '';
                switch (this.adInfo.adType) {
                    case 'PROGRAMME_DETAIL':
                        routeName = 'EditProgrammeDetailAD';
                        break;
                    case 'VOLUME':
                        routeName = 'EditVolumeAD';
                        break;
                    case 'SCREEN_SAVER':
                        routeName = 'EditScreenSaverAD';
                        break;
                    case 'BOOT':
                        routeName = 'EditBootAD';
                        break;
                    case 'CHANNEL_SWITCH':
                        routeName = 'EditChannelSwitchAD';
                        break;
                    default:
                        break;
                }
                this.$router.push({name: routeName, params: {id: this.adInfo.id}});
            },
            toADList() {
                this.$router.push({name: 'ADList'});
            },
            closeDisplayVideoDialog(status) {
                this.displayVideoDialogVisible = status;
            },
            // 放大预览图片
            displayImage(index) {
                this.previewImage.display = true;
                for (let i = 0; i < this.adInfo.adMaterialList.length; i++) {
                    this.adInfo.adMaterialList[i].uri = this.adInfo.adMaterialList[i].storageUri;
                }
                this.previewImage.list = this.adInfo.adMaterialList;
                this.previewImage.activeIndex = index;
            }
        }
    };
</script>

<style lang="scss" scoped>

    // 广告题目
    .detail-title-block {
        height: 50px;
        line-height: 50px;
        overflow: hidden;
        .ad-status {
            float: left;
            margin-left: 80px;
            margin-right: 90px;
            margin-top: 9px;
            height: 30px;
            width: 80px;
            line-height: 30px;
            border-radius: 8px;
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
                margin-top: 9px;
                margin-left: 30px;
            }
        }
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
    }

    // 相关信息
    .about-ad {
        position: relative;
        height: 204px;
        padding-bottom: 12px;
        border-bottom: 1px solid #252D3F;
        text-align: left;
        overflow: hidden;
        .svg-icon-ad_ads {
            position: absolute;
            top: 2px;
            left: 20px;
            height: 200px !important;
            width: 200px !important;
        }
        div {
            margin-left: 250px;
            border-top: 1px solid #252D3F;
            ul {
                margin-top: 20px;
                height: 30px;
                li {
                    float: left;
                    margin: 4px 10px 4px 0px;
                    padding: 0px 5px;
                    height: 20px;
                    line-height: 20px;
                    background: #2E384D;
                    border-radius: 4px;
                    font-size: 10px;
                    color: #FFFFFF;
                }
            }
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

    .resource-list {
        .resource-list-count {
            margin-left: 20px;
        }
    }

    /*视频资源展示*/
    #ad-video-resource {
        margin-bottom: 170px;
        margin-top: 20px;
        height: 152px;
        text-align: left;
        .video-list {
            display: flex;
            justify-content: left;
            flex-wrap: wrap;
        }
        .ad-video-container {
            position: relative;
            margin-left: 30px;
            margin-right: 22px;
            height: 100px;
            width: 170px;
            background: #2A3040;
            border: 1px solid #3E495E;
            border-radius: 8px;
            cursor: pointer;
            &:hover {
                background: rgba(41, 53, 80, 0.80);
                .svg-icon-video-ad {
                    fill-opacity: 1;
                }
                .resource-info {
                    visibility: visible;
                }
            }
            .svg-icon-video-ad {
                position: absolute;
                bottom: 10px;
                left: 10px;
                width: 30px !important;
                height: 30px !important;
                fill-opacity: 0.5;
            }
            .resource-info {
                visibility: hidden;
                margin-top: 8px;
                margin-left: 10px;
                div {
                    font-size: 12px;
                    color: #FFFFFF;
                }
            }
            .ad-desc {
                margin: 55px 10px 0px 10px;
                div {
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #A8ABB3;
                }
            }
        }
        ul {
            display: inline-block;
            margin-left: 30px;
            margin-top: 45px;
            padding-right: 25px;
            min-width: 170px;
            border: 1px solid #3E495E;
            border-radius: 8px;
            li {
                margin-left: 11px;
                margin-bottom: 10px;
                margin-top: 10px;
                height: 24px;
                line-height: 24px;
                label {
                    float: left;
                    margin-right: 34px;
                    width: 36px;
                    font-size: 12px;
                    color: #A8ABB3;
                }
                span {
                    float: left;
                    font-size: 12px;
                    color: #3AC26F;
                }
                .ad-owner {
                    font-size: 12px;
                    color: #A8ABB3;
                }
            }
        }
    }

    /*图片资源展示*/
    #ad-image-resource {
        margin-bottom: 170px;
        margin-top: 20px;
        height: 152px;
        text-align: left;
        .image-list {
            margin-left: 30px;
            display: flex;
            justify-content: left;
            flex-wrap: wrap;
        }
        .ad-image-container {
            position: relative;
            margin-right: 22px;
            margin-bottom: 20px;
            height: 100px;
            width: 170px;
            background: #2A3040;
            border: 1px solid #3E495E;
            border-radius: 8px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            cursor: zoom-in;
            &:hover {
                background: rgba(41, 53, 80, 0.80);
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                .image-cover {
                    visibility: visible;
                }
            }
            .image-cover {
                visibility: hidden;
                position: absolute;
                height: 100px;
                width: 170px;
                left: 0px;
                top: 0px;
                background: rgba(41, 53, 80, 0.80);
                border-radius: 7px;
                cursor: zoom-in;
                .svg-icon-ad_image {
                    position: absolute;
                    bottom: 10px;
                    left: 10px;
                    width: 30px !important;
                    height: 30px !important;
                    z-index: 1000;
                }
                .resource-info {
                    position: absolute;
                    left: 10px;
                    top: 8px;
                    div {
                        font-size: 12px;
                        color: #FFFFFF;
                    }
                }
            }
            .ad-desc {
                margin-top: 105px;
                cursor: default;
                div {
                    margin: 0px 10px;
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #A8ABB3;
                }
                .target-url,
                .set-label {
                    width: 100%;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                }
            }
        }
        ul {
            display: inline-block;
            margin-left: 30px;
            margin-top: 20px;
            min-width: 170px;
            padding-bottom: 10px;
            padding-right: 25px;
            border: 1px solid #3E495E;
            border-radius: 8px;
            &.set-ad {
                margin-top: 100px;
            }
            li {
                margin-left: 11px;
                margin-bottom: 15px;
                margin-top: 15px;
                height: 24px;
                line-height: 24px;
                label {
                    float: left;
                    margin-right: 34px;
                    width: 36px;
                    font-size: 12px;
                    color: #A8ABB3;
                }
                span {
                    float: left;
                    font-size: 12px;
                    color: #3AC26F;
                }
                .ad-owner {
                    font-size: 12px;
                    color: #A8ABB3;
                }
            }
        }
    }

</style>

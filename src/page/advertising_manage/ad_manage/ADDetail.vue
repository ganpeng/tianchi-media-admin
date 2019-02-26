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
                <span>{{adInfo.adType | getADType}}</span>
            </div>
            <div class="ad-time">
                <div>创建于{{adInfo.createdAt | formatDate('yyyy.MM.DD')}}</div>
                <div>更新于{{adInfo.updatedAt | formatDate('yyyy.MM.DD')}}</div>
            </div>
        </div>
        <!--相关信息-->
        <div class="about-ad">
            <div>
                <p>生效时间</p>
                <span>{{adInfo.applyDateBegin | formatDate('yyyy-MM-DD HH:mm:SS')}} - {{adInfo.applyDateEnd | formatDate('yyyy-MM-DD HH:mm:SS')}}</span>
                <p>广告状态</p>
                <span v-if="adInfo.adStatus === 'ACTIVE' && adInfo.visible"
                      class="status-normal">生效</span>
                <span
                    v-if="adInfo.adStatus === 'WAITING' && adInfo.visible"
                    class="status-deleting">未生效</span>
                <span v-if="!adInfo.visible">/</span>
                <p>资源数量</p>
                <span>{{adInfo.adMaterialList.length}}个</span>
                <p>广告描述</p>
                <span>{{adInfo.desc}}</span>
            </div>
        </div>
        <!--资源列表-->
        <div class="other-poster">
            <div class="content-sub-title">广告资源</div>
            <!--视频资源列表-->
            <div id="ad-video-resource"
                 v-if="adInfo.adMaterialList[0] && adInfo.adType === 'BOOT'">
                <div class="ad-video-container" @click="previewVideoResource">
                    <svg-icon icon-class="video-ad"></svg-icon>
                    <div class="ad-desc">
                        <div class="ellipsis one">{{adInfo.adMaterialList[0].name}}</div>
                        <div>{{adInfo.adMaterialList[0].width}}*{{adInfo.adMaterialList[0].height}}</div>
                        <div>{{adInfo.adMaterialList[0].duration}}s&nbsp;&nbsp;&nbsp;&nbsp;
                            {{adInfo.adMaterialList[0].size | convertFileSize}}
                        </div>
                        <div>{{adInfo.adMaterialList[0].advertiserName}}</div>
                    </div>
                </div>
                <ul>
                    <li><label>总时长</label><span>{{adInfo.adMaterialList[0].duration}}s</span></li>
                    <li><label>总体积</label><span>{{adInfo.adMaterialSize | convertFileSize}}</span></li>
                    <li>
                        <label>广告主</label>
                        <span class="ad-owner">{{adInfo.adMaterialList[0].advertiserName}}</span>
                    </li>
                </ul>
            </div>
            <!--图片资源列表-->
            <div id="ad-image-resource"
                 v-if="adInfo.adMaterialList.length !== 0 && adInfo.adType !== 'BOOT'">
                <div class="image-list">
                    <div class="ad-image-container"
                         v-for="(item, index) in adInfo.adMaterialList"
                         :key="index"
                         :style="{'background-image': 'url(' + item.storageUri + ')'}">
                        <div class="ad-desc">
                            <div>{{item.width}}*{{item.height}}</div>
                            <div>{{item.size | convertFileSize}}</div>
                            <div>{{item.advertiserName}}</div>
                        </div>
                    </div>
                </div>
                <ul>
                    <li><label>总体积</label><span>{{adInfo.adMaterialSize | convertFileSize}}</span></li>
                    <li>
                        <label>广告主</label>
                        <span>
                                <div class="ad-owner"
                                     v-for="(item,index) in adInfo.adMaterialList"
                                     :key="index">
                                      {{item.advertiserName}}
                                 </div>
                            </span>
                    </li>
                </ul>
            </div>
        </div>
        <!--操作-->
        <div class="fixed-btn-container">
            <el-button class="btn-style-two" type="primary" @click="editAD">编辑</el-button>
            <el-button class="btn-style-three" @click="toADList" plain>返回列表</el-button>
        </div>
        <display-video-dialog
            :url="url"
            :title="title"
            :displayVideoDialogVisible="displayVideoDialogVisible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
    </div>
</template>

<script>
    import DisplayVideoDialog from '../../video_manage/DisplayVideoDialog';

    export default {
        name: 'ADDetail',
        components: {
            DisplayVideoDialog
        },
        data() {
            return {
                url: '',
                title: '',
                displayVideoDialogVisible: false,
                adInfo: {
                    adMaterialList: []
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
                    default:
                        return '';
                }
            }
        },
        mounted() {
            this.init();
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
            margin-left: 30px;
            margin-right: 40px;
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
        padding-bottom: 12px;
        margin-left: 30px;
        border-bottom: 1px solid #252D3F;
        text-align: left;
        overflow: hidden;
        div {
            border-top: 1px solid #252D3F;
            p {
                margin-top: 20px;
                margin-bottom: 9px;
                font-size: 18px;
                color: #A8ABB3;
            }
            span {
                font-size: 14px;
                color: #A8ABB3;
            }
        }
    }

    /*视频资源展示*/
    #ad-video-resource {
        margin-bottom: 170px;
        margin-top: 20px;
        height: 152px;
        text-align: left;
        .ad-video-container {
            margin-left: 30px;
            margin-right: 22px;
            position: relative;
            height: 100px;
            width: 170px;
            background: #2A3040;
            border: 1px solid #3E495E;
            border-radius: 8px;
            cursor: pointer;
            &:hover {
                border: 1px solid #1989FA;
                i {
                    visibility: visible;
                }
                .svg-icon-video-ad {
                    fill-opacity: 1;
                }
            }
            .svg-icon-video-ad {
                margin-top: 25px;
                margin-left: 58px;
                width: 50px !important;
                height: 50px !important;
                fill-opacity: 0.5;
            }
            /*删除按钮*/
            i {
                position: absolute;
                top: 2px;
                right: 2px;
                font-size: 16px;
                color: #6F7480;
                cursor: pointer;
                visibility: hidden;
                &:hover {
                    color: #C35757;
                }
            }
            .ad-desc {
                margin-top: 30px;
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
            margin-top: 80px;
            padding-right: 25px;
            height: 100px;
            min-width: 170px;
            background: #2A3040;
            border: 1px solid #3E495E;
            border-radius: 8px;
            li {
                margin-left: 11px;
                margin-top: 10px;
                margin-bottom: 10px;
                height: 18px;
                label {
                    margin-right: 34px;
                    width: 36px;
                    font-size: 12px;
                    color: #A8ABB3;
                }
                span {
                    font-size: 12px;
                    color: #3AC26F;
                    &.ad-owner {
                        color: #A8ABB3;
                    }
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
            margin-right: 22px;
            margin-bottom: 80px;
            position: relative;
            height: 100px;
            width: 170px;
            background: #2A3040;
            border: 1px solid #3E495E;
            border-radius: 8px;
            cursor: pointer;
            &:hover {
                border: 1px solid #1989FA;
                i {
                    visibility: visible;
                }
            }
            /*删除按钮*/
            i {
                position: absolute;
                top: 2px;
                right: 2px;
                font-size: 16px;
                color: #6F7480;
                cursor: pointer;
                visibility: hidden;
                &:hover {
                    color: #C35757;
                }
            }
            .ad-desc {
                margin-top: 105px;
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
            margin-top: 20px;
            min-width: 170px;
            padding-bottom: 10px;
            padding-right: 25px;
            background: #2A3040;
            border: 1px solid #3E495E;
            border-radius: 8px;
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

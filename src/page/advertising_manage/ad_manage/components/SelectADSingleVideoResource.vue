<!--选择单个广告资源视频组件-->
<template>
    <div id="select-ad-video">
        <div class="item-container">
            <label class="item-name">广告主</label>
            <el-select
                v-model="adOwnerId"
                @change="getADResource"
                clearable
                placeholder="请选择广告主">
                <el-option
                    v-for="item in ownerOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
        </div>
        <el-radio-group
            v-model="resourceId"
            @change="setSelectedResource">
            <el-radio
                v-if="!!adOwnerId"
                :label="item.id"
                v-for="(item,index) in videoList"
                :key="index">
                <div class="video-box"
                     @click.self="previewVideo(item)">
                    <div @click="previewVideo(item)" class="icon-box">
                        <svg-icon icon-class="video-ad"></svg-icon>
                    </div>
                    <div class="ad-desc">
                        <div class="ellipsis one">{{item.name}}</div>
                        <div>{{item.width}}*{{item.height}}</div>
                        <div>{{item.duration}}s&nbsp;&nbsp;&nbsp;&nbsp;{{item.size | convertFileSize}}</div>
                    </div>
                </div>
            </el-radio>
        </el-radio-group>
        <display-video-dialog
            :url="url"
            :title="title"
            :displayVideoDialogVisible="displayVideoDialogVisible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
    </div>
</template>

<script>
    import DisplayVideoDialog from '../../../video_manage/DisplayVideoDialog';

    export default {
        name: 'SelectADVideoResource',
        components: {
            DisplayVideoDialog
        },
        props: {
            adType: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                url: '',
                title: '',
                displayVideoDialogVisible: false,
                resourceId: '',
                selectedResourceInfo: {},
                adOwnerId: '',
                ownerOptions: [],
                videoList: []
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$service.getAdvertisingOwnerList({pageSize: 1000, pageNum: 0}).then(response => {
                    if (response && response.code === 0) {
                        this.ownerOptions = response.data.list;
                    }
                });
            },
            getADResource() {
                if (this.adOwnerId) {
                    this.$service.getADOwnerResourceList({
                        advertiserId: this.adOwnerId,
                        adType: this.adType,
                        pageSize: 1000,
                        pageNum: 1
                    }).then(response => {
                        if (response && response.code === 0) {
                            this.videoList = response.data.list;
                        }
                    });
                } else {
                    this.videoList = [];
                }
            },
            // 设置选择的视频资源
            setSelectedResource() {
                for (let i = 0; i < this.videoList.length; i++) {
                    if (this.videoList[i].id === this.resourceId) {
                        this.selectedResourceInfo = this.videoList[i];
                    }
                }
            },
            previewVideo(video) {
                this.displayVideoDialogVisible = true;
                this.url = video.storageUri;
                this.title = video.name;
            },
            closeDisplayVideoDialog(status) {
                this.displayVideoDialogVisible = status;
            },
            getVideoArrayInfo() {
                if (!this.resourceId) {
                    this.$message.warning('请选择相应的视频资源');
                    return false;
                } else {
                    return [this.selectedResourceInfo];
                }
            }
        }
    };
</script>

<style lang="scss" scoped>

    #select-ad-video {
        text-align: left;
    }

    .item-container {
        margin-left: 40px;
        margin-top: 30px;
        text-align: left;
        .item-name {
            margin-right: 20px;
            font-size: 16px;
            color: #A8ABB3;
        }
    }

    .el-radio-group {
        padding-bottom: 50px;
        margin-left: 40px;
        overflow: hidden;
        .el-radio {
            float: left;
            margin-right: 40px;
            margin-top: 30px;
            & + .el-radio {
                margin-left: 0px;
            }
        }
        .video-box {
            height: 100px;
            width: 170px;
            background: #2A3040;
            border: 1px solid #3E495E;
            border-radius: 8px;
            cursor: pointer;
            overflow: visible;
            &:hover {
                border: 1px solid #1989FA;
                i {
                    visibility: visible;
                }
                .svg-icon-video-ad {
                    fill-opacity: 1;
                }
            }
            .icon-box {
                display: inline-block;
            }
            .svg-icon-video-ad {
                margin-top: 25px;
                margin-left: 58px;
                width: 50px !important;
                height: 50px !important;
                fill-opacity: 0.5;
            }
            .ad-desc {
                position: relative;
                top: 25px;
                div {
                    height: 20px;
                    line-height: 20px;
                    text-align: center;
                    font-size: 12px;
                    color: #A8ABB3;
                }
            }
        }
    }

</style>

<style lang="scss">

    #select-ad-video {
        .el-radio__input {
            position: absolute;
            top: 22px;
            left: 5px;
        }
    }

</style>

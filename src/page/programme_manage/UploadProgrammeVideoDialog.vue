<!-- 上传节目视频的弹窗组件 -->
<template>
    <el-dialog
        :title="title"
        :visible.sync="videoUploadDialogVisible"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <!-- 选择视频的表格 -->
        <el-dialog
            title="选择视频"
            width="80%"
            :visible.sync="selectVideoDialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
            <div class="video-list">
                <el-form :inline="true">
                    <el-form-item class="search">
                        <el-input
                            placeholder="搜索你想要的信息"
                            clearable
                            @input="searchInputHandler($event, 'name')"
                        >
                            <i slot="prefix" class="el-input__icon el-icon-search"></i>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="searchEnterHandler">搜索</el-button>
                    </el-form-item>
                </el-form>
                <video-table :status="'SUCCESS'" :hasRadio="true"></video-table>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="closeSelectVideoDialog">取 消</el-button>
                    <el-button type="primary" @click="selectVideoEnter">确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <el-form :model="video" :rules="uploadVideoRules" ref="uploadVideoForm" class="form-block" label-width="100px">
            <el-form-item label="选择视频">
                <el-button v-if="!readonly" type="primary" @click="selectVideo">选择</el-button>
            </el-form-item>
            <el-form-item label="视频ID">
                <el-input :value="video.commonId" disabled></el-input>
            </el-form-item>
            <el-form-item
                label="视频文件名">
                <el-input
                    :disabled="true"
                    :value="video.originName"
                ></el-input>
            </el-form-item>
            <el-form-item label="视频时长">
                <el-input
                    :value="duration(video.takeTimeInSec)"
                    :disabled="true"
                ></el-input>
            </el-form-item>
            <el-form-item label="视频清晰度">
                <el-tag type="info">HD_480</el-tag>
                <el-tag type="info">HD_720</el-tag>
                <el-tag type="info">HD_1080</el-tag>
            </el-form-item>
            <el-form-item
                ref="name"
                label="视频展示名"
                prop="name">
                <el-input
                    :disabled="readonly"
                    :value="video.name"
                    auto-complete="off"
                    :maxlength="30"
                    placeholder="请输入子集名称"
                    @input="inputHandler($event, 'name')"
                ></el-input>
            </el-form-item>
            <el-form-item label="视频简介" prop="description">
                <el-input
                    :disabled="readonly"
                    type="textarea"
                    :maxlength="50"
                    :autosize="{ minRows: 4, maxRows: 14}"
                    placeholder="请输入子集简介"
                    :value="video.description"
                    @input="inputHandler($event, 'description')"
                >
                </el-input>
            </el-form-item>
            <el-form-item label="相关人物">
                <label for="figureList"></label>
                <person-select
                    :disabled="readonly"
                    :value="video.figureList"
                    :searchResult="video.figureListResult"
                    :changeSuccessHandler="figureListChangeHandler"
                    :searchSuccessHandler="figureListSuccessHandler"
                ></person-select>
            </el-form-item>
            <el-form-item label="内容类型" prop="type">
                <el-select
                    :disabled="readonly"
                    :value="video.type"
                    placeholder="请选择内容类型"
                    @input="inputHandler($event, 'type')"
                >
                    <el-option
                        v-for="item in videoType"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="视频封面图">
                <el-button v-if="!readonly" type="primary" @click="uploadImageHandler">上传封面图<i class="el-icon-upload el-icon--right"></i></el-button>
                <ul
                    v-if="video.coverImage"
                    class="cover-list">
                    <li>
                        <div
                            class="image-box"
                            :style="{'background-image': 'url(' + appendImagePrefix(video.coverImage.uri) + ')'}">
                        </div>
                    </li>
                </ul>
            </el-form-item>
            <el-form-item
                v-if="video.type === 'FEATURE'"
                :rules="(isTvPlay || isShow) ? [{ required: true, message: '请输入集数/期号', trigger: 'change' }] : []"
                label="集数/期号" prop="sort">
                <el-input
                    :disabled="readonly"
                    :value="video.sort"
                    min="1"
                    type="number"
                    placeholder="请输入集数/期号"
                    @input="inputHandler($event, 'sort')"
                ></el-input>
            </el-form-item>
            <el-form-item
                v-if="video.type !== 'FEATURE'"
                label="关联正片" prop="parentId">
                <el-select
                    :disabled="readonly"
                    :value="video.parentId"
                    placeholder="请选择要关联的正片"
                    @change="inputHandler($event, 'parentId')"
                >
                    <el-option
                        v-for="item in featureList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否付费" prop="free">
                <el-radio-group
                    :disabled="readonly"
                    :value="video.free"
                    @input="inputHandler($event, 'free')"
                >
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelHandler">取 消</el-button>
            <el-button
                v-if="videoStatus !== 2"
                type="primary"
                @click="successHandler"
                v-loading.fullscreen.lock="isLoading">确 定</el-button>
        </div>
        <upload-image
            title="上传节目图片"
            :size="size"
            :successHandler="setVideoCoverImage"
            :imageUploadDialogVisible="imageUploadDialogVisible"
            v-on:changeImageDialogStatus="closeImageDialog($event)">
        </upload-image>
    </el-dialog>
</template>
<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import role from '@/util/config/role';
    import dimension from '@/util/config/dimension';
    import UploadImage from 'sysComponents/custom_components/global/UploadImage';
    import VideoTable from '../video_manage/VideoTable';
    import PersonSelect from './PersonSelect';

    export default {
        props: {
            videoUploadDialogVisible: {
                type: Boolean,
                default: false
            },
            videoStatus: {
                type: Number,
                default: 0
            }
        },
        components: {
            UploadImage,
            VideoTable,
            PersonSelect
        },
        data() {
            return {
                isLoading: false,
                selectedVideo: false,
                videoType: role.VIDEO_TYPE,
                size: dimension.VIDEO_COVER_DIMENSION,
                imageUploadDialogVisible: false,
                selectVideoDialogVisible: false,
                uploadVideoRules: {
                    type: [{ required: true, message: '请选择视频内容类型' }]
                }
            };
        },
        computed: {
            ...mapGetters({
                // 新加
                video: 'programme/currentVideo',
                cacheSort: 'programme/cacheSort',
                isTvPlay: 'programme/isTvPlay',
                isShow: 'programme/isShow',
                isUnsavedVideo: 'programme/isUnsavedVideo',
                featureList: 'programme/featureList',
                videoListObj: 'video/video',
                checkVideoIsSelected: 'programme/checkVideoIsSelected',
                checkSortIsExist: 'programme/checkSortIsExist',
                checkSortIsLargeThanTotalSets: 'programme/checkSortIsLargeThanTotalSets'
            }),
            title() {
                switch (parseInt(this.videoStatus)) {
                    case 0:
                        return '创建视频';
                    case 1:
                        return '编辑视频';
                    case 2:
                        return '显示视频';
                    default:
                        return '创建视频';
                }
            },
            readonly() {
                return this.videoStatus === 2;
            },
            duration() {
                return (seconds) => {
                    return this.$util.fromSecondsToTime(seconds);
                };
            }
        },
        methods: {
            ...mapMutations({
                updateVideo: 'programme/updateVideo',
                setVideoCoverImage: 'programme/setVideoCoverImage',
                resetCurrentVideo: 'programme/resetCurrentVideo',
                addVideoToTempList: 'programme/addVideoToTempList',
                addVideoToList: 'programme/addVideoToList',
                syncVideoMetaData: 'programme/syncVideoMetaData',
                updateCurrentVideo: 'programme/updateCurrentVideo',
                setSelectedVideoId: 'video/setSelectedVideoId',
                updateSearchFields: 'video/updateSearchFields',
                // 更新人物
                updateVideoPersonResult: 'programme/updateVideoPersonResult',
                updateVideoPerson: 'programme/updateVideoPerson'
            }),
            ...mapActions({
                updateProgrammeVideoById: 'programme/updateProgrammeVideoById',
                getVideoList: 'video/getVideoList',
                getFeatureVideoList: 'programme/getFeatureVideoList'
            }),
            cancelHandler() {
                this.$emit('changeVideoDialogStatus', false);
                // 清楚校验的规则
                this.$refs.uploadVideoForm.clearValidate();
                this.resetCurrentVideo();
                this.updateSearchFields({key: 'status', value: null});
                this.updateSearchFields({key: 'videoType', value: null});
                this.setSelectedVideoId({id: ''});
            },
            successHandler() {
                this.$refs.uploadVideoForm.validate(value => {
                    if (value) {
                        let flag = !(this.videoStatus === 1 && parseInt(this.cacheSort) === parseInt(this.video.sort));
                        if (flag) {
                            if (this.checkSortIsExist) {
                                this.$message({
                                    type: 'error',
                                    message: '集数/期号已经存在，请重新输入'
                                });
                                return false;
                            }
                        }

                        if (this.checkSortIsLargeThanTotalSets) {
                            this.$message({
                                type: 'error',
                                message: '集数/期号不能大于总集数，请重新输入'
                            });
                            return false;
                        }
                        if (parseInt(this.videoStatus) !== 1) {
                            if (this.selectedVideo) {
                                this.addVideoToList();
                                this.cancelHandler();
                            } else {
                                this.$message({
                                    type: 'error',
                                    message: '请先选择视频'
                                });
                            }
                        } else {
                            if (this.isUnsavedVideo(this.video.id)) {
                                this.updateCurrentVideo({video: this.video});
                                this.cancelHandler();
                            } else {
                                this.updateProgrammeVideoById()
                                    .then((res) => {
                                        this.updateCurrentVideo({video: res.data});
                                        // 调这个接口的原因是更新完单个视频的时候要更新一下正片的列表
                                        this.getFeatureVideoList({id: this.$route.params.id, pageSize: 1000});
                                        this.cancelHandler();
                                    });
                            }
                        }

                        this.selectedVideo = false;
                    }
                });
            },
            inputHandler(value, key) {
                this.updateVideo({key, value});
            },
            searchInputHandler(value, key) {
                this.updateSearchFields({value, key});
            },
            searchEnterHandler() {
                this.getVideoList();
            },
            uploadImageHandler() {
                if (!this.readonly) {
                    this.imageUploadDialogVisible = true;
                }
            },
            closeImageDialog() {
                this.imageUploadDialogVisible = false;
            },
            closeSelectVideoDialog() {
                this.selectVideoDialogVisible = false;
            },
            selectVideo() {
                this.getVideoList();
                this.selectVideoDialogVisible = true;
            },
            getSelectedVideo() {
                let id = this.videoListObj.selectedVideoId;
                let videoList = this.videoListObj.list;
                let videoObj = videoList.find((item) => item.id === id);
                return videoObj;
            },
            selectVideoEnter() {
                let video = this.getSelectedVideo();
                let isSelected = this.checkVideoIsSelected(video);
                if (video) {
                    if (isSelected) {
                        this.$message({
                            type: 'error',
                            message: '视频已添加'
                        });
                    } else {
                        this.syncVideoMetaData({video});
                        this.closeSelectVideoDialog();
                        this.selectedVideo = true;
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: '视频选择失败'
                    });
                }
            },
            appendImagePrefix(uri) {
                let baseUri = window.localStorage.getItem('imageBaseUri');
                return baseUri + uri;
            },
            figureListChangeHandler(value) {
                this.updateVideoPerson({key: 'figureList', idList: value});
            },
            figureListSuccessHandler(list) {
                this.updateVideoPersonResult({key: 'figureListResult', value: list});
            }
        }
    };
</script>
<style lang="less" scoped>
</style>

<!-- 上传节目视频的弹窗组件 -->
<template>
    <el-dialog
        :title="title"
        class="my-dialog"
        :visible.sync="videoUploadDialogVisible"
        :show-close="true"
        @open="openDialogHandler"
        :before-close="beforeCloseHandler"
        :close-on-click-modal="false"
        :close-on-press-escape="false">
        <!-- 选择视频的表格 -->
        <el-dialog
            title="选择视频"
            class="my-dialog"
            width="80%"
            :visible.sync="selectVideoDialogVisible"
            :show-close="true"
            :before-close="closeSelectVideoDialog"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
            <div class="video-list">
                <el-form :inline="true" class="my-form" @submit.native.prevent>
                    <el-form-item class="search">
                        <el-input
                            placeholder="搜索你想要的信息"
                            clearable
                            class="border-input"
                            :value="videoListObj.searchFields.keyword"
                            @input="searchInputHandler($event, 'keyword')"
                        >
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" class="btn-style-one" @click="searchEnterHandler">搜索</el-button>
                    </el-form-item>
                </el-form>
                <video-table :status="'SUCCESS'"></video-table>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="closeSelectVideoDialog">取 消</el-button>
                    <el-button type="primary" @click="selectVideoEnter">确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <el-form :model="video" :rules="uploadVideoRules" ref="uploadVideoForm" class="form-block my-form" label-width="100px">
            <el-form-item v-if="!readonly" label="选择视频">
                <el-button class="btn-style-four min" type="primary" @click="selectVideo">选择</el-button>
            </el-form-item>
            <el-form-item label="视频ID">
                <span>{{video.storageVideoId}}</span>
            </el-form-item>
            <el-form-item label="视频文件名">
                <span>{{video.originName}}</span>
            </el-form-item>
            <el-form-item label="视频时长">
                <span>{{duration(video.takeTimeInSec)}}</span>
            </el-form-item>
            <el-form-item label="视频清晰度">
                <div class="my-tags">
                    <el-tag v-if="video.m3u8For480P" class="tag" type="info">HD_480</el-tag>
                    <el-tag v-if="video.m3u8For720P" class="tag" type="info">HD_720</el-tag>
                    <el-tag v-if="video.m3u8For1080P" class="tag" type="info">HD_1080</el-tag>
                    <el-tag v-if="video.m3u8For4K" class="tag" type="info">HD_4K</el-tag>
                </div>
            </el-form-item>
            <el-form-item
                ref="name"
                label="视频展示名"
                prop="name">
                <span v-if="readonly">{{video.name}}</span>
                <el-input
                    v-else
                    :value="video.name"
                    auto-complete="off"
                    placeholder="请输入子集名称"
                    @input="inputHandler($event, 'name')"
                ></el-input>
            </el-form-item>
            <el-form-item label="视频简介" prop="description">
                <span v-if="readonly">{{video.description}}</span>
                <el-input
                    v-else
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
                <div class="my-tags">
                    <draggable v-model="figureList">
                        <el-tag
                            :key="index"
                            v-for="(person, index) in figureList"
                            :closable="!readonly"
                            :disable-transitions="false"
                            @close="deleteFigureHandler(person.id)">
                            {{person.name}}
                        </el-tag>
                    </draggable>
                </div>
                <search-person
                    v-if="!readonly"
                    :handleSelect="selectFigureHandler"
                ></search-person>
            </el-form-item>
            <el-form-item label="内容类型" prop="type">
                <span v-if="readonly">{{getVideoType(video.type)}}</span>
                <el-select
                    v-else
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
            <el-form-item
                v-if="video.type === 'FEATURE' || video.type === 'PRE_SHOW'"
                :rules="(isTvPlay || isShow) ? [{ required: true, message: '请输入集数/期号' }, {pattern: /^\+?[1-9]\d*$/, message: '只能输入大于0的整数'}] : [{pattern: /^\+?[1-9]\d*$/, message: '只能输入大于0的整数'}]"
                label="集数/期号" prop="sort">
                <span v-if="readonly">{{video.sort}}</span>
                <el-input
                    v-else
                    :value="video.sort"
                    min="1"
                    type="number"
                    placeholder="请输入集数/期号"
                    @input="inputHandler($event, 'sort')"
                ></el-input>
            </el-form-item>
            <el-form-item
                v-if="video.type !== 'FEATURE'&& !readonly"
                label="关联正片" prop="parentId">
                <el-select
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
                <span v-if="readonly">{{video.free ? '是' : '否'}}</span>
                <span v-else>
                    <el-radio @input="inputHandler(true, 'free')" :value="video.free" :label="true">是</el-radio>
                    <el-radio @input="inputHandler(false, 'free')" :value="video.free" :label="false">否</el-radio>
                </span>
            </el-form-item>
            <el-form-item label="视频封面图">
                <single-poster
                    v-if="videoStatus === 2"
                    :img="video.coverImage"
                ></single-poster>
                <single-image-uploader
                    v-else
                    :uri="video.coverImage ? video.coverImage.uri : ''"
                    :deleteImage="deleteCoverImage"
                    :uploadSuccessHandler="uploadSuccessHandler"
                    :allowResolutions="[{width: 344, height: 194}, {width: 560, height: 315}]"
                ></single-image-uploader>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button size="medium" @click="cancelHandler">取 消</el-button>
            <el-button
                v-if="videoStatus !== 2"
                type="primary"
                @click="successHandler"
                v-loading.fullscreen.lock="isLoading">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import draggable from 'vuedraggable';
    import _ from 'lodash';
    import {mapGetters, mapMutations, mapActions} from 'vuex';
    import role from '@/util/config/role';
    import dimension from '@/util/config/dimension';
    import SinglePoster from 'sysComponents/custom_components/custom/SinglePoster';
    import VideoTable from './VideoTable';

    import SearchPerson from '../../components/custom_components/custom/SearchPerson';
    import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';

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
            SinglePoster,
            VideoTable,
            SearchPerson,
            draggable,
            SingleImageUploader
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
                        return '关联视频';
                    case 1:
                        return '编辑视频';
                    case 2:
                        return '显示视频';
                    default:
                        return '关联视频';
                }
            },
            readonly() {
                return this.videoStatus === 2;
            },
            duration() {
                return (seconds) => {
                    return this.$util.fromSecondsToTime(seconds);
                };
            },
            getVideoType() {
                return (type) => {
                    let obj = this.videoType.find((item) => item.value === type);
                    return _.get(obj, 'label');
                };
            },
            figureList: {
                get() {
                    return this.video.figureList;
                },
                set(value) {
                    this.updateVideo({key: 'figureList', value});
                }
            }
        },
        created() {
            window.addEventListener('keyup', this.keyupHandler);
        },
        beforeDestroy() {
            window.removeEventListener('keyup', this.keyupHandler);
        },
        methods: {
            ...mapMutations({
                updateVideo: 'programme/updateVideo',
                setVideoCoverImage: 'programme/setVideoCoverImage',
                resetCurrentVideo: 'programme/resetCurrentVideo',
                addVideoToList: 'programme/addVideoToList',
                syncVideoMetaData: 'programme/syncVideoMetaData',
                updateCurrentVideo: 'programme/updateCurrentVideo',
                setSelectedVideoId: 'video/setSelectedVideoId',
                updateSearchFields: 'video/updateSearchFields',
                // 更新人物
                updateVideoPerson: 'programme/updateVideoPerson',
                updatePagination: 'video/updatePagination',
                setList: 'video/setList',
                //  人物搜索
                addFigureToList: 'programme/addFigureToList',
                deleteFigureById: 'programme/deleteFigureById'
            }),
            ...mapActions({
                updateProgrammeVideoById: 'programme/updateProgrammeVideoById',
                getSuccessVideoList: 'video/getSuccessVideoList',
                getFeatureVideoList: 'programme/getFeatureVideoList'
            }),
            beforeCloseHandler() {
                this.cancelHandler();
            },
            keyupHandler(e) {
                if (e.keyCode === 13) {
                    this.getSuccessVideoList();
                }
            },
            openDialogHandler() {
                //  当弹窗打开的时候，先清除表单遗留的校验信息
                this.$nextTick(() => {
                    this.$refs.uploadVideoForm.clearValidate();
                });
            },
            cancelHandler() {
                this.$emit('changeVideoDialogStatus', false);
                // 清楚校验的规则
                this.$refs.uploadVideoForm.clearValidate();
                this.resetCurrentVideo();
                this.updateSearchFields({key: 'status', value: null});
                this.updateSearchFields({key: 'videoType', value: null});
                this.updateSearchFields({key: 'keyword', value: ''});
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
                                        if (res && res.code === 0) {
                                            this.updateCurrentVideo({video: res.data});
                                            // 调这个接口的原因是更新完单个视频的时候要更新一下正片的列表
                                            this.getFeatureVideoList({id: this.$route.params.id, pageSize: 1000});
                                            this.cancelHandler();
                                        } else {
                                            this.$message.error(res.message);
                                        }
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
                this.getSuccessVideoList();
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
                this.updateSearchFields({key: 'keyword', value: ''});
                this.updateSearchFields({key: 'status', value: ''});
            },
            selectVideo() {
                this.updateSearchFields({key: 'status', value: 'SUCCESS'});
                this.updatePagination({key: 'pageSize', value: 5});
                this.setList({list: []}); // 获取列表之前，先清空列表的缓存数据
                this.getSuccessVideoList();
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
                if (video) {
                    let isSelected = this.checkVideoIsSelected(video);
                    if (isSelected) {
                        this.$message({
                            type: 'error',
                            message: '视频已添加'
                        });
                    } else {
                        this.syncVideoMetaData({video});
                        this.closeSelectVideoDialog();
                        this.selectedVideo = true;
                        this.updateSearchFields({key: 'name', value: ''});
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: '请选择视频'
                    });
                }
            },
            appendImagePrefix(uri) {
                let baseUri = window.localStorage.getItem('imageBaseUri');
                return baseUri + uri;
            },
            //   视频关联人物的搜索部分开始
            selectFigureHandler(figure) {
                this.addFigureToList({figure});
            },
            deleteFigureHandler(id) {
                this.deleteFigureById({id});
            },
            //   视频关联人物的搜索部分结束
            //  视频图片相关操作开始
            uploadSuccessHandler(coverImage) {
                this.setVideoCoverImage({coverImage});
            },
            deleteCoverImage() {
                this.setVideoCoverImage({coverImage: null});
            }
            //  视频图片相关操作开始
        }
    };
</script>
<style lang="less" scoped>
.my-tags {
    .tag {
        cursor: default;
        &:hover {
            border-color: #2A3040;
        }
    }
}
</style>

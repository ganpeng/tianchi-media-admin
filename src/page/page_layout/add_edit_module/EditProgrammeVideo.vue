<!--  设置为节目内视频的弹窗 -->
<template>
    <div class="edit-programme-video-container">
        <el-dialog
            title="设置为节目内视频"
            class="my-dialog"
            width="80%"
            :visible.sync="dialogVisible"
            :show-close="true"
            :before-close="cancelHanlder"
            @open="dialogOpenHandler"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            :append-to-body="true">
            <div class="person-dialog-container">
                <div class="step-container">
                    <el-steps v-if="showExist" align-center class="my-steps" :active="active" finish-status="success">
                        <el-step title="选择视频"></el-step>
                        <el-step title="选择图片"></el-step>
                    </el-steps>
                    <el-steps v-else class="my-steps" align-center :active="active" finish-status="success">
                        <el-step title="选择节目"></el-step>
                        <el-step title="选择视频"></el-step>
                        <el-step title="选择图片"></el-step>
                    </el-steps>
                    <div class="seperator-line"></div>
                </div>
                <div v-show="active === 0" class="step-one">
                    <div v-if="showExist" class="exist-video-wrapper">
                        <p class="table-title">当前已选节目内包含的视频</p>
                        <el-table
                            class="my-table-style"
                            :data="getSquareProgrammeVideo"
                            border
                            :row-class-name="videoTableRowClassName"
                            header-row-class-name="common-table-header"
                            style="width: 100%">
                            <el-table-column
                                prop="storageVideoId"
                                label="视频ID"
                                align="center"
                                width="120px">
                                    <template slot-scope="scope">
                                        {{scope.row.storageVideoId | padEmpty}}
                                    </template>
                            </el-table-column>
                            <el-table-column
                                prop="originName"
                                label="文件名"
                                align="center"
                                width="180">
                                    <template slot-scope="scope">
                                        <span class="ellipsis two">
                                            {{scope.row.originName | padEmpty}}
                                        </span>
                                    </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                width="180"
                                label="预览">
                                <template slot-scope="scope">
                                    <div class="btn-icon-container">
                                        <el-button
                                            v-if="scope.row.m3u8For4K"
                                            type="text"
                                            size="small"
                                            @click="displayVideoPlayer(scope.row.m3u8For4K, scope.row.originName)"
                                            >4K</el-button>
                                            <svg-icon
                                                v-if="scope.row.m3u8For4K"
                                                icon-class="copy_btn"
                                                class-name="copy-btn pointer"
                                                :data-clipboard-text="getVideoUrl(scope.row.m3u8For4K)">
                                            </svg-icon>
                                    </div>
                                    <div class="btn-icon-container">
                                        <el-button
                                            v-if="scope.row.m3u8For1080P"
                                            type="text"
                                            size="small"
                                            @click="displayVideoPlayer(scope.row.m3u8For1080P, scope.row.originName)"
                                            >1080</el-button>
                                            <svg-icon
                                                v-if="scope.row.m3u8For1080P"
                                                icon-class="copy_btn"
                                                class-name="copy-btn pointer"
                                                :data-clipboard-text="getVideoUrl(scope.row.m3u8For1080P)">
                                            </svg-icon>
                                    </div>
                                    <div class="btn-icon-container">
                                        <el-button
                                            v-if="scope.row.m3u8For720P"
                                            type="text"
                                            size="small"
                                            @click="displayVideoPlayer(scope.row.m3u8For720P, scope.row.originName)"
                                            >720</el-button>
                                            <svg-icon
                                                v-if="scope.row.m3u8For720P"
                                                icon-class="copy_btn"
                                                class-name="copy-btn pointer"
                                                :data-clipboard-text="getVideoUrl(scope.row.m3u8For720P)">
                                            </svg-icon>
                                    </div>
                                    <div class="btn-icon-container">
                                        <el-button
                                            v-if="scope.row.m3u8For480P"
                                            type="text"
                                            size="small"
                                            @click="displayVideoPlayer(scope.row.m3u8For480P, scope.row.originName)"
                                            >480</el-button>
                                            <svg-icon
                                                v-if="scope.row.m3u8For480P"
                                                icon-class="copy_btn"
                                                class-name="copy-btn pointer"
                                                :data-clipboard-text="getVideoUrl(scope.row.m3u8For480P)">
                                            </svg-icon>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="type"
                                align="center"
                                min-width="80px"
                                label="内容类型">
                                    <template slot-scope="scope">
                                        {{getVideoType(scope.row.type) | padEmpty}}
                                    </template>
                            </el-table-column>
                            <el-table-column
                                prop="duration"
                                align="center"
                                width="100"
                                label="时长">
                                <template slot-scope="scope">
                                    {{duration(scope.row.takeTimeInSec) | padEmpty}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="duration"
                                align="center"
                                min-width="80px"
                                label="上下架">
                                <template slot-scope="scope">
                                    <i v-if="scope.row.visible" class="on-the-shelf">已上架</i>
                                    <i v-else class="off-the-shelf">已下架</i>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="btn-wrapper text-center">
                            <el-button @click="changeProgrammeHandler" class="btn-style-two">更换节目</el-button>
                        </div>
                    </div>
                    <div v-else class="step-one-wrapper">
                        <el-form class="my-el-form" :inline="true" @submit.native.prevent>
                            <el-form-item>
                                <el-input
                                    placeholder="搜索你想要的信息"
                                    clearable
                                    class="border-input"
                                    @input="searchFieldInputHandler($event, 'keyword')"
                                    :value="programmeSearchFields.keyword">
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" class="btn-style-one" @click="searchEnterHandler">
                                    <svg-icon icon-class="search"></svg-icon>
                                    搜索
                                </el-button>
                            </el-form-item>
                        </el-form>
                        <el-table
                            :row-class-name="tableRowClassName"
                            ref="multipleTable"
                            header-row-class-name="common-table-header" class="my-table-style" :data="list" border>
                            <el-table-column  align="center" label="选择">
                                <template slot-scope="scope">
                                    <el-radio :value="getSquareProgrammeId" :label="scope.row.id" @input="setProgrammeHandler(scope.row)">&nbsp;</el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column prop="code" align="center" width="120px" label="节目编号">
                                <template slot-scope="scope">
                                    {{scope.row.code | padEmpty}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" align="center" min-width="100px" label="节目名称">
                                <template slot-scope="scope">
                                    {{scope.row.name | padEmpty}}
                                </template>
                            </el-table-column>
                            <el-table-column label="节目图片" width="100px" align="center" >
                                <template slot-scope="scope">
                                    <img style="width:70px;height:auto;" @click="displayImage(scope.row.coverImage ? scope.row.coverImage : {})" class="pointer" :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl" alt="">
                                </template>
                            </el-table-column>
                            <el-table-column prop="featureVideoCount" width="100px" align="center" label="正片数量">
                                <template slot-scope="scope">
                                    {{scope.row.featureVideoCount | padEmpty}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" width="100px" label="分类">
                                <template slot-scope="scope">
                                    <span class="ellipsis four">
                                        {{categoryListString(scope.row.categoryList) | padEmpty}}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" min-width="100px" label="类型">
                                <template slot-scope="scope">
                                    <span class="ellipsis four">
                                        {{typeList(scope.row.id) | padEmpty}}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" min-width="100px" label="演员">
                                <template slot-scope="scope">
                                    <span class="ellipsis four">
                                        {{getChiefActor(scope.row.id) | padEmpty}}
                                    </span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="releaseStatus" min-width="100px" align="center" label="状态">
                                <template slot-scope="scope">
                                    <i v-if="scope.row.visible" class="on-the-shelf">已上架</i>
                                    <i v-else class="off-the-shelf">已下架</i>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" min-width="100px" label="更新时间">
                                <template slot-scope="scope">
                                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD') | padEmpty}}
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination
                            @current-change="handlePaginationChange($event, 'pageNum')"
                            :current-page="programmePagination.pageNum"
                            :page-size="programmePagination.pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="programmePagination.total">
                        </el-pagination>
                    </div>
                </div>
                <div v-show="active === 1" class="step-three">
                    <el-table
                        class="my-table-style"
                        :data="video.list"
                        border
                        :row-class-name="videoTableRowClassName"
                        header-row-class-name="common-table-header"
                        style="width: 100%">
                        <el-table-column  align="center" label="选择">
                            <template slot-scope="scope">
                                <el-radio :value="getSquareProgrammeVideoId" :label="scope.row.id" @input="setProgrammeVideoHandler(scope.row)">&nbsp;</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="storageVideoId"
                            label="视频ID"
                            align="center"
                            width="120px">
                                <template slot-scope="scope">
                                    {{scope.row.storageVideoId | padEmpty}}
                                </template>
                        </el-table-column>
                        <el-table-column
                            prop="originName"
                            label="文件名"
                            align="center"
                            width="180">
                                <template slot-scope="scope">
                                    <span class="ellipsis two">
                                        {{scope.row.originName | padEmpty}}
                                    </span>
                                </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            width="180"
                            label="预览">
                            <template slot-scope="scope">
                                <div class="btn-icon-container">
                                    <el-button
                                        v-if="scope.row.m3u8For4K"
                                        type="text"
                                        size="small"
                                        @click="displayVideoPlayer(scope.row.m3u8For4K, scope.row.originName)"
                                        >4K</el-button>
                                        <svg-icon
                                            v-if="scope.row.m3u8For4K"
                                            icon-class="copy_btn"
                                            class-name="copy-btn pointer"
                                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For4K)">
                                        </svg-icon>
                                </div>
                                <div class="btn-icon-container">
                                    <el-button
                                        v-if="scope.row.m3u8For1080P"
                                        type="text"
                                        size="small"
                                        @click="displayVideoPlayer(scope.row.m3u8For1080P, scope.row.originName)"
                                        >1080</el-button>
                                        <svg-icon
                                            v-if="scope.row.m3u8For1080P"
                                            icon-class="copy_btn"
                                            class-name="copy-btn pointer"
                                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For1080P)">
                                        </svg-icon>
                                </div>
                                <div class="btn-icon-container">
                                    <el-button
                                        v-if="scope.row.m3u8For720P"
                                        type="text"
                                        size="small"
                                        @click="displayVideoPlayer(scope.row.m3u8For720P, scope.row.originName)"
                                        >720</el-button>
                                        <svg-icon
                                            v-if="scope.row.m3u8For720P"
                                            icon-class="copy_btn"
                                            class-name="copy-btn pointer"
                                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For720P)">
                                        </svg-icon>
                                </div>
                                <div class="btn-icon-container">
                                    <el-button
                                        v-if="scope.row.m3u8For480P"
                                        type="text"
                                        size="small"
                                        @click="displayVideoPlayer(scope.row.m3u8For480P, scope.row.originName)"
                                        >480</el-button>
                                        <svg-icon
                                            v-if="scope.row.m3u8For480P"
                                            icon-class="copy_btn"
                                            class-name="copy-btn pointer"
                                            :data-clipboard-text="getVideoUrl(scope.row.m3u8For480P)">
                                        </svg-icon>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="type"
                            align="center"
                            min-width="80px"
                            label="内容类型">
                                <template slot-scope="scope">
                                    {{getVideoType(scope.row.type) | padEmpty}}
                                </template>
                        </el-table-column>
                        <el-table-column
                            prop="duration"
                            align="center"
                            width="100"
                            label="时长">
                            <template slot-scope="scope">
                                {{duration(scope.row.takeTimeInSec) | padEmpty}}
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="duration"
                            align="center"
                            min-width="80px"
                            label="上下架">
                            <template slot-scope="scope">
                                <i v-if="scope.row.visible" class="on-the-shelf">已上架</i>
                                <i v-else class="off-the-shelf">已下架</i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-show="active === 2" class="step-two">
                    <el-form class="my-el-form" status-icon label-width="120px" @submit.native.prevent>
                        <el-col :span="24">
                            <el-form-item label="非焦点图" required>
                                <div class="image-container">
                                    <select-image
                                        name="programmeVideoCoverImage"
                                        :images="matchedProgrammeList"
                                        :id="getImageIdByKey('coverImage') || ''"
                                        :allowResolutions="allowResolutions"
                                        :changeImageHandler="changeCoverImageHandler"
                                    ></select-image>
                                    <single-image-uploader
                                        id="programmeVideoImageUploaderOne"
                                        :showImage="false"
                                        :uri="getImageByKey('coverImage') || ''"
                                        :uploadSuccessHandler="uploadProgrammeCoverImageSuccessHandler"
                                        :allowResolutions="allowResolutions"
                                    ></single-image-uploader>
                                </div>
                            </el-form-item>
                            <el-form-item label="焦点图">
                                <div class="image-container">
                                    <select-image
                                        name="programmeVideoBgImage"
                                        :showDeleteImageBtn="true"
                                        :deleteImage="deleteBgImageHandler"
                                        :images="matchedProgrammeList"
                                        :id="getImageIdByKey('coverImageBackground') || ''"
                                        :allowResolutions="allowResolutions"
                                        :changeImageHandler="changeBgImageHandler"
                                    ></select-image>
                                    <single-image-uploader
                                        id="programmeVideoImageUploaderTwo"
                                        :showImage="false"
                                        :uri="getImageByKey('coverImageBackground') || ''"
                                        :uploadSuccessHandler="uploadProgrammeBgImageSuccessHandler"
                                        :allowResolutions="allowResolutions"
                                    ></single-image-uploader>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="cancelHanlder">取 消</el-button>
                    <el-button v-show="active > 0" class="btn-style-three prev-btn" @click="prevBtnClickHandler">上一步</el-button>
                    <el-button v-show="active < 2" class="btn-style-three next-btn" @click="nextBtnClickHandler">下一步</el-button>
                    <el-button v-show="active === 2" type="primary" class="btn-style-two" @click="enterHandler">确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
        <display-video-dialog
            :url="url"
            :title="videoTitle"
            :displayVideoDialogVisible="displayVideoDialogVisible"
            v-on:changeDisplayVideoDialogStatus="closeDisplayVideoDialog($event)">
        </display-video-dialog>
    </div>
</template>
<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
import _ from 'lodash';
import role from '@/util/config/role';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import PreviewSingleImage from 'sysComponents/custom_components/custom/PreviewSingleImage';
import DisplayVideoDialog from '../../video_manage/DisplayVideoDialog';
import SelectImage from './SelectImage';
const ClipboardJS = require('clipboard');
export default {
    name: 'EditProgramme',
    props: {
        squareIndex: {
            type: Number,
            default: 0
        },
        layoutItemType: {
            type: String,
            default: 'PROGRAMME_VIDEO'
        },
        allowResolutions: {
            type: Array,
            default: () => []
        }
    },
    components: {
        PreviewSingleImage,
        SingleImageUploader,
        DisplayVideoDialog,
        SelectImage
    },
    data() {
        return {
            active: 0,
            dialogVisible: false,
            navbarId: '',
            index: 0,
            category: '',
            programme: {},
            previewImage: {
                title: '',
                display: false,
                uri: ''
            },
            showExist: false,
            //  视频弹窗相关的属性
            displayVideoDialogVisible: false,
            url: '',
            videoTitle: '',
            videoObj: {}
        };
    },
    created() {
        let {navbarId, index} = this.$route.params;
        this.navbarId = navbarId;
        this.index = parseInt(index);
    },
    computed: {
        ...mapGetters({
            list: 'programme/programmeList',
            programmeSearchFields: 'programme/programmeSearchFields',
            programmePagination: 'programme/programmePagination',
            categoryListString: 'programme/categoryListString',
            typeList: 'programme/typeList',
            getChiefActor: 'programme/getChiefActor',
            video: 'programme/video',
            layout: 'pageLayout/layout',
            getLayoutItemByNavbarId: 'pageLayout/getLayoutItemByNavbarId'
        }),
        layoutItem() {
            let layoutItem = this.getLayoutItemByNavbarId(this.navbarId, this.index, this.squareIndex);
            return layoutItem;
        },
        getImageIdByKey() {
            return (key) => {
                return _.get(this.layoutItem, `${key}.id`);
            };
        },
        getImageByKey() {
            return (key) => {
                let {navbarId, index} = this.$route.params;
                return _.get(this.layout, `${navbarId}.data.${index}.layoutItemMultiList.${this.squareIndex}.${key}.uri`);
            };
        },
        getSquareProgrammeId() {
            let {navbarId, index} = this.$route.params;
            return _.get(this.layout, `${navbarId}.data.${index}.layoutItemMultiList.${this.squareIndex}.id`);
        },
        getSquareProgrammeVideo() {
            let {navbarId, index} = this.$route.params;
            let params = _.get(this.layout, `${navbarId}.data.${index}.layoutItemMultiList.${this.squareIndex}.params`);
            if (params) {
                return [JSON.parse(params)];
            }
            return [];
        },
        getSquareProgrammeVideoId() {
            let {navbarId, index} = this.$route.params;
            let params = _.get(this.layout, `${navbarId}.data.${index}.layoutItemMultiList.${this.squareIndex}.params`);
            if (params) {
                return JSON.parse(params).id;
            }
            return false;
        },
        getSquareProgrammeLayoutItemType() {
            let {navbarId, index} = this.$route.params;
            return _.get(this.layout, `${navbarId}.data.${index}.layoutItemMultiList.${this.squareIndex}.layoutItemType`);
        },
        //  视频相关的getter
        duration() {
            return (seconds) => {
                return this.$util.fromSecondsToTime(seconds);
            };
        },
        getVideoType() {
            return (key) => {
                return role.VIDEO_TYPE_OBJ[key];
            };
        },
        getVideoUrl() {
            return (uri) => {
                let baseUri = window.localStorage.getItem('videoBaseUri');
                return `${baseUri}${uri}`;
            };
        },
        matchedProgrammeList() {
            let posterProgrammeList = _.get(this.programme, 'posterImageList') || [];
            let matchedProgrammeList = posterProgrammeList.filter((image) => {
                let width = _.get(this.allowResolutions, '0.width');
                let height = _.get(this.allowResolutions, '0.height');
                return parseInt(image.width) === parseInt(width) && parseInt(image.height) === parseInt(height);
            });
            return matchedProgrammeList;
        }
    },
    methods: {
        ...mapMutations({
            resetProgrammePagination: 'programme/resetProgrammePagination',
            resetProgrammeSearchFields: 'programme/resetProgrammeSearchFields',
            updateProgrammePagination: 'programme/updateProgrammePagination',
            updateProgrammeSearchFields: 'programme/updateProgrammeSearchFields',
            updateLayoutItemByIndex: 'pageLayout/updateLayoutItemByIndex',
            cancelLayoutItemByIndex: 'pageLayout/cancelLayoutItemByIndex',
            resetLayoutItemByIndex: 'pageLayout/resetLayoutItemByIndex'
        }),
        ...mapActions({
            getProgrammeListIsVisible: 'programme/getProgrammeListIsVisible',
            getProgrammeListIsVisibleByNews: 'programme/getProgrammeListIsVisibleByNews',
            getProgrammeCategory: 'programme/getProgrammeCategory',
            getProgrammeVideoListById: 'programme/getProgrammeVideoListById'
        }),
        keyupHandler(e) {
            if (e.keyCode === 13) {
                this.searchEnterHandler();
            }
        },
        searchFieldInputHandler(value, key) {
            this.updateProgrammeSearchFields({key, value});
        },
        //  弹窗的操作
        async showDialog(layoutItemType, category) {
            try {
                if (layoutItemType !== _.get(this.layoutItem, 'layoutItemType')) {
                    this.resetLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex });
                }

                this.updateProgrammePagination({key: 'pageSize', value: 5});
                await this.getProgrammeCategory();
                if (category) {
                    this.category = category;
                    await this.getProgrammeListIsVisibleByNews();
                } else {
                    await this.getProgrammeListIsVisible();
                }

                this.dialogVisible = true;
                window.addEventListener('keyup', this.keyupHandler);
            } catch (err) {
                console.log(err);
            }
        },
        closeDialog() {
            this.resetProgrammePagination();
            this.resetProgrammeSearchFields();
            this.dialogVisible = false;
            this.active = 0;
            this.programme = {};
            this.keyword = '';
            this.cateogry = '';
            this.previewImage = {
                title: '',
                display: false,
                uri: ''
            };

            window.removeEventListener('keyup', this.keyupHandler);
        },
        async dialogOpenHandler() {
            try {
                if (this.getSquareProgrammeVideoId) {
                    await this.getProgrammeCategory();
                    let res = await this.$service.getProgrammeInfo({id: this.getSquareProgrammeId});
                    if (res && res.code === 0) {
                        this.programme = res.data;
                        this.showExist = true;
                    }
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 弹窗的操作结束
        handlePaginationChange(value, key) {
            this.updateProgrammePagination({key, value});
            if (this.category) {
                this.getProgrammeListIsVisibleByNews();
            } else {
                this.getProgrammeListIsVisible();
            }
        },
        //  上下步的处理方法
        prevBtnClickHandler() {
            if (this.active > 0) {
                if (this.showExist) {
                    this.active = 0;
                } else {
                    this.active--;
                }
            }
        },
        nextBtnClickHandler() {
            if (this.active < 3) {
                if (this.active === 0) {
                    if (this.getSquareProgrammeId) {
                        if (this.showExist) {
                            this.active = 2;
                        } else {
                            this.active++;
                            this.getProgrammeVideoListById(this.getSquareProgrammeId);
                        }
                    } else {
                        this.$message.error('请选择节目');
                        return false;
                    }
                } else if (this.active === 1) {
                    if (this.getSquareProgrammeVideoId) {
                        this.active++;
                    } else {
                        this.$message.error('请选择视频');
                        return false;
                    }
                } else if (this.active === 2) {
                    if (this.getImageByKey('coverImage')) {
                        this.active++;
                    } else {
                        this.$message.error('请上传非焦点图');
                        return false;
                    }
                } else {
                    this.active++;
                }
            }
        },
        changeProgrammeHandler() {
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'id', value: '' });
            this.resetLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex });
            this.showExist = false;
            this.active = 0;
        },
        setProgrammeHandler(programme) {
            let {id, name, desc, programmeTemplate} = programme;
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'id', value: id });
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'name', value: name });
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'desc', value: desc });
            if (programmeTemplate) {
                this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'programmeTemplate', value: programmeTemplate });
            }
            this.programme = programme;
            this.getProgrammeVideoListById(id);
        },
        setProgrammeVideoHandler(video) {
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'params', value: JSON.stringify(video) });
        },
        tableRowClassName({row, rowIndex}) {
            return row.id === this.getSquareProgrammeId ? 'checked' : '';
        },
        videoTableRowClassName({row, rowIndex}) {
            return row.id === this.getSquareProgrammeVideoId ? 'checked' : '';
        },
        searchEnterHandler() {
            if (this.category) {
                this.getProgrammeListIsVisibleByNews();
            } else {
                this.getProgrammeListIsVisible();
            }
        },
        //  查看图片
        displayImage(image) {
            this.previewImage.title = image.name;
            this.previewImage.display = true;
            this.previewImage.uri = image.uri;
        },
        //  图片上传成功之后的毁掉
        async uploadProgrammeCoverImageSuccessHandler(image) {
            try {
                let {id, posterImageList} = this.programme;
                let clonePosterImageList = _.cloneDeep(posterImageList);
                clonePosterImageList.push(image);
                clonePosterImageList = _.uniqBy(clonePosterImageList, 'id');
                let res = await this.$service.updatePartProgrammeInfo({
                    id,
                    programme: {posterImageList: clonePosterImageList}
                });
                if (res && res.code === 0) {
                    this.programme.posterImageList = _.cloneDeep(clonePosterImageList);
                }
            } catch (err) {
                console.log(err);
            }
        },
        uploadProgrammeBgImageSuccessHandler(image) {
            this.uploadProgrammeCoverImageSuccessHandler(image);
        },
        changeCoverImageHandler(image) {
            this.updateLayoutItemByIndex({
                navbarId: this.navbarId,
                index: this.index,
                squareIndex: this.squareIndex,
                key: 'coverImage',
                value: image
            });
        },
        changeBgImageHandler(image) {
            this.updateLayoutItemByIndex({
                navbarId: this.navbarId,
                index: this.index,
                squareIndex: this.squareIndex,
                key: 'coverImageBackground',
                value: image
            });
        },
        deleteBgImageHandler() {
            this.updateLayoutItemByIndex({
                navbarId: this.navbarId,
                index: this.index,
                squareIndex: this.squareIndex,
                key: 'coverImageBackground',
                value: null
            });
        },
        //  最后一步的确认处理函数
        enterHandler() {
            // 设置layoutItemType为PROGRAMME_VIDEO
            if (this.getImageByKey('coverImage')) {
                this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'layoutItemType', value: this.layoutItemType });
                this.showExist = true;
                this.closeDialog();
            } else {
                this.$message.error('请选择非焦点图');
                return false;
            }
        },
        cancelHanlder() {
            this.cancelLayoutItemByIndex({navbarId: this.navbarId, index: this.index, squareIndex: this.squareIndex});
            this.closeDialog();
        },
        //  视频列表相关的方法
        displayVideoPlayer(url, name) {
            this.displayVideoDialogVisible = true;
            let baseUri = window.localStorage.getItem('videoBaseUri');
            this.url = `${baseUri}${url}`;
            this.videoTitle = name;
        },
        initClipboard() {
            let that = this;
            let clipboard = new ClipboardJS('.copy-btn');
            clipboard.on('success', function(e) {
                that.$message.success('视频链接复制成功');
                e.clearSelection();
            });
            clipboard.on('error', function(e) {
                that.$message.error('视频链接复制失败');
            });
        },
        closeDisplayVideoDialog() {
            this.displayVideoDialogVisible = false;
        }
    }
};
</script>
<style lang="scss" scoped>
.my-el-form {
    overflow: hidden;
    margin-top: 20px;
    .mark-container {
        display: flex;
        flex-wrap: wrap;
        .mark-item {
            font-size: 16px;
            color: #A8ABB3;
            width: 45%;
            .el-checkbox {
                padding: 0;
            }
        }
    }
    .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #fff!important;
    }
}
</style>

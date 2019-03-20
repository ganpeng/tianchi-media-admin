<!--  专题内视频  -->
<template>
    <div class="subject-video-container">
        <el-dialog
            title="设置为专题内视频"
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
                        <el-step title="选择角标"></el-step>
                    </el-steps>
                    <el-steps v-else class="my-steps" align-center :active="active" finish-status="success">
                        <el-step title="选择专题"></el-step>
                        <el-step title="选择节目"></el-step>
                        <el-step title="选择视频"></el-step>
                        <el-step title="选择图片"></el-step>
                        <el-step title="选择角标"></el-step>
                    </el-steps>
                    <div class="seperator-line"></div>
                </div>
                <div v-show="active === 0" class="step-one">
                    <div v-if="showExist" class="exist-video-wrapper">
                        <p class="table-title">当前已选专题节目内包含的视频</p>
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
                            <el-button @click="changeProgrammeSubjectHandler" class="btn-style-two">更换专题</el-button>
                        </div>
                    </div>
                    <div v-else class="step-one-wrapper">
                        <el-form class="my-el-form" :inline="true" @submit.native.prevent>
                            <el-form-item>
                                <el-input
                                    placeholder="搜索你想要的信息"
                                    clearable
                                    class="border-input"
                                    :value="programmeSubject.keyword"
                                    @input="searchInputHandler($event, 'keyword')"
                                >
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" class="btn-style-one" @click="searchEnterHandler">搜索</el-button>
                            </el-form-item>
                        </el-form>
                        <el-table
                            :row-class-name="programmeSubjectTableRowClassName"
                            :header-row-class-name='"common-table-header"' class="my-table-style" :data="programmeSubject.list" border>
                            <el-table-column align="center" width="60px" label="选择">
                                <template slot-scope="scope">
                                    <el-radio :value="getSubjectId" :label="scope.row.id" @input="setProgrammeSubjectHandler(scope.row)">&nbsp;</el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column prop="id" align="center" width="120px" label="编号">
                                <template slot-scope="scope">
                                    {{scope.row.id | padEmpty}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" align="center" label="专题名称">
                                <template slot-scope="scope">
                                        {{scope.row.name | padEmpty}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" align="center" label="内容数量">
                                <template slot-scope="scope">
                                        {{scope.row.itemCount | padEmpty}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="name" align="center" label="内容类型">
                                <template slot-scope="scope">
                                        {{scope.row.programmeCategoryList.map((item) => item.name).join(', ') | padEmpty}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" label="更新时间">
                                <template slot-scope="scope">
                                    {{scope.row.updatedAt | formatDate('yyyy-MM-DD') | padEmpty}}
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-pagination
                            @current-change="handlePaginationChange($event, 'pageNum')"
                            :current-page="programmeSubject.pagination.pageNum"
                            :page-size="programmeSubject.pagination.pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="programmeSubject.pagination.total">
                        </el-pagination>
                    </div>
                </div>
                <div v-show="active === 1" class="step-three">
                    <p class="table-title">当前已选专题内包含的节目</p>
                    <el-table
                        :row-class-name="programmeTableRowClassName"
                        ref="multipleTable"
                        header-row-class-name="common-table-header" class="my-table-style" :data="programmeList" border>
                        <el-table-column align="center" label="选择">
                            <template slot-scope="scope">
                                <el-radio :value="getProgrammeId" :label="scope.row.id" @input="setProgrammeHandler(scope.row)">&nbsp;</el-radio>
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
                        <el-table-column align="center" min-width="100px" label="演员">
                            <template slot-scope="scope">
                                <span class="ellipsis four">
                                    {{getChiefActor(scope.row.id) | padEmpty}}
                                </span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div v-show="active === 2" class="step-three">
                    <p class="table-title">当前已选节目内包含的视频</p>
                    <el-table
                        class="my-table-style"
                        :data="video.list"
                        border
                        :row-class-name="videoTableRowClassName"
                        header-row-class-name="common-table-header"
                        style="width: 100%">
                        <el-table-column  align="center" label="选择">
                            <template slot-scope="scope">
                                <el-radio :value="getProgrammeVideoId" :label="scope.row.id" @input="setProgrammeVideoHandler(scope.row)">&nbsp;</el-radio>
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
                <div v-show="active === 3" class="step-two">
                    <el-form class="my-el-form" style="margin-top:20px;" status-icon label-width="120px" @submit.native.prevent>
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
                <div v-show="active === 4" class="step-two">
                    <el-form status-icon label-width="120px" style="margin-top:20px;" class="my-el-form clearfix" @submit.native.prevent>
                        <el-col :span="14">
                            <el-form-item label="节目角标">
                                <div class="page-layout-mark">
                                    <div class="mark-container">
                                        <div class="mark-item">
                                            <el-checkbox v-if="markCheckedByKey('leftTop')" :checked="true" @change="markChangeHandler($event, 'leftTop')" :disabled="leftTopDisabled">
                                                左上角：播放平台
                                            </el-checkbox>
                                            <el-checkbox v-else :checked="false" @change="markChangeHandler($event, 'leftTop')" :disabled="leftTopDisabled">
                                                左上角：播放平台
                                            </el-checkbox>
                                        </div>
                                        <div class="mark-item">
                                                右上角：
                                            <el-select
                                                @input="customMarkSelectHandler"
                                                :value="rightTop"
                                                value-key="id"
                                                clearable
                                                placeholder="请选择">
                                                <el-option
                                                    v-for="item in customMarkOptions"
                                                    :key="item.id"
                                                    :label="item.caption"
                                                    :value="item">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div class="mark-item">
                                            <div v-if="showLeftBottom">
                                                <el-checkbox v-if="markCheckedByKey('leftBottom')" :checked="true" @change="markChangeHandler($event, 'leftBottom')" :disabled="leftBottomDisabled">
                                                    左下角：更新
                                                </el-checkbox>
                                                <el-checkbox v-else :checked="false" @change="markChangeHandler($event, 'leftBottom')" :disabled="leftBottomDisabled">
                                                    左下角：更新
                                                </el-checkbox>
                                            </div>
                                        </div>
                                        <div class="mark-item">
                                            <el-checkbox v-if="markCheckedByKey('rightBottom')" :checked="true" @change="markChangeHandler($event, 'rightBottom')" :disabled="rightBottomDisabled">
                                                右下角：评分
                                            </el-checkbox>
                                            <el-checkbox v-else :checked="false" @change="markChangeHandler($event, 'rightBottom')" :disabled="rightBottomDisabled">
                                                右下角：评分
                                            </el-checkbox>
                                        </div>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="cancelHanlder">取 消</el-button>
                    <el-button v-show="active > 0" class="btn-style-three prev-btn" @click="prevBtnClickHandler">上一步</el-button>
                    <el-button v-show="active < 4" class="btn-style-three next-btn" @click="nextBtnClickHandler">下一步</el-button>
                    <el-button v-show="active === 4" type="primary" class="btn-style-two" @click="enterHandler">确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <preview-single-image :previewSingleImage="previewImage"></preview-single-image>
        <display-video-dialog
            :url="url"
            :title="videoTitle"
            ref="displayVideoDialog">
        </display-video-dialog>
    </div>
</template>
<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
import _ from 'lodash';
import role from '@/util/config/role';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import PreviewSingleImage from 'sysComponents/custom_components/custom/PreviewSingleImage';
import DisplayVideoDialog from 'sysComponents/custom_components/custom/DisplayVideoDialog';
import SelectImage from './SelectImage';
const ClipboardJS = require('clipboard');
export default {
    name: 'SubjectVideo',
    props: {
        squareIndex: {
            type: Number,
            default: 0
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
            layoutItemType: '',
            programme: {},
            programmeSubjectData: {},
            videoObj: {},
            customMarkOptions: [],
            previewImage: {
                title: '',
                display: false,
                uri: ''
            },
            showExist: false,
            //  视频弹窗相关的属性
            displayVideoDialogVisible: false,
            url: '',
            videoTitle: ''
        };
    },
    created() {
        let {navbarId, index} = this.$route.params;
        this.navbarId = navbarId;
        this.index = parseInt(index);
    },
    computed: {
        ...mapGetters({
            getChiefActor: 'programme/getChiefActor',
            video: 'programme/video',
            layout: 'pageLayout/layout',
            programmeSubject: 'pageLayout/programmeSubject',
            getLayoutItemByNavbarId: 'pageLayout/getLayoutItemByNavbarId',
            getLayoutItemCornerMark: 'pageLayout/getLayoutItemCornerMark'
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
        getProgrammeVideoIdFromParams() {
            let {navbarId, index} = this.$route.params;
            let params = _.get(this.layout, `${navbarId}.data.${index}.layoutItemMultiList.${this.squareIndex}.params`);
            if (params) {
                return JSON.parse(params).id;
            }
            return false;
        },
        getSubjectId() {
            let {navbarId, index} = this.$route.params;
            return _.get(this.layout, `${navbarId}.data.${index}.layoutItemMultiList.${this.squareIndex}.id`);
            // return this.programmeSubjectData.id;
        },
        getProgrammeIdFromParams() {
            let {navbarId, index} = this.$route.params;
            let params = _.get(this.layout, `${navbarId}.data.${index}.layoutItemMultiList.${this.squareIndex}.params`);
            if (params) {
                return JSON.parse(params).programmeId;
            }
            return false;
        },
        getProgrammeId() {
            return this.programme.id;
        },
        getProgrammeVideoId() {
            return this.videoObj.id;
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
        programmeList() {
            return _.get(this.programmeSubjectData, 'subjectItemList') || [];
        },
        rightTop() {
            let {rightTop} = this.getLayoutItemCornerMark(this.navbarId, this.index, this.squareIndex);
            return _.isEmpty(rightTop) ? {} : rightTop;
        },
        showLeftBottom() {
            let programmeTemplate = _.get(this.programme, 'programmeTemplate');
            let flag = programmeTemplate === 'TV_DRAMA' || programmeTemplate === 'TV_SHOW';
            return flag;
        },
        leftTopDisabled() {
            return _.get(this.programme, 'platformList.length') === 0;
        },
        leftBottomDisabled() {
            return !(this.programme && this.programme.featureVideoCount);
        },
        rightBottomDisabled() {
            return !(this.programme && this.programme.score);
        },
        rightBottomChecked() {
            let cornerMark = this.getLayoutItemCornerMark(this.navbarId, this.index, this.squareIndex);
            let mark = _.get(cornerMark, `rightBottom.caption`);
            return mark;
        },
        markCheckedByKey() {
            return (key) => {
                let cornerMark = this.getLayoutItemCornerMark(this.navbarId, this.index, this.squareIndex);
                let mark = _.get(cornerMark, `${key}.caption`);
                return mark;
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
            updateLayoutItemByIndex: 'pageLayout/updateLayoutItemByIndex',
            cancelLayoutItemByIndex: 'pageLayout/cancelLayoutItemByIndex',
            resetLayoutItemByIndex: 'pageLayout/resetLayoutItemByIndex',
            //  新加节目专题相关
            resetProgrammeSubject: 'pageLayout/resetProgrammeSubject',
            updateProgrammeSubjectPagination: 'pageLayout/updateProgrammeSubjectPagination',
            updateLayoutItemCornerMarkByIndex: 'pageLayout/updateLayoutItemCornerMarkByIndex',
            updateProgrammeSubject: 'pageLayout/updateProgrammeSubject'
        }),
        ...mapActions({
            getProgrammeVideoListById: 'programme/getProgrammeVideoListById',
            // 新加的节目专题内视频相关
            getProgrammeSubjectList: 'pageLayout/getProgrammeSubjectList',
            getCustomMarkList: 'pageLayout/getCustomMarkList'
        }),
        keyupHandler(e) {
            if (e.keyCode === 13) {
                this.searchEnterHandler();
            }
        },
        // 节目专题搜索相关方法
        searchInputHandler(value, key) {
            this.updateProgrammeSubject({key, value});
        },
        searchEnterHandler() {
            this.getProgrammeSubjectList();
        },
        handlePaginationChange(value, key) {
            this.updateProgrammeSubjectPagination({key, value});
            this.getProgrammeSubjectList();
        },
        //  弹窗的操作
        async showDialog(layoutItemType, category) {
            try {
                this.layoutItemType = layoutItemType;
                this.category = category;

                this.dialogVisible = true;
                window.addEventListener('keyup', this.keyupHandler);
            } catch (err) {
                console.log(err);
            }
        },
        closeDialog() {
            this.resetProgrammeSubject();
            this.dialogVisible = false;
            this.active = 0;
            this.programme = {};
            this.programmeSubjectData = {};
            this.keyword = '';
            this.cateogry = '';
            this.showExist = '';
            this.layoutItemType = '';
            this.previewImage = {
                title: '',
                display: false,
                uri: ''
            };

            window.removeEventListener('keyup', this.keyupHandler);
        },
        async dialogOpenHandler() {
            try {
                if (this.layoutItemType !== _.get(this.layoutItem, 'layoutItemType')) {
                    this.resetLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex });
                } else {
                    if (this.getSubjectId && this.getProgrammeIdFromParams && this.getProgrammeVideoIdFromParams) {
                        let res = await this.$service.getProgrammeInfo({id: this.getProgrammeIdFromParams});
                        await this.getProgrammeVideoListById(this.getProgrammeIdFromParams);
                        if (res && res.code === 0) {
                            this.programme = res.data;
                            let video = this.video.list.find((video) => video.id === this.getProgrammeVideoIdFromParams);
                            if (video) {
                                this.videoObj = _.cloneDeep(video);
                            }
                            this.showExist = true;
                        }
                    }
                }

                await this.getProgrammeSubjectList();
                let markRes = await this.getCustomMarkList();
                if (markRes && markRes.code === 0) {
                    this.customMarkOptions = markRes.data;
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 弹窗的操作结束
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
            if (this.active < 4) {
                if (this.active === 0) {
                    if (this.getSubjectId) {
                        if (this.showExist) {
                            this.active = 3;
                        } else {
                            this.active++;
                        }
                    } else {
                        this.$message.error('请选择专题');
                        return false;
                    }
                } else if (this.active === 1) {
                    if (this.getProgrammeId) {
                        this.active++;
                        this.getProgrammeVideoListById(this.getProgrammeId);
                    } else {
                        this.$message.error('请选择专题内节目');
                        return false;
                    }
                } else if (this.active === 2) {
                    if (this.getProgrammeVideoId) {
                        this.active++;
                    } else {
                        this.$message.error('请选择视频');
                        return false;
                    }
                } else if (this.active === 3) {
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
        setProgrammeSubjectHandler(programmeSubjectData) {
            let {id} = programmeSubjectData;
            this.programmeSubjectData = programmeSubjectData;
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'id', value: id });
        },
        changeProgrammeSubjectHandler() {
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'id', value: '' });
            this.resetLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex });
            this.showExist = false;
            this.active = 0;
        },
        setProgrammeHandler(programme) {
            let {id} = programme;
            this.programme = programme;
            this.getProgrammeVideoListById(id);
        },
        setProgrammeVideoHandler(video) {
            this.videoObj = _.cloneDeep(video);
            // this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'params', value: JSON.stringify(video) });
        },
        programmeSubjectTableRowClassName({row, rowIndex}) {
            // return row.id === this.getSquareProgrammeId ? 'checked' : '';
            return row.id === this.getSubjectId ? 'checked' : '';
        },
        programmeTableRowClassName({row, rowIndex}) {
            return row.id === this.getProgrammeId ? 'checked' : '';
        },
        videoTableRowClassName({row, rowIndex}) {
            return row.id === this.getProgrammeVideoIdFromParams ? 'checked' : '';
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
                let {name, desc, programmeTemplate} = this.programme;
                this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'layoutItemType', value: this.layoutItemType });
                this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'id', value: this.getSubjectId });
                this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'name', value: name });
                this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'desc', value: desc });
                this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'programmeTemplate', value: programmeTemplate });
                this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'params', value: JSON.stringify(this.videoObj) });
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
        //  角标的相关操作
        markChangeHandler(value, key) {
            let {score, featureVideoCount, platformList, totalSets, programmeTemplate} = this.programme;
            let leftBottomCaption = '';
            switch (programmeTemplate) {
                case 'TV_DRAMA':
                    leftBottomCaption = featureVideoCount ? `更新至${featureVideoCount}集` : '';
                    break;
                case 'TV_SHOW':
                    leftBottomCaption = featureVideoCount ? `更新至${featureVideoCount}期` : '';
                    break;
                default:
                    leftBottomCaption = '';
            }

            if (programmeTemplate === 'TV_DRAMA' && totalSets && featureVideoCount === totalSets) {
                leftBottomCaption = `${totalSets}集全`;
            }

            switch (key) {
                case 'leftTop':
                    this.updateLayoutItemCornerMarkByIndex({
                        navbarId: this.navbarId,
                        index: this.index,
                        squareIndex: this.squareIndex,
                        key: 'leftTop',
                        value: value ? {caption: platformList[0]} : {}
                    });
                    break;
                case 'leftBottom':
                    this.updateLayoutItemCornerMarkByIndex({
                        navbarId: this.navbarId,
                        index: this.index,
                        squareIndex: this.squareIndex,
                        key: 'leftBottom',
                        value: value ? {caption: leftBottomCaption} : {}
                    });
                    break;
                case 'rightBottom':
                    this.updateLayoutItemCornerMarkByIndex({
                        navbarId: this.navbarId,
                        index: this.index,
                        squareIndex: this.squareIndex,
                        key: 'rightBottom',
                        value: value ? {caption: score} : {}
                    });
                    break;
                default:
                    throw new Error('角标key不存在');
            }
        },
        customMarkSelectHandler(mark) {
            let {navbarId, index} = this.$route.params;
            this.updateLayoutItemCornerMarkByIndex({
                navbarId,
                index,
                squareIndex: this.squareIndex,
                key: 'rightTop',
                value: _.isEmpty(mark) ? {} : mark
            });
        },
        //  视频列表相关的方法
        displayVideoPlayer(url, name) {
            this.url = url;
            this.videoTitle = name;
            this.$refs.displayVideoDialog.showDialog();
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
.step-one {
    margin-top: 20px;
}
</style>

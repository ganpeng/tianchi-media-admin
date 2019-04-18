<!--  设置为节目的弹窗 -->
<template>
    <div class="edit-programme-container">
        <el-dialog
            title="设置为节目"
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
                <el-steps class="my-steps" align-center :active="active" finish-status="success">
                    <el-step title="选择节目"></el-step>
                    <el-step title="选择图片"></el-step>
                    <el-step title="设置角标"></el-step>
                </el-steps>
                <div class="seperator-line"></div>
                <div v-show="active === 0" class="step-one">
                    <div v-if="showExist">
                        <p class="table-title">已选择的节目</p>
                        <el-table
                            :row-class-name="tableRowClassName"
                            ref="multipleTable"
                            header-row-class-name="common-table-header" class="my-table-style" :data="checkedProgrammeList" border>
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
                                        {{categoryListString(scope.row.categoryList || []) | padEmpty}}
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
                                    <el-radio :value="getSquareProgrammeId" :label="scope.row.id" @input="setProgrammeSubjectHandler(scope.row)">&nbsp;</el-radio>
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
                                    <img style="width:70px;height:auto;" :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl" alt="">
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
                <div v-show="active === 1" class="step-two">
                    <el-form class="my-el-form" status-icon label-width="120px" @submit.native.prevent>
                        <el-col :span="24">
                            <el-form-item label="非焦点图" required>
                                <div class="image-container">
                                    <select-image
                                        name="without4sCoverImage"
                                        :images="matchedProgrammeList"
                                        :id="getImageIdByKey('coverImage') || ''"
                                        :allowResolutions="allowResolutions"
                                        :changeImageHandler="changeCoverImageHandler"
                                    ></select-image>
                                    <single-image-uploader
                                        id="programmeImageUploaderOne"
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
                                        name="without4sBgImage"
                                        :showDeleteImageBtn="true"
                                        :deleteImage="deleteBgImageHandler"
                                        :images="matchedProgrammeList"
                                        :id="getImageIdByKey('coverImageBackground') || ''"
                                        :allowResolutions="allowResolutions"
                                        :changeImageHandler="changeBgImageHandler"
                                    ></select-image>
                                    <single-image-uploader
                                        id="programmeImageUploaderTwo"
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
                <div v-if="active === 2" class="step-three">
                    <el-form status-icon label-width="120px" class="my-el-form" @submit.native.prevent>
                        <el-col :span="14">
                            <el-form-item label="节目角标">
                                <div class="page-layout-mark">
                                    <div class="mark-container">
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
                                                右下角：
                                            <el-select
                                                @input="rightBottomMarkSelectHandler"
                                                :value="rightBottom"
                                                clearable
                                                placeholder="请选择">
                                                <el-option
                                                    v-for="(item, index) in rightBottomCustomMarkOptions"
                                                    :key="index"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
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
                    <el-button v-show="active < 2" class="btn-style-three next-btn" @click="nextBtnClickHandler">下一步</el-button>
                    <el-button v-show="active === 2" type="primary" class="btn-style-two" @click="enterHandler">确 定</el-button>
                </div>
            </div>
        </el-dialog>
        <preview-single-image :singleImage="previewImage"></preview-single-image>
    </div>
</template>
<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
import _ from 'lodash';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import PreviewSingleImage from 'sysComponents/custom_components/custom/PreviewSingleImage';
import SelectImage from './SelectImage';
export default {
    name: 'EditProgramme',
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
        SelectImage
    },
    data() {
        return {
            navbarId: '',
            index: 0,
            active: 0,
            dialogVisible: false,
            showExist: false,
            category: '',
            layoutItemType: '',
            programme: {},
            customMarkOptions: [],
            previewImage: {
                title: '',
                display: false,
                uri: ''
            }
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
            layout: 'pageLayout/layout',
            getLayoutItemCornerMark: 'pageLayout/getLayoutItemCornerMark',
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
                return _.get(this.layout, `${this.navbarId}.data.${this.index}.layoutItemMultiList.${this.squareIndex}.${key}.uri`);
            };
        },
        //  新的角标规则开始
        rightBottomCustomMarkOptions() {
            let options = [];
            let {featureVideoCount, score, programmeTemplate} = this.programme;
            if ((programmeTemplate === 'TV_SHOW' || programmeTemplate === 'TV_DRAMA') && featureVideoCount) {
                options.push({label: '更新至', value: 1});
            }
            if (score) {
                options.push({label: '评分', value: 2});
            }
            return options;
        },
        rightTop() {
            let {rightTop} = this.getLayoutItemCornerMark(this.navbarId, this.index, this.squareIndex);
            return _.isEmpty(rightTop) ? {} : rightTop;
        },
        rightBottom() {
            let value = '';
            let {leftBottom, rightBottom} = this.getLayoutItemCornerMark(this.navbarId, this.index, this.squareIndex);
            let leftBottomCaption = _.get(leftBottom, 'caption');
            let rightBottomCaption = _.get(rightBottom, 'caption');
            if (!_.isNull(leftBottomCaption) && _.isNull(rightBottomCaption)) {
                value = 1;
            }

            if (_.isNull(leftBottomCaption) && !_.isNull(rightBottomCaption)) {
                value = 2;
            }
            return value;
        },
        //  新的角标规则结束
        getSquareProgrammeId() {
            let id = _.get(this.layout, `${this.navbarId}.data.${this.index}.layoutItemMultiList.${this.squareIndex}.id`);
            return id;
        },
        checkedProgrammeList() {
            if (this.getSquareProgrammeId && !_.isEmpty(this.programme)) {
                return [this.programme];
            } else {
                return [];
            }
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
            updateLayoutItemCornerMarkByIndex: 'pageLayout/updateLayoutItemCornerMarkByIndex',
            resetLayoutItemByIndex: 'pageLayout/resetLayoutItemByIndex'
        }),
        ...mapActions({
            getProgrammeListIsVisible: 'programme/getProgrammeListIsVisible',
            getProgrammeListIsVisibleByNews: 'programme/getProgrammeListIsVisibleByNews',
            getProgrammeCategory: 'programme/getProgrammeCategory',
            getCustomMarkList: 'pageLayout/getCustomMarkList'
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
                this.layoutItemType = layoutItemType;
                this.category = category;

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
            this.category = '';
            this.showExist = false;
            this.layoutItemType = '';
            this.programme = {};
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
                    if (this.getSquareProgrammeId) {
                        let res = await this.$service.getProgrammeInfo({id: this.getSquareProgrammeId});
                        if (res && res.code === 0) {
                            this.programme = res.data;
                            this.showExist = true;
                        } else {
                            this.showExist = false;
                        }
                    }
                }

                let markRes = await this.getCustomMarkList();
                if (markRes && markRes.code === 0) {
                    this.customMarkOptions = markRes.data;
                }

                this.updateProgrammePagination({key: 'pageSize', value: 5});
                await this.getProgrammeCategory();
                if (this.category) {
                    await this.getProgrammeListIsVisibleByNews();
                } else {
                    await this.getProgrammeListIsVisible();
                }
            } catch (err) {
                console.log(err);
            }
        },
        changeProgrammeHandler() {
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'id', value: '' });
            this.resetLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex });
            this.showExist = false;
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
                this.active--;
            }
        },
        nextBtnClickHandler() {
            if (this.active < 3) {
                if (this.active === 0) {
                    if (this.getSquareProgrammeId) {
                        this.active++;
                    } else {
                        this.$message.error('请选择节目');
                        return false;
                    }
                } else if (this.active === 1) {
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
        setProgrammeSubjectHandler(programme) {
            let {id, name, desc, programmeTemplate} = programme;
            if (id === this.getSquareProgrammeId) {
                return false;
            }
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'id', value: id });
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'name', value: name });
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'desc', value: desc });
            if (programmeTemplate) {
                this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'programmeTemplate', value: programmeTemplate });
            }
            //  清除封面图和角标
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'coverImage', value: {} });
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'coverImageBackground', value: {} });
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'cornerMark', value: {leftTop: {}, rightTop: {}, leftBottom: {}, rightBottom: {}} });

            this.programme = programme;
        },
        tableRowClassName({row, rowIndex}) {
            return row.id === this.getSquareProgrammeId ? 'checked' : '';
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
            this.previewImage.uri = image.uri;
            //  去掉预览
            // this.previewImage.display = true;
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
        //  角标的相关操作
        rightBottomMarkSelectHandler(value) {
            let {score, featureVideoCount, totalSets, programmeTemplate} = this.programme;
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

            if (value === 1) {
                this.updateLayoutItemCornerMarkByIndex({
                    navbarId: this.navbarId,
                    index: this.index,
                    squareIndex: this.squareIndex,
                    key: 'leftBottom',
                    value: {caption: leftBottomCaption}
                });
                this.updateLayoutItemCornerMarkByIndex({
                    navbarId: this.navbarId,
                    index: this.index,
                    squareIndex: this.squareIndex,
                    key: 'rightBottom',
                    value: {caption: null}
                });
            } else if (value === 2) {
                this.updateLayoutItemCornerMarkByIndex({
                    navbarId: this.navbarId,
                    index: this.index,
                    squareIndex: this.squareIndex,
                    key: 'rightBottom',
                    value: {caption: score}
                });
                this.updateLayoutItemCornerMarkByIndex({
                    navbarId: this.navbarId,
                    index: this.index,
                    squareIndex: this.squareIndex,
                    key: 'leftBottom',
                    value: {caption: null}
                });
            } else {
                this.updateLayoutItemCornerMarkByIndex({
                    navbarId: this.navbarId,
                    index: this.index,
                    squareIndex: this.squareIndex,
                    key: 'leftBottom',
                    value: {caption: null}
                });
                this.updateLayoutItemCornerMarkByIndex({
                    navbarId: this.navbarId,
                    index: this.index,
                    squareIndex: this.squareIndex,
                    key: 'rightBottom',
                    value: {caption: null}
                });
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
        //  节目展示的相关操作
        setSquareProgrammeLayoutItemType(layoutItemType) {
            let {navbarId, index} = this.$route.params;
            this.updateLayoutItemByIndex({ index, navbarId, squareIndex: this.squareIndex, key: 'layoutItemType', value: layoutItemType });
        },
        //  最后一步的确认处理函数
        enterHandler() {
            let {navbarId, index} = this.$route.params;
            this.updateLayoutItemByIndex({ index, navbarId, squareIndex: this.squareIndex, key: 'layoutItemType', value: 'PROGRAMME' });
            this.closeDialog();
        },
        cancelHanlder() {
            this.cancelLayoutItemByIndex({navbarId: this.navbarId, index: this.index, squareIndex: this.squareIndex});
            this.closeDialog();
        }
    }
};
</script>
<style lang="scss" scoped>
.my-el-form {
    overflow: hidden;
    margin-top: 20px;
}
</style>

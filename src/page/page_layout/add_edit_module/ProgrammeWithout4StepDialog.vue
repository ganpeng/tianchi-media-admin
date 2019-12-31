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
                                    <img style="width:70px;height:auto;" class="pointer" :src="scope.row.coverImage ? scope.row.coverImage.uri : '' | imageUrl" alt="">
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
                                        :allowResolutions="matchedOrAllow"
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
                                        :allowResolutions="matchedOrAllow"
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
    </div>
</template>
<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
import _ from 'lodash';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
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
        SingleImageUploader,
        SelectImage
    },
    data() {
        return {
            navbarId: '',
            index: 0,
            operator: '',
            active: 0,
            dialogVisible: false,
            showExist: false,
            category: '',
            layoutItemType: '',
            programme: {},
            customMarkOptions: [],
            //  2.3.0 新增字段
            layoutBlockId: '',
            layoutBlockItemClone: null
        };
    },
    created() {
        let {navbarId, index, operator} = this.$route.params;
        this.navbarId = navbarId;
        this.index = parseInt(index);
        this.operator = operator;
    },
    computed: {
        ...mapGetters({
            list: 'programme/programmeList',
            programmeSearchFields: 'programme/programmeSearchFields',
            programmePagination: 'programme/programmePagination',
            categoryListString: 'programme/categoryListString',
            typeList: 'programme/typeList',
            getChiefActor: 'programme/getChiefActor',
            //  2.3.0 新增
            activeLayout: 'pageLayout/getActiveLayout',
            getLayoutBlockItem: 'pageLayout/getLayoutBlockItem',
            getLayoutBlockItemByIndex: 'pageLayout/getLayoutBlockItemByIndex'
        }),
        layoutBlockItem() {
            let {operator} = this.$route.params;
            if (operator === 'edit') {
                return this.getLayoutBlockItem(this.layoutBlockId, this.squareIndex);
            } else {
                return this.getLayoutBlockItemByIndex(this.index, this.squareIndex);
            }
        },
        getImageIdByKey() {
            return (key) => {
                return _.get(this.layoutBlockItemClone, `${key}.id`);
            };
        },
        getImageByKey() {
            return (key) => {
                return _.get(this.layoutBlockItemClone, `${key}.uri`);
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
            let rightTop = _.get(this.layoutBlockItemClone, 'cornerMark.rightTop');
            return _.isEmpty(rightTop) ? {} : rightTop;
        },
        rightBottom() {
            let value = '';
            let {leftBottom, rightBottom} = _.get(this.layoutBlockItemClone, 'cornerMark');
            let leftBottomCaption = _.get(leftBottom, 'caption');
            let rightBottomCaption = _.get(rightBottom, 'caption');
            if (rightBottomCaption) {
                value = 2;
            } else {
                if (leftBottomCaption) {
                    value = 1;
                } else {
                    value = '';
                }
            }
            return value;
        },
        //  新的角标规则结束
        getSquareProgrammeId() {
            return _.get(this.layoutBlockItemClone, 'id');
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
                let _index = this.allowResolutions.findIndex((innerImage) => {
                    let width = _.get(innerImage, 'width');
                    let height = _.get(innerImage, 'height');
                    return parseInt(image.width) === parseInt(width) && parseInt(image.height) === parseInt(height);
                });
                return _index >= 0;
            });
            return matchedProgrammeList;
        },
        matchedOrAllow() {
            let size = this.matchedProgrammeList.length === 0 ? this.allowResolutions : _.cloneDeep(this.matchedProgrammeList).map((image) => {
                image.width = parseInt(image.width);
                image.height = parseInt(image.height);
                return image;
            });
            return size;
        }
    },
    methods: {
        ...mapMutations({
            resetProgrammePagination: 'programme/resetProgrammePagination',
            resetProgrammeSearchFields: 'programme/resetProgrammeSearchFields',
            updateProgrammePagination: 'programme/updateProgrammePagination',
            updateProgrammeSearchFields: 'programme/updateProgrammeSearchFields',

            //  2.3.0新增
            updateLayoutBlockById: 'pageLayout/updateLayoutBlockById',
            updateLayoutBlockByIndex: 'pageLayout/updateLayoutBlockByIndex'
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
        updateLayoutBlockItem(payload) {
            let {key, value} = payload;
            let _layoutBlockItemClone = Object.assign({}, this.layoutBlockItemClone, {[key]: value});
            this.layoutBlockItemClone = _layoutBlockItemClone;
        },
        //  弹窗的操作
        async showDialog(layoutItemType, category) {
            try {
                let {id} = this.$route.query;
                this.layoutItemType = layoutItemType;
                this.category = category;
                this.layoutBlockId = id;
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
            this.layoutBlockId = '';
            this.layoutBlockItemClone = null;

            window.removeEventListener('keyup', this.keyupHandler);
        },

        async dialogOpenHandler() {
            try {
                this.layoutBlockItemClone = _.cloneDeep(this.layoutBlockItem);
                if (this.layoutItemType !== _.get(this.layoutBlockItemClone, 'layoutItemType')) {
                    this.layoutBlockItemClone = _.cloneDeep(this.$util.defaultLayoutBlock);
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
            this.layoutBlockItemClone = _.cloneDeep(this.$util.defaultLayoutBlock);
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
            this.updateLayoutBlockItem({ key: 'id', value: id });
            this.updateLayoutBlockItem({ key: 'name', value: name });
            this.updateLayoutBlockItem({ key: 'desc', value: desc });
            if (programmeTemplate) {
                this.updateLayoutBlockItem({ key: 'programmeTemplate', value: programmeTemplate });
            }
            //  清除封面图和角标
            this.updateLayoutBlockItem({ key: 'coverImage', value: {} });
            this.updateLayoutBlockItem({ key: 'coverImageBackground', value: {} });
            this.updateLayoutBlockItem({ key: 'cornerMark', value: {leftTop: {}, rightTop: {}, leftBottom: {}, rightBottom: {}} });

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
        //  图片上传成功之后的毁掉
        async uploadProgrammeCoverImageSuccessHandler(image) {
            try {
                let {id, posterImageList} = this.programme;
                // let clonePosterImageList = _.cloneDeep(posterImageList);
                let clonePosterImageList = this.$util.imageWidth240AndWidth260NoRepeat(image, _.cloneDeep(posterImageList));
                clonePosterImageList.push(image);
                clonePosterImageList = _.uniqBy(clonePosterImageList, 'id');
                let programme = {
                    posterImageList: clonePosterImageList
                };
                if (this.$util.checkSize(image)) {
                    programme.coverImage = image;
                }
                let res = await this.$service.updatePartProgrammeInfo({ id, programme });
                if (res && res.code === 0) {
                    this.programme = Object.assign({}, this.programme, {posterImageList: clonePosterImageList});
                }
            } catch (err) {
                console.log(err);
            }
        },
        uploadProgrammeBgImageSuccessHandler(image) {
            this.uploadProgrammeCoverImageSuccessHandler(image);
        },
        changeCoverImageHandler(image) {
            this.updateLayoutBlockItem({ key: 'coverImage', value: image });
        },
        changeBgImageHandler(image) {
            this.updateLayoutBlockItem({ key: 'coverImageBackground', value: image });
        },
        deleteBgImageHandler() {
            this.updateLayoutBlockItem({ key: 'coverImageBackground', value: null });
        },
        //  角标的相关操作
        rightBottomMarkSelectHandler(value) {
            let {score, featureVideoCount, totalSets, programmeTemplate, latestTermName} = this.programme;
            let leftBottomCaption = '';
            switch (programmeTemplate) {
                case 'TV_DRAMA':
                    leftBottomCaption = featureVideoCount ? `更新至${featureVideoCount}集` : '';
                    break;
                case 'TV_SHOW':
                    leftBottomCaption = featureVideoCount ? `更新至${latestTermName}期` : '';
                    break;
                default:
                    leftBottomCaption = '';
            }

            if (programmeTemplate === 'TV_DRAMA' && totalSets && featureVideoCount === totalSets) {
                leftBottomCaption = `${totalSets}集全`;
            }

            if (value === 1) {
                this.updateLayoutItemCornerMarkByIndex('leftBottom', Object.assign({}, value, {caption: leftBottomCaption}));
                this.updateLayoutItemCornerMarkByIndex('rightBottom', Object.assign({}, value, {caption: null}));
            } else if (value === 2) {
                this.updateLayoutItemCornerMarkByIndex('rightBottom', Object.assign({}, value, {caption: score}));
                this.updateLayoutItemCornerMarkByIndex('leftBottom', Object.assign({}, value, {caption: null}));
            } else {
                this.updateLayoutItemCornerMarkByIndex('leftBottom', Object.assign({}, value, {caption: null}));
                this.updateLayoutItemCornerMarkByIndex('rightBottom', Object.assign({}, value, {caption: null}));
            }
        },
        customMarkSelectHandler(mark) {
            let value = _.isEmpty(mark) ? {} : mark;
            this.updateLayoutItemCornerMarkByIndex('rightTop', value);
        },
        updateLayoutItemCornerMarkByIndex(key, value) {
            let markType = '';
            switch (key) {
                case 'leftTop':
                    markType = 'PLATFORM';
                    break;
                case 'leftBottom':
                    markType = 'EPISODES_NUMBER';
                    break;
                case 'rightBottom':
                    markType = 'SCORE';
                    break;
                case 'rightTop':
                    markType = 'CUSTOM';
                    break;
                default:
                    throw new Error('角标的key不存在');
            }
            let cornerMark = _.cloneDeep(this.layoutBlockItemClone.cornerMark);
            let obj = Object.assign({}, value, {markType});
            let newCornerMark = Object.assign({}, cornerMark, {[key]: obj});
            this.updateLayoutBlockItem({key: 'cornerMark', value: newCornerMark});
        },
        //  节目展示的相关操作
        setSquareProgrammeLayoutItemType(layoutItemType) {
            this.updateLayoutBlockItem({ key: 'layoutItemType', value: layoutItemType });
        },
        //  最后一步的确认处理函数
        enterHandler() {
            this.updateLayoutBlockItem({key: 'layoutItemType', value: 'PROGRAMME'});
            if (this.operator === 'edit') {
                this.updateLayoutBlockById({
                    squareIndex: this.squareIndex,
                    layoutBlockId: this.layoutBlockId,
                    layoutBlockItem: this.layoutBlockItemClone
                });
            } else {
                this.updateLayoutBlockByIndex({
                    squareIndex: this.squareIndex,
                    index: this.index,
                    layoutBlockItem: this.layoutBlockItemClone
                });
            }
            this.closeDialog();
        },
        cancelHanlder() {
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

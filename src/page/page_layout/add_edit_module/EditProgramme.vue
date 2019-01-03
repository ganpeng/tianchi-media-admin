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
                    <el-step title="设置展示方式"></el-step>
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
                                    v-model="keyword"
                                >
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" class="btn-style-one" @click="searchEnterHandler">搜索</el-button>
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
                            @size-change="handlePaginationChange($event, 'pageSize')"
                            @current-change="handlePaginationChange($event, 'pageNum')"
                            :current-page="programmePagination.pageNum"
                            :page-sizes="[5, 10, 20, 30, 50]"
                            :page-size="programmePagination.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
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
                                        name="with4sCoverImage"
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
                                        name="with4sBgImage"
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
                <div v-show="active === 2" class="step-three">
                    <el-form status-icon label-width="120px" class="my-el-form" @submit.native.prevent>
                        <el-col :span="14">
                            <el-form-item label="节目角标">
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
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <div v-show="active === 3" class="step-three">
                    <el-form status-icon label-width="120px" class="my-el-form" @submit.native.prevent>
                        <el-col :span="12">
                            <el-form-item label="节目展示方式">
                                    <el-radio @input="setSquareProgrammeLayoutItemType('PROGRAMME')" :value="getSquareProgrammeLayoutItemType" label="PROGRAMME">进入节目详情页</el-radio>
                                    <el-radio @input="setSquareProgrammeLayoutItemType('PROGRAMME_LIST')" :value="getSquareProgrammeLayoutItemType" label="PROGRAMME_LIST">进入节目列表页</el-radio>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="cancelHanlder">取 消</el-button>
                    <el-button v-show="active > 0" class="btn-style-three prev-btn" @click="prevBtnClickHandler">上一步</el-button>
                    <el-button v-show="active < 3" class="btn-style-three next-btn" @click="nextBtnClickHandler">下一步</el-button>
                    <el-button v-show="active === 3" type="primary" class="btn-style-two" @click="enterHandler">确 定</el-button>
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
            keyword: '',
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
            programmePagination: 'programme/programmePagination',
            categoryListString: 'programme/categoryListString',
            typeList: 'programme/typeList',
            getChiefActor: 'programme/getChiefActor',
            layout: 'pageLayout/layout',
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
                return _.get(this.layout, `${this.navbarId}.data.${this.index}.layoutItemMultiList.${this.squareIndex}.${key}.uri`);
            };
        },
        rightTop() {
            let {rightTop} = this.getLayoutItemCornerMark(this.navbarId, this.index, this.squareIndex);
            return _.isEmpty(rightTop) ? {} : rightTop;
        },
        showLeftBottom() {
            let categoryList = _.get(this.programme, 'categoryList');
            if (categoryList && _.isArray(categoryList)) {
                return categoryList.filter((category) => {
                    return category.name === '卫视综艺' || category.name === '网络综艺' || category.name === '电视剧';
                }).length > 0;
            } else {
                return false;
            }
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
        markCheckedByKey() {
            return (key) => {
                let cornerMark = this.getLayoutItemCornerMark(this.navbarId, this.index, this.squareIndex);
                let mark = _.get(cornerMark, `${key}.caption`);
                return !!mark;
            };
        },
        getSquareProgrammeId() {
            return _.get(this.layout, `${this.navbarId}.data.${this.index}.layoutItemMultiList.${this.squareIndex}.id`);
        },
        getSquareProgrammeLayoutItemType() {
            return _.get(this.layout, `${this.navbarId}.data.${this.index}.layoutItemMultiList.${this.squareIndex}.layoutItemType`);
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
            updateProgrammePagination: 'programme/updateProgrammePagination',
            updateLayoutItemByIndex: 'pageLayout/updateLayoutItemByIndex',
            cancelLayoutItemByIndex: 'pageLayout/cancelLayoutItemByIndex',
            updateLayoutItemCornerMarkByIndex: 'pageLayout/updateLayoutItemCornerMarkByIndex'
        }),
        ...mapActions({
            getProgrammeList: 'programme/getProgrammeList',
            getProgrammeListByNews: 'programme/getProgrammeListByNews',
            getProgrammeCategory: 'programme/getProgrammeCategory',
            getCustomMarkList: 'pageLayout/getCustomMarkList'
        }),
        keyupHandler(e) {
            if (e.keyCode === 13) {
                this.searchEnterHandler();
            }
        },
        //  弹窗的操作
        async showDialog(category) {
            try {
                this.dialogVisible = true;
                await this.getProgrammeCategory();
                if (category) {
                    await this.getProgrammeListByNews();
                } else {
                    await this.getProgrammeList();
                }

                window.addEventListener('keyup', this.keyupHandler);
            } catch (err) {
                console.log(err);
            }
        },
        closeDialog() {
            this.resetProgrammePagination();
            this.dialogVisible = false;
            this.active = 0;
            this.keyword = '';
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
                if (this.getSquareProgrammeId) {
                    await this.getProgrammeCategory();
                    let res = await this.$service.getProgrammeInfo({id: this.getSquareProgrammeId});
                    if (res && res.code === 0) {
                        this.programme = res.data;
                        this.showExist = true;
                    }
                }
                let markRes = await this.getCustomMarkList();
                if (markRes && markRes.code === 0) {
                    this.customMarkOptions = markRes.data;
                }
            } catch (err) {
                console.log(err);
            }
        },
        changeProgrammeHandler() {
            this.showExist = false;
        },
        // 弹窗的操作结束
        handlePaginationChange(value, key) {
            this.updateProgrammePagination({key, value});
            this.getProgrammeList();
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
        //  节目列表搜索
        setProgrammeSubjectHandler(programme) {
            let {id, name, desc, programmeTemplate} = programme;
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'id', value: id });
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'name', value: name });
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'desc', value: desc });
            if (programmeTemplate) {
                this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'programmeTemplate', value: programmeTemplate });
            }
            this.programme = programme;
        },
        tableRowClassName({row, rowIndex}) {
            return row.id === this.getSquareProgrammeId ? 'checked' : '';
        },
        searchEnterHandler() {
            if (this.keyword) {
                this.getProgrammeList(this.keyword);
            } else {
                this.getProgrammeList();
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
        //  角标的相关操作
        markChangeHandler(value, key) {
            let {score, featureVideoCount, platformList} = this.programme;
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
                        value: value ? {caption: `${featureVideoCount}`} : {}
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
        //  节目展示的相关操作
        setSquareProgrammeLayoutItemType(layoutItemType) {
            let {navbarId, index} = this.$route.params;
            this.updateLayoutItemByIndex({ index, navbarId, squareIndex: this.squareIndex, key: 'layoutItemType', value: layoutItemType });
        },
        //  最后一步的确认处理函数
        enterHandler() {
            if (this.getSquareProgrammeLayoutItemType) {
                this.closeDialog();
            } else {
                this.$message.error('请选择节目展示方式');
                return false;
            }
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
    .mark-container {
        display: flex;
        flex-wrap: wrap;
        .mark-item {
            font-size: 16px;
            color: #A8ABB3;
            width: 40%;
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

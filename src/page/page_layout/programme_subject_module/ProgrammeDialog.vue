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
                <el-steps class="my-steps" :active="active" finish-status="success">
                    <el-step title="选择节目"></el-step>
                    <el-step title="选择图片"></el-step>
                    <el-step title="设置角标"></el-step>
                </el-steps>
                <div class="seperator-line"></div>
                <div v-show="active === 0" class="step-one">
                    <div class="step-one-wrapper">
                        <el-table
                            :row-class-name="tableRowClassName"
                            ref="multipleTable"
                            header-row-class-name="common-table-header" class="my-table-style" :data="programmeList" border>
                            <el-table-column  align="center" label="选择">
                                <template slot-scope="scope">
                                    <el-radio :disabled="rowDisabled(scope.row)" :value="getSquareProgrammeId" :label="scope.row.id" @input="setProgrammeSubjectHandler(scope.row)">&nbsp;</el-radio>
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
                </div>
                <div v-show="active === 1" class="step-two">
                    <el-form class="my-el-form" status-icon label-width="120px" @submit.native.prevent>
                        <el-col :span="24">
                            <el-form-item label="非焦点图" required>
                                <div class="image-container">
                                    <select-image
                                        name="programmeSubjectCoverImage"
                                        :images="matchedProgrammeList"
                                        :id="getImageIdByKey('coverImage') || ''"
                                        :allowResolutions="allowResolutions"
                                        :changeImageHandler="changeCoverImageHandler"
                                    ></select-image>
                                    <single-image-uploader
                                        id="programmeSubjectImageUploaderOne"
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
                                        name="programmeSubjectBgImage"
                                        :showDeleteImageBtn="true"
                                        :deleteImage="deleteBgImageHandler"
                                        :images="matchedProgrammeList"
                                        :id="getImageIdByKey('coverImageBackground') || ''"
                                        :allowResolutions="allowResolutions"
                                        :changeImageHandler="changeBgImageHandler"
                                    ></select-image>
                                    <single-image-uploader
                                        id="programmeSubjectImageUploaderTwo"
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
                                        <el-checkbox :checked="leftTopChecked" @change="markChangeHandler($event, 'leftTop')" :disabled="leftTopDisabled">
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
                                        <el-checkbox :checked="leftBottomChecked" @change="markChangeHandler($event, 'leftBottom')" :disabled="leftBottomDisabled">
                                            左下角：更新
                                        </el-checkbox>
                                    </div>
                                    <div class="mark-item">
                                        <el-checkbox :checked="rightBottomChecked" @change="markChangeHandler($event, 'rightBottom')" :disabled="rightBottomDisabled">
                                            右下角：评分
                                        </el-checkbox>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer text-right margin-top-l">
                    <el-button @click="cancelHanlder">取 消</el-button>
                    <el-button v-show="active > 0" class="btn-style-three" @click="prevBtnClickHandler">上一步</el-button>
                    <el-button v-show="active < 2" class="btn-style-three" @click="nextBtnClickHandler">下一步</el-button>
                    <el-button v-show="active === 2" type="primary" @click="enterHandler">确 定</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {mapGetters, mapActions, mapMutations} from 'vuex';
import _ from 'lodash';
import SingleImageUploader from 'sysComponents/custom_components/custom/SingleImageUploader';
import SelectImage from '../add_edit_module/SelectImage';
export default {
    name: 'ProgrammeDialog',
    props: {
        squareIndex: {
            type: Number,
            default: 0
        },
        allowResolutions: {
            type: Array,
            default: () => []
        },
        programmeList: {
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
            active: 0,
            dialogVisible: false,
            programme: {},
            customMarkOptions: []
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
        leftTopDisabled() {
            return _.get(this.programme, 'platformList.length') === 0;
        },
        leftBottomDisabled() {
            let {leftBottomMarkCaption} = this.programme;
            if (leftBottomMarkCaption) {
                return !(this.programme && this.programme.leftBottomMarkCaption);
            } else {
                return !(this.programme && this.programme.featureVideoCount);
            }
        },
        rightBottomDisabled() {
            return !(this.programme && this.programme.score);
        },
        leftTopChecked() {
            let {leftTop} = this.getLayoutItemCornerMark(this.navbarId, this.index, this.squareIndex);
            if (_.isEmpty(leftTop) || !_.get(leftTop, 'caption')) {
                return false;
            } else {
                return true;
            }
        },
        leftBottomChecked() {
            let {leftBottom} = this.getLayoutItemCornerMark(this.navbarId, this.index, this.squareIndex);
            if (_.isEmpty(leftBottom) || !_.get(leftBottom, 'caption')) {
                return false;
            } else {
                return true;
            }
        },
        rightBottomChecked() {
            let {rightBottom} = this.getLayoutItemCornerMark(this.navbarId, this.index, this.squareIndex);
            if (_.isEmpty(rightBottom) || !_.get(rightBottom, 'caption')) {
                return false;
            } else {
                return true;
            }
        },
        rowDisabled() {
            return (row) => {
                let layoutItemMultiList = _.get(this.layout, `${this.navbarId}.data.${this.index}.layoutItemMultiList`);
                let index = layoutItemMultiList.findIndex((item) => item.id === row.id);
                return index >= 0;
            };
        },
        getSquareProgrammeId() {
            let id = _.get(this.layout, `${this.navbarId}.data.${this.index}.layoutItemMultiList.${this.squareIndex}.id`);
            return id;
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
            updateProgrammePagination: 'programme/updateProgrammePagination',
            updateLayoutItemByIndex: 'pageLayout/updateLayoutItemByIndex',
            cancelLayoutItemByIndex: 'pageLayout/cancelLayoutItemByIndex',
            updateLayoutItemCornerMarkByIndex: 'pageLayout/updateLayoutItemCornerMarkByIndex'
        }),
        ...mapActions({
            getCustomMarkList: 'pageLayout/getCustomMarkList'
        }),
        //  弹窗的操作
        showDialog(category) {
            this.dialogVisible = true;
        },
        closeDialog() {
            this.dialogVisible = false;
            this.active = 0;
            this.programme = {};
        },
        async dialogOpenHandler() {
            try {
                let res = await this.getCustomMarkList();
                if (this.getSquareProgrammeId) {
                    let programme = this.programmeList.find((item) => item.id === this.getSquareProgrammeId);
                    if (programme) {
                        this.programme = programme;
                    }
                }
                if (res && res.code === 0) {
                    this.customMarkOptions = res.data;
                }
            } catch (err) {
                console.log(err);
            }
        },
        // 弹窗的操作结束
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
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'id', value: id });
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'name', value: name });
            this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'desc', value: desc });
            if (programmeTemplate) {
                this.updateLayoutItemByIndex({ index: this.index, navbarId: this.navbarId, squareIndex: this.squareIndex, key: 'programmeTemplate', value: programmeTemplate });
            }
            this.programme = programme;
        },
        tableRowClassName({row, rowIndex}) {
            return row.id === this.getSquareProgrammeId || this.rowDisabled(row) ? 'checked' : '';
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
                        value: value ? {caption: _.get(platformList, '0')} : {}
                    });
                    break;
                case 'leftBottom':
                    this.updateLayoutItemCornerMarkByIndex({
                        navbarId: this.navbarId,
                        index: this.index,
                        squareIndex: this.squareIndex,
                        key: 'leftBottom',
                        value: value ? {caption: featureVideoCount} : {}
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

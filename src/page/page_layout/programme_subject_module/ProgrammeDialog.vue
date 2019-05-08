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
                    <div class="step-one-wrapper">
                        <el-table
                            :row-class-name="tableRowClassName"
                            ref="multipleTable"
                            header-row-class-name="common-table-header" class="my-table-style" :data="programmeList" border>
                            <el-table-column  align="center" label="选择">
                                <template slot-scope="scope">
                                    <el-radio :disabled="rowDisabled(scope.row)" :value="getSquareProgrammeId" :label="scope.row.id" @input="setProgrammeHandler(scope.row)">&nbsp;</el-radio>
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
        let {navbarId, index} = this.$route.params;
        this.navbarId = navbarId;
        this.index = parseInt(index);
    },
    computed: {
        ...mapGetters({
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
            if (!_.isNull(leftBottomCaption) && _.isNull(rightBottomCaption)) {
                value = 1;
            }

            if (_.isNull(leftBottomCaption) && !_.isNull(rightBottomCaption)) {
                value = 2;
            }
            return value;
        },
        rowDisabled() {
            return (row) => {
                let layoutItemMultiList = _.get(this.layoutBlockItemClone, `layoutItemMultiList`);
                if (layoutItemMultiList) {
                    layoutItemMultiList = layoutItemMultiList.filter((item) => item.id !== this.getSquareProgrammeId);
                    let index = layoutItemMultiList.findIndex((item) => item.id === row.id);
                    return index >= 0;
                } else {
                    return false;
                }
            };
        },
        getSquareProgrammeId() {
            return _.get(this.layoutBlockItemClone, 'id');
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
            //  2.3.0新增
            updateLayoutBlockById: 'pageLayout/updateLayoutBlockById',
            updateLayoutBlockByIndex: 'pageLayout/updateLayoutBlockByIndex'
        }),
        ...mapActions({
            getCustomMarkList: 'pageLayout/getCustomMarkList'
        }),
        updateLayoutBlockItem(payload) {
            let {key, value} = payload;
            let _layoutBlockItemClone = Object.assign({}, this.layoutBlockItemClone, {[key]: value});
            this.layoutBlockItemClone = _layoutBlockItemClone;
        },
        //  弹窗的操作
        async showDialog(layoutItemType, category) {
            try {
                let {id} = this.$route.query;
                this.layoutBlockId = id;
                this.layoutItemType = layoutItemType;
                this.category = category;

                this.dialogVisible = true;
                window.addEventListener('keyup', this.keyupHandler);
            } catch (err) {
                console.log(err);
            }
        },
        closeDialog() {
            this.dialogVisible = false;
            this.layoutItemType = '';
            this.category = '';
            this.active = 0;
            this.programme = {};

            this.layoutBlockId = '';
            this.layoutBlockItemClone = null;
        },
        async dialogOpenHandler() {
            try {
                this.layoutBlockItemClone = _.cloneDeep(this.layoutBlockItem);
                let _layoutItemType = _.get(this.layoutBlockItemClone, 'layoutItemType');
                if (this.layoutItemType !== _layoutItemType) {
                    this.layoutBlockItemClone = _.cloneDeep(this.$util.defaultLayoutBlock);
                } else {
                    if (this.getSquareProgrammeId) {
                        let res = await this.$service.getProgrammeInfo({id: this.getSquareProgrammeId});
                        if (res && res.code === 0) {
                            this.programme = res.data;
                        }
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
        setProgrammeHandler(programme) {
            let {id, name, desc, programmeTemplate} = programme;
            this.updateLayoutBlockItem({ key: 'id', value: id });
            this.updateLayoutBlockItem({ key: 'name', value: name });
            this.updateLayoutBlockItem({ key: 'desc', value: desc });
            if (programmeTemplate) {
                this.updateLayoutBlockItem({ key: 'programmeTemplate', value: programmeTemplate });
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
        //  最后一步的确认处理函数
        enterHandler() {
            let {operator} = this.$route.params;
            this.updateLayoutBlockItem({ key: 'layoutItemType', value: 'PROGRAMME' });
            if (operator === 'edit') {
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
                console.log(this.activeLayout);
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

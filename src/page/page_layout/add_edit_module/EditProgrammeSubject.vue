<!--  设置为节目专题的弹窗 -->
<template>
    <div class="edit-programme-subject-container">
        <el-dialog
            title="设置为节目专题"
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
                <el-steps class="my-steps" :active="active" align-center finish-status="success">
                    <el-step title="选择节目专题"></el-step>
                    <el-step title="选择图片"></el-step>
                    <el-step title="设置角标"></el-step>
                </el-steps>
                <div class="seperator-line"></div>
                <div v-show="active === 0" class="step-one">
                    <div v-if="showExist">
                        <p class="table-title">已选择的节目专题</p>
                        <el-table
                            :row-class-name="tableRowClassName"
                            :header-row-class-name='"common-table-header"' class="my-table-style" :data="checkedProgrammeSubjectList" border>
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
                        <div class="btn-wrapper text-center">
                            <el-button @click="changeProgrammeHandler" class="btn-style-two">更换专题</el-button>
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
                                <el-button type="primary" class="btn-style-one" @click="searchEnterHandler">
                                    <svg-icon icon-class="search"></svg-icon>
                                    搜索
                                </el-button>
                            </el-form-item>
                        </el-form>
                        <el-table
                            :row-class-name="tableRowClassName"
                            :header-row-class-name='"common-table-header"' class="my-table-style" :data="programmeSubject.list" border>
                            <el-table-column align="center" width="60px" label="选择">
                                <template slot-scope="scope">
                                    <el-radio :value="getSquareProgrammeSubjectId" :label="scope.row.id" @input="setProgrammeSubjectHandler(scope.row)">&nbsp;</el-radio>
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
                            layout="total, prev, pager, next, jumper"
                            :page-size="programmeSubject.pagination.pageSize"
                            :total="programmeSubject.pagination.total">
                        </el-pagination>
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
                            <el-form-item label="右上角角标">
                                <div class="page-layout-mark">
                                    <div class="mark-container">
                                        <div class="mark-item">
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
    name: 'EditProgrammeSubject',
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
            index: '',
            showExist: false,
            layoutItemType: '',
            active: 0,
            dialogVisible: false,
            programmeSubjectData: {},
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
            programmeSubject: 'pageLayout/programmeSubject',

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
        getSquareProgrammeSubjectId() {
            return _.get(this.layoutBlockItemClone, `id`);
        },
        rightTop() {
            let rightTop = _.get(this.layoutBlockItemClone, 'cornerMark.rightTop');
            return _.isEmpty(rightTop) ? {} : rightTop;
        },
        checkedProgrammeSubjectList() {
            if (this.getSquareProgrammeSubjectId && !_.isEmpty(this.programmeSubjectData)) {
                return [this.programmeSubjectData];
            } else {
                return [];
            }
        },
        matchedProgrammeList() {
            let posterProgrammeList = _.get(this.programmeSubjectData, 'posterImageList') || [];
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
            resetProgrammeSubject: 'pageLayout/resetProgrammeSubject',
            updateProgrammeSubject: 'pageLayout/updateProgrammeSubject',
            cancelLayoutItemByIndex: 'pageLayout/cancelLayoutItemByIndex',
            updateProgrammeSubjectPagination: 'pageLayout/updateProgrammeSubjectPagination',
            updateLayoutItemCornerMarkByIndex: 'pageLayout/updateLayoutItemCornerMarkByIndex',
            resetLayoutItemByIndex: 'pageLayout/resetLayoutItemByIndex',

            //  2.3.0新增
            updateLayoutBlockById: 'pageLayout/updateLayoutBlockById',
            updateLayoutBlockByIndex: 'pageLayout/updateLayoutBlockByIndex'
        }),
        ...mapActions({
            getProgrammeSubjectList: 'pageLayout/getProgrammeSubjectList',
            getCustomMarkList: 'pageLayout/getCustomMarkList'
        }),
        keyupHandler(e) {
            if (e.keyCode === 13) {
                this.searchEnterHandler();
            }
        },
        //  弹窗的操作
        showDialog(layoutItemType) {
            let {id} = this.$route.query;
            this.layoutBlockId = id;
            this.layoutItemType = layoutItemType;
            this.dialogVisible = true;
            window.addEventListener('keyup', this.keyupHandler);
        },
        closeDialog() {
            this.resetProgrammeSubject();
            this.dialogVisible = false;
            this.active = 0;
            this.showExist = false;
            this.layoutItemType = '';
            this.programmeSubjectData = {};

            this.layoutBlockId = '';
            this.layoutBlockItemClone = null;

            window.removeEventListener('keyup', this.keyupHandler);
        },
        async dialogOpenHandler() {
            try {
                this.layoutBlockItemClone = _.cloneDeep(this.layoutBlockItem);
                let _layoutItemType = _.get(this.layoutBlockItemClone, 'layoutItemType');
                if (this.layoutItemType !== _layoutItemType) {
                    this.layoutBlockItemClone = _.cloneDeep(this.$util.defaultLayoutBlock);
                } else {
                    if (this.getSquareProgrammeSubjectId) {
                        let res = await this.$service.getSubjectById(this.getSquareProgrammeSubjectId);
                        if (res && res.code === 0) {
                            this.programmeSubjectData = res.data;
                            this.showExist = true;
                        }
                    }
                }

                this.updateProgrammeSubjectPagination({key: 'pageSize', value: 5});
                await this.getProgrammeSubjectList();

                let markRes = await this.getCustomMarkList();
                if (markRes && markRes.code === 0) {
                    this.customMarkOptions = markRes.data;
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
            this.updateProgrammeSubjectPagination({key, value});
            this.getProgrammeSubjectList();
        },
        //  上下步的处理方法
        prevBtnClickHandler() {
            if (this.active > 0) {
                this.active--;
            }
        },
        nextBtnClickHandler() {
            if (this.active < 2) {
                if (this.active === 0) {
                    if (this.getSquareProgrammeSubjectId) {
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
        searchInputHandler(value, key) {
            this.updateProgrammeSubject({key, value});
        },
        searchEnterHandler() {
            this.getProgrammeSubjectList();
        },
        updateLayoutBlockItem(payload) {
            let {key, value} = payload;
            let _layoutBlockItemClone = Object.assign({}, this.layoutBlockItemClone, {[key]: value});
            this.layoutBlockItemClone = _layoutBlockItemClone;
        },
        setProgrammeSubjectHandler(programmeSubjectData) {
            let {id, name} = programmeSubjectData;
            this.updateLayoutBlockItem({ key: 'id', value: id });
            this.updateLayoutBlockItem({ key: 'name', value: name });
            this.programmeSubjectData = programmeSubjectData;
        },
        tableRowClassName({row, rowIndex}) {
            return row.id === this.getSquareProgrammeSubjectId ? 'checked' : '';
        },
        //  图片上传成功之后的毁掉
        async uploadProgrammeCoverImageSuccessHandler(image) {
            try {
                let {id, posterImageList} = this.programmeSubjectData;
                let clonePosterImageList = _.cloneDeep(posterImageList);
                clonePosterImageList.push(image);
                clonePosterImageList = _.uniqBy(clonePosterImageList, 'id');
                let res = await this.$service.updateSubjectById(id, {
                    posterImageList: clonePosterImageList
                });
                if (res && res.code === 0) {
                    this.programmeSubjectData = Object.assign({}, this.programmeSubjectData, {posterImageList: clonePosterImageList});
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
            this.updateLayoutBlockItem({ key: 'layoutItemType', value: 'PROGRAMME_SUBJECT' });
            let {operator} = this.$route.params;
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
